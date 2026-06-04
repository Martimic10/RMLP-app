import { generateRoast } from "./llm";
import { scrapeLandingPage } from "./firecrawl";
import { sendRoastEmail } from "./resend";
import { getReport, saveReport, updateReport } from "./store";

export async function processRoast(reportId: string): Promise<void> {
  const report = await getReport(reportId);
  if (!report) {
    throw new Error(`Report ${reportId} not found`);
  }

  if (report.status === "complete") {
    return;
  }

  await updateReport(reportId, { status: "processing" });

  try {
    const content = await scrapeLandingPage(report.url);
    const roast = await generateRoast(report.url, content);

    const completed = {
      ...report,
      status: "complete" as const,
      overallGrade: roast.overallGrade,
      summary: roast.summary,
      sections: roast.sections,
    };

    await saveReport(completed);
    await sendRoastEmail(completed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await updateReport(reportId, {
      status: "failed",
      error: message,
    });
    throw err;
  }
}
