import Link from "next/link";

export default function NotFound() {
  return (
    <main className="safe-px flex min-h-screen flex-col items-center justify-center gap-4 px-4 py-12 text-center">
      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
        Roast not found
      </h1>
      <p className="max-w-sm text-sm leading-relaxed text-white/50 sm:text-base">
        This link may have expired or never existed.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex min-h-[3rem] items-center justify-center rounded-full bg-flame px-6 py-3 text-sm font-semibold text-black active:scale-[0.98]"
      >
        Roast your page
      </Link>
    </main>
  );
}
