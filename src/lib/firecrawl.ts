export async function scrapeLandingPage(url: string): Promise<string> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error("FIRECRAWL_API_KEY is not set");
  }

  const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
      onlyMainContent: true,
      waitFor: 2000,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Firecrawl failed (${res.status}): ${err}`);
  }

  const data = (await res.json()) as {
    success?: boolean;
    data?: { markdown?: string };
  };

  const markdown = data.data?.markdown?.trim();
  if (!markdown) {
    throw new Error("Firecrawl returned empty content");
  }

  return markdown.slice(0, 24_000);
}
