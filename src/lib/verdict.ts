import type { LetterGrade } from "./types";

const FALLBACK_VERDICT: Record<LetterGrade, string> = {
  A: "Strong foundation — polish the details and you're converting.",
  B: "Solid page with clear leaks — fix them before you scale traffic.",
  C: "Visitors are interested but not convinced — copy is the bottleneck.",
  D: "Your page is working against you — several sections need rewrites.",
  F: "This isn't selling yet — but every section below is fixable.",
};

export function getVerdict(grade: LetterGrade, summary?: string): string {
  if (summary?.trim()) return summary.trim();
  return FALLBACK_VERDICT[grade];
}
