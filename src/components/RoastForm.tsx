"use client";

import { useState } from "react";
import { PRICE_DISPLAY } from "@/lib/constants";

export function RoastForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-3 sm:space-y-4">
      <div className="space-y-2">
        <label htmlFor="url" className="sr-only">
          Landing page URL
        </label>
        <input
          id="url"
          type="url"
          required
          inputMode="url"
          autoComplete="url"
          placeholder="https://your-startup.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full min-h-[3rem] rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-base text-white placeholder:text-white/35 outline-none transition focus:border-flame/50 focus:ring-2 focus:ring-flame/30 sm:px-5 sm:py-4 sm:text-lg"
        />
      </div>

      {error && (
        <p className="break-anywhere text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group relative w-full min-h-[3.25rem] overflow-hidden rounded-2xl bg-flame px-6 py-4 text-base font-semibold text-black transition active:scale-[0.98] hover:brightness-110 disabled:opacity-60 sm:text-lg"
      >
        <span className="relative z-10">
          {loading ? "Igniting checkout…" : `Roast it — ${PRICE_DISPLAY}`}
        </span>
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition group-hover:translate-x-full duration-700" />
      </button>

      <p className="px-1 text-center text-xs leading-relaxed text-white/40 sm:text-sm">
        One-time payment · Full report in ~60s · Shareable link
      </p>
    </form>
  );
}
