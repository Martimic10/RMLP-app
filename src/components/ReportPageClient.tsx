"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ReportLoading } from "./ReportLoading";
import { ReportView } from "./ReportView";
import { APP_NAME } from "@/lib/constants";
import type { RoastReport } from "@/lib/types";

const POLL_MS = 3000;

function ReportPageInner({
  reportId,
  initialReport,
}: {
  reportId: string;
  initialReport: RoastReport;
}) {
  const searchParams = useSearchParams();
  const confirmStarted = useRef(false);
  const [report, setReport] = useState(initialReport);
  const [justReady, setJustReady] = useState(false);

  const isLoading =
    report.status === "pending" || report.status === "processing";

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId || confirmStarted.current || !isLoading) return;
    confirmStarted.current = true;

    fetch("/api/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    }).catch(console.error);
  }, [searchParams, isLoading]);

  useEffect(() => {
    if (!isLoading) return;

    let active = true;

    async function poll() {
      const res = await fetch(`/api/report/${reportId}`, { cache: "no-store" });
      if (!res.ok || !active) return;

      const data = (await res.json()) as RoastReport;
      if (!active) return;

      setReport((prev) => {
        const wasLoading =
          prev.status === "pending" || prev.status === "processing";
        if (
          wasLoading &&
          (data.status === "complete" || data.status === "failed")
        ) {
          setJustReady(true);
        }
        return data;
      });
    }

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [reportId, isLoading]);

  return (
    <main className="relative min-h-screen overflow-x-hidden py-6 sm:py-14">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-64 w-full max-w-[600px] -translate-x-1/2 rounded-full bg-flame/8 blur-[80px] sm:h-[420px] sm:blur-[100px]" />
      </div>

      <div className="safe-px relative z-10 mx-auto max-w-3xl">
        <header className="mb-6 flex items-center justify-between gap-3 sm:mb-8">
          <Link
            href="/"
            className="min-w-0 truncate font-mono text-[10px] uppercase tracking-widest text-white/35 transition active:text-white/70 sm:text-xs"
          >
            {APP_NAME}
          </Link>
          <span className="shrink-0 font-mono text-[10px] text-white/25 sm:text-xs">
            #{reportId.slice(0, 8)}
          </span>
        </header>

        {isLoading && <ReportLoading url={report.url} />}

        {report.status === "failed" && !isLoading && (
          <div className="animate-report-reveal rounded-sm border border-red-500/25 bg-red-500/5 px-4 py-8 text-center sm:p-10">
            <p className="font-mono text-xs uppercase tracking-widest text-red-400/80">
              Audit failed
            </p>
            <p className="mt-4 break-anywhere text-left text-sm leading-relaxed text-red-200 sm:text-center sm:text-lg">
              {report.error ?? "Something went wrong generating your roast."}
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex min-h-[3rem] items-center justify-center rounded-full bg-flame px-6 py-3 text-sm font-semibold text-black active:scale-[0.98] sm:mt-8"
            >
              Roast another page
            </Link>
          </div>
        )}

        {report.status === "complete" && report.overallGrade && (
          <div className={justReady ? "animate-report-reveal" : ""}>
            <ReportView report={report} />
          </div>
        )}
      </div>
    </main>
  );
}

export function ReportPageClient({
  reportId,
  initialReport,
}: {
  reportId: string;
  initialReport: RoastReport;
}) {
  return (
    <Suspense
      fallback={
        <main className="safe-px flex min-h-screen items-center justify-center text-sm text-white/50 sm:text-base">
          Loading report…
        </main>
      }
    >
      <ReportPageInner reportId={reportId} initialReport={initialReport} />
    </Suspense>
  );
}
