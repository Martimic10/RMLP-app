"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ReportView } from "@/components/ReportView";
import type { RoastReport } from "@/lib/types";

function SuccessContent() {
  const params = useSearchParams();
  const [report, setReport] = useState<RoastReport | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = params.get("session_id");
    const directId = params.get("report_id");

    async function resolveId() {
      if (directId) {
        setReportId(directId);
        return;
      }

      if (sessionId) {
        const res = await fetch(`/api/session?session_id=${sessionId}`);
        const data = (await res.json()) as { reportId?: string; error?: string };
        if (data.reportId) {
          setReportId(data.reportId);
        } else {
          setError(data.error ?? "Could not load session");
        }
      }
    }

    resolveId();
  }, [params]);

  useEffect(() => {
    if (!reportId) return;

    let active = true;

    async function poll() {
      const res = await fetch(`/api/report/${reportId}`);
      if (!res.ok) return;
      const data = (await res.json()) as RoastReport;
      if (!active) return;
      setReport(data);

      if (data.status === "pending" || data.status === "processing") {
        setTimeout(poll, 2000);
      }
    }

    poll();
    return () => {
      active = false;
    };
  }, [reportId]);

  const processing =
    report?.status === "pending" || report?.status === "processing";

  return (
    <main className="safe-px relative min-h-screen overflow-x-hidden py-8 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-block min-h-[2.75rem] py-2 text-sm text-white/40 transition active:text-white sm:mb-10"
        >
          ← Back
        </Link>

        {error && (
          <p className="break-anywhere text-sm text-red-400">{error}</p>
        )}

        {!report && !error && (
          <div className="flex flex-col items-center gap-5 px-2 py-12 text-center sm:gap-6 sm:py-20">
            <FlameLoader />
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Preparing your roast…
            </h1>
            <p className="text-sm text-white/50">Usually under 60 seconds</p>
          </div>
        )}

        {processing && report && (
          <div className="flex flex-col items-center gap-5 px-2 py-10 text-center sm:gap-6 sm:py-12">
            <FlameLoader />
            <h1 className="max-w-full break-anywhere font-display text-2xl font-bold text-white sm:text-3xl">
              Roasting {new URL(report.url).hostname}…
            </h1>
            <p className="text-sm text-white/50">
              Scraping · Analyzing · Writing rewrites
            </p>
          </div>
        )}

        {report?.status === "complete" && (
          <>
            <p className="mb-6 break-anywhere text-sm text-emerald-400/90 sm:mb-8">
              ✓ Report saved — also sent to {report.email}
            </p>
            <ReportView report={report} />
            <p className="mt-8 text-center text-sm text-white/40 sm:mt-10">
              <Link
                href={`/report/${report.id}`}
                className="inline-block min-h-[2.75rem] py-2 underline active:text-white"
              >
                Permanent link
              </Link>
            </p>
          </>
        )}

        {report?.status === "failed" && <ReportView report={report} />}
      </div>
    </main>
  );
}

function FlameLoader() {
  return (
    <div className="relative h-14 w-14 sm:h-16 sm:w-16">
      <span className="absolute inset-0 animate-ping rounded-full bg-flame/30" />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-flame text-xl sm:h-16 sm:w-16 sm:text-2xl">
        🔥
      </span>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="safe-px flex min-h-screen items-center justify-center text-white/50">
          Loading…
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
