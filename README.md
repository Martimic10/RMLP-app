# Roast My Landing Page

Repository: [github.com/Martimic10/RMLP-app](https://github.com/Martimic10/RMLP-app)

Brutally honest, AI-powered landing page feedback for indie hackers and startup founders.

Paste your URL and email, pay **$4** once via Stripe, and get a full critique in ~60 seconds — on-screen and in your inbox. Every roast is shareable.

## Stack

- **Next.js 14** (App Router) on Vercel
- **Stripe** — one-time checkout
- **Firecrawl** — live page scraping
- **OpenRouter** (Claude via API) — structured 6-section roast with grades + rewrites
- **Resend** — email delivery
- **Upstash Redis** — report persistence (file fallback for local dev)

## Rubric (6 sections)

| Section | Output |
|---------|--------|
| Headline | Letter grade, roast quoting your copy, paste-ready rewrite |
| Hero copy | Same |
| CTA | Same |
| Trust signals | Same |
| Objection handling | Same |
| Overall clarity | Same |

Plus an overall grade, summary, shareable `/report/[id]` link, and **Share on X** button.

## Quick start

```bash
npm install
cp .env.example .env.local
```

### Real roasts (recommended)

Add to `.env.local`:

```bash
FIRECRAWL_API_KEY=fc-...           # https://www.firecrawl.dev/app
OPENROUTER_API_KEY=sk-or-v1-...    # https://openrouter.ai/keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...    # stripe listen --forward-to http://127.0.0.1:3000/api/webhook/stripe
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000
```

Firecrawl scrapes their live page → OpenRouter (Claude) roasts their actual copy with quoted phrases and rewrites.

### Stripe

1. Copy `.env.example` → `.env.local` and set `STRIPE_SECRET_KEY` (test or live key from [Stripe API keys](https://dashboard.stripe.com/apikeys)).
2. Set up the webhook (below) and put the signing secret in `STRIPE_WEBHOOK_SECRET`.
3. After payment, users land on `/report/[id]` — the page polls until the roast is ready.

### Stripe webhook

The webhook is what **starts the roast** after payment. Without it, payment succeeds but nothing gets generated (unless the user hits the report URL with `?session_id=`, which triggers a backup confirm).

**Local development (recommended)**

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to http://127.0.0.1:3000/api/webhook/stripe
```

The CLI prints a signing secret like `whsec_...` — put that in `.env.local` as `STRIPE_WEBHOOK_SECRET`, then restart `npm run dev`.

In another terminal, run the app and complete a test checkout with card `4242 4242 4242 4242`.

**Production (Vercel)**

1. [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks) → **Add endpoint**
2. **Endpoint URL:** `https://YOUR-DOMAIN.com/api/webhook/stripe`
3. **Events:** select `checkout.session.completed` only
4. Copy the **Signing secret** (`whsec_...`) into Vercel env as `STRIPE_WEBHOOK_SECRET`
5. Redeploy

Also set in Vercel: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_APP_URL=https://YOUR-DOMAIN.com`, plus OpenRouter, Firecrawl, Resend, and Upstash Redis.

### Upstash Redis (report storage)

Reports must survive Vercel’s serverless restarts — Redis stores each `/report/[id]` for 90 days.

**Option A — Vercel (easiest)**

1. Deploy the repo to [Vercel](https://vercel.com)
2. Project → **Storage** → **Create Database** → **Upstash** → **Redis**
3. Name it (e.g. `rmlp-reports`) → **Create** → **Connect to project**
4. Vercel adds `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` automatically
5. Redeploy

**Option B — Upstash console (local + Vercel)**

1. [console.upstash.com](https://console.upstash.com) → **Create database** (Regional, free tier is fine)
2. Open the database → **REST API** → copy **UPSTASH_REDIS_REST_URL** and **UPSTASH_REDIS_REST_TOKEN**
3. Paste into `.env.local` (local) and Vercel → **Settings → Environment Variables** (production)
4. Restart dev server: `npm run dev`

**Verify:** open `http://127.0.0.1:3000/api/health` — should show `"storage": "redis"` and `"redis": "connected"`.

Without Redis, dev falls back to `.data/reports/` on disk (does not work on Vercel production).

### Production deploy (Vercel + GitHub)

1. Push this project to [RMLP-app](https://github.com/Martimic10/RMLP-app) (repo must not be empty)
2. [vercel.com/new](https://vercel.com/new) → Import **Martimic10/RMLP-app**
3. Connect **Upstash Redis** (Storage tab) and add env vars from `.env.example`
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel domain (then your custom domain)
5. Add production **Stripe webhook** → `https://YOUR-DOMAIN.com/api/webhook/stripe`
6. Deploy → run one $4 test on the live URL

## Economics (approx.)

| Item | Cost |
|------|------|
| Sale | $4.00 |
| Stripe (~2.9% + $0.30) | ~$0.42 |
| Firecrawl + Claude + Resend | ~$0.04 |
| **Margin** | **~$3.54** |

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
