import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const reportId = session.metadata?.reportId;

    if (!reportId) {
      return NextResponse.json({ error: "Report not linked" }, { status: 404 });
    }

    return NextResponse.json({ reportId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Session lookup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
