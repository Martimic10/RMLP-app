import { NextResponse } from "next/server";
import { z } from "zod";
import { newReportId } from "@/lib/llm";
import { PRICE_CENTS } from "@/lib/constants";
import { getBaseUrl, getStripe } from "@/lib/stripe";
import { saveReport } from "@/lib/store";
import type { RoastReport } from "@/lib/types";

const bodySchema = z.object({
  url: z.string().url("Enter a valid URL (include https://)"),
  email: z.string().email("Enter a valid email"),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { url, email } = bodySchema.parse(json);

    const reportId = newReportId();
    const pending: RoastReport = {
      id: reportId,
      url,
      email,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    await saveReport(pending);

    const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
    if (!stripeKey) {
      return NextResponse.json(
        {
          error:
            "Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local",
        },
        { status: 500 }
      );
    }

    const stripe = getStripe();
    const base = getBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: PRICE_CENTS,
            product_data: {
              name: "Landing Page Roast",
              description: "Full AI critique — 6 sections, grades, rewrites",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        reportId,
        url,
        email,
      },
      success_url: `${base}/report/${reportId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: base,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
