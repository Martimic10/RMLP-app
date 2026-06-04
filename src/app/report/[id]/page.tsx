import { notFound } from "next/navigation";
import { ReportPageClient } from "@/components/ReportPageClient";
import { getReport } from "@/lib/store";

export default async function ReportPage({
  params,
}: {
  params: { id: string };
}) {
  const report = await getReport(params.id);

  if (!report) {
    notFound();
  }

  return <ReportPageClient reportId={params.id} initialReport={report} />;
}
