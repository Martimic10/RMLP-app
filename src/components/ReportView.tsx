"use client";

import Link from "next/link";
import { useState } from "react";
import { GradeMark } from "./GradeMark";
import { ShareOnX } from "./ShareOnX";
import { getVerdict } from "@/lib/verdict";
import type { RoastReport } from "@/lib/types";

export function ReportView({ report }: { report: RoastReport }) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!report.sections || !report.overallGrade) {
    return null;
  }

  async function copyRewrite(key: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  const verdict = getVerdict(report.overallGrade, report.summary);
  const auditedAt = new Date(report.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  let hostname = report.url;
  try {
    hostname = new URL(report.url).hostname;
  } catch {
    /* keep full url */
  }

  return (
    <article className="overflow-hidden rounded-sm border border-white/10 bg-[#0a0a0c] shadow-[0_0_80px_-20px_rgba(255,77,0,0.15)]">
      <div className="h-1 bg-gradient-to-r from-transparent via-flame to-transparent" />

      <header className="border-b border-white/8 px-4 py-8 sm:px-10 sm:py-14">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/30 sm:text-[10px] sm:tracking-[0.25em]">
          <span>Landing page audit</span>
          <span className="shrink-0">{auditedAt}</span>
        </div>

        <div className="mt-8 flex flex-col items-center text-center sm:mt-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 sm:text-xs sm:tracking-[0.3em]">
            Overall score
          </p>
          <div className="mt-3 sm:mt-4">
            <GradeMark grade={report.overallGrade} size="hero" />
          </div>
          <p className="mt-6 max-w-lg break-anywhere font-display text-lg leading-snug text-white sm:mt-8 sm:text-xl md:text-2xl">
            {verdict}
          </p>
          <a
            href={report.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 font-mono text-[11px] text-white/50 transition active:bg-white/10 hover:border-white/20 hover:text-white/80 sm:mt-6 sm:text-xs"
          >
            <span className="truncate">{hostname}</span>
            <span className="shrink-0" aria-hidden>
              ↗
            </span>
          </a>
        </div>
      </header>

      <div className="divide-y divide-white/6">
        {report.sections.map((section, index) => (
          <section
            key={section.key}
            className="px-4 py-6 sm:px-10 sm:py-10"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="min-w-0 flex-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
                  Section {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-1 break-anywhere font-display text-lg font-semibold text-white sm:text-2xl">
                  {section.title}
                </h2>
              </div>
              <div className="self-start sm:self-auto">
                <GradeMark grade={section.grade} size="section" />
              </div>
            </div>

            <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
              <div className="rounded-sm border-l-2 border-white/15 bg-white/[0.02] py-3.5 pl-4 pr-3 sm:py-4 sm:pl-5 sm:pr-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                  Finding
                </p>
                <p className="mt-2.5 break-anywhere text-[15px] leading-relaxed text-white/65 sm:mt-3 sm:text-base">
                  {section.roast}
                </p>
              </div>

              <div className="rounded-sm border border-emerald-500/20 bg-emerald-950/20 py-3.5 pl-4 pr-3 sm:py-4 sm:pl-5 sm:pr-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-[10px] uppercase leading-snug tracking-[0.15em] text-emerald-400/90 sm:tracking-[0.2em]">
                    Rewrite — copy &amp; paste
                  </p>
                  <button
                    type="button"
                    onClick={() => copyRewrite(section.key, section.rewrite)}
                    className="touch-target shrink-0 rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-white/40 transition active:text-white hover:text-white"
                  >
                    {copiedKey === section.key ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="mt-2.5 break-anywhere font-mono text-[13px] leading-relaxed text-emerald-50/90 sm:mt-3 sm:text-sm">
                  {section.rewrite}
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <footer className="border-t border-white/8 bg-white/[0.02] px-4 py-6 sm:px-10 sm:py-8">
        <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 sm:mb-5 sm:tracking-[0.2em]">
          Share your score · Run it again
        </p>
        <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
          <ShareOnX
            reportId={report.id}
            overallGrade={report.overallGrade}
            url={report.url}
            className="flex min-h-[3rem] flex-1 items-center justify-center gap-2 rounded-sm border border-white/12 bg-white/5 px-5 py-3.5 text-sm font-medium text-white transition active:bg-white/10 hover:border-white/25 hover:bg-white/10"
          />
          <Link
            href="/"
            className="flex min-h-[3rem] flex-1 items-center justify-center rounded-sm bg-flame px-5 py-3.5 text-sm font-semibold text-black transition active:scale-[0.98] hover:brightness-110"
          >
            Roast another page
          </Link>
        </div>
      </footer>
    </article>
  );
}
