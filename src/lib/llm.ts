import { nanoid } from "nanoid";
import type { LetterGrade, RoastResult, RoastSection, SectionKey } from "./types";
import { SECTION_LABELS } from "./types";
import { getBaseUrl } from "./stripe";
import { APP_NAME } from "./constants";

const SECTION_ORDER: SectionKey[] = [
  "headline",
  "hero",
  "cta",
  "trust",
  "objections",
  "clarity",
];

const DEFAULT_MODEL = "anthropic/claude-sonnet-4.5";

const ROAST_SCHEMA = `{
  "overallGrade": "A" | "B" | "C" | "D" | "F",
  "summary": "2-3 sentence brutal but constructive overview",
  "sections": [
    {
      "key": "headline" | "hero" | "cta" | "trust" | "objections" | "clarity",
      "grade": "A" | "B" | "C" | "D" | "F",
      "roast": "Specific critique quoting actual copy from the page",
      "rewrite": "Ready-to-paste improved copy"
    }
  ]
}`;

const SYSTEM_PROMPT = `You are a world-class conversion copywriter and landing page critic who roasts landing pages for indie hackers and startup founders.

Rules:
- Read the scraped page content carefully. This is THEIR real site — not a template.
- Every section roast MUST quote at least one exact phrase from their page (use quotation marks).
- Call out what's weak and why it hurts conversions. No generic advice that could apply to any SaaS.
- Rewrites must be paste-ready replacement copy for that section, written in a similar length/tone.
- Be direct, witty, and constructive — savage but fair.
- Return ONLY valid JSON matching this schema (no markdown fences):
${ROAST_SCHEMA}`;

export type { RoastResult } from "./types";

export function newReportId(): string {
  return nanoid(12);
}

function parseRoastJson(text: string): RoastResult {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse roast JSON from model response");
  }

  const parsed = JSON.parse(jsonMatch[0]) as {
    overallGrade: LetterGrade;
    summary: string;
    sections: Array<{
      key: SectionKey;
      grade: LetterGrade;
      roast: string;
      rewrite: string;
    }>;
  };

  const sections: RoastSection[] = SECTION_ORDER.map((key) => {
    const found = parsed.sections.find((s) => s.key === key);
    return {
      key,
      title: SECTION_LABELS[key],
      grade: found?.grade ?? "C",
      roast: found?.roast ?? "No feedback generated for this section.",
      rewrite: found?.rewrite ?? "",
    };
  });

  return {
    overallGrade: parsed.overallGrade,
    summary: parsed.summary,
    sections,
  };
}

export async function generateRoast(
  pageUrl: string,
  pageContent: string
): Promise<RoastResult> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  const model = process.env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL;
  const userPrompt = `Roast this landing page. Use only evidence from the content below — if something isn't on the page, say so.

URL: ${pageUrl}

Scraped page content (markdown):
---
${pageContent}
---

Evaluate exactly these six sections: ${SECTION_ORDER.map((k) => SECTION_LABELS[k]).join(", ")}.
Use these keys in order: ${SECTION_ORDER.join(", ")}.
Letter grades only (A–F). Summary = one brutal but fair verdict sentence.`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": getBaseUrl(),
      "X-Title": APP_NAME,
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      temperature: 0.7,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter failed (${res.status}): ${err}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("OpenRouter returned empty response");
  }

  return parseRoastJson(text);
}
