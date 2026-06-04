import { Resend } from "resend";
import type { RoastReport } from "./types";
import { getBaseUrl } from "./stripe";
import { APP_NAME } from "./constants";

export async function sendRoastEmail(report: RoastReport): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping roast email");
    return;
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL ?? "Roast <onboarding@resend.dev>";
  const reportUrl = `${getBaseUrl()}/report/${report.id}`;

  await resend.emails.send({
    from,
    to: report.email,
    subject: `Your landing page roast is ready (${report.overallGrade})`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #111;">
        <h1 style="font-size: 24px;">Your roast is ready 🔥</h1>
        <p>Overall grade: <strong>${report.overallGrade}</strong></p>
        <p>${report.summary}</p>
        <p><a href="${reportUrl}" style="display:inline-block;background:#ff4d00;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View full report</a></p>
        <p style="color:#666;font-size:14px;">— ${APP_NAME}</p>
      </div>
    `,
  });
}
