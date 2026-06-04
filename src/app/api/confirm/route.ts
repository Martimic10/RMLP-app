import { NextResponse } from "next/server";
import { processRoast } from "@/lib/roast-pipeline";
import { getStripe } from "@/lib/stripe";
import { getReport } from "@/lib/store";

/**
 * Fallback when the user lands on /report before the webhook fires.
 * Verifies Stripe Checkout was paid, then starts the roast (idempotent).
 */
export async function POST(request: Request) {
  try {
    const { sessionId } = (await request.json()) as { sessionId?: string };

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
    }

    const reportId = session.metadata?.reportId;
    if (!reportId) {
      return NextResponse.json({ error: "Report not linked" }, { status: 400 });
    }

    const report = await getReport(reportId);
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (report.status === "complete") {
      return NextResponse.json({ ok: true, status: "complete" });
    }

    if (report.status === "pending") {
      processRoast(reportId).catch((e) =>
        console.error("Confirm roast failed:", e)
      );
    }

    return NextResponse.json({ ok: true, status: report.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Confirm failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
