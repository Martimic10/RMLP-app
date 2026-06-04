import { promises as fs } from "fs";
import path from "path";
import { getRedis, isRedisConfigured } from "./redis";
import type { RoastReport } from "./types";

/** Reports expire after 90 days (keeps storage lean) */
const REPORT_TTL_SECONDS = 60 * 60 * 24 * 90;

const DATA_DIR = path.join(process.cwd(), ".data", "reports");

function reportKey(id: string) {
  return `report:${id}`;
}

async function saveToFile(report: RoastReport): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, `${report.id}.json`),
    JSON.stringify(report, null, 2),
    "utf-8"
  );
}

async function loadFromFile(id: string): Promise<RoastReport | null> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, `${id}.json`), "utf-8");
    return JSON.parse(raw) as RoastReport;
  } catch {
    return null;
  }
}

export function getStorageMode(): "redis" | "file" {
  return isRedisConfigured() ? "redis" : "file";
}

export async function saveReport(report: RoastReport): Promise<void> {
  if (isRedisConfigured()) {
    const redis = getRedis();
    await redis.set(reportKey(report.id), report, {
      ex: REPORT_TTL_SECONDS,
    });
    return;
  }
  await saveToFile(report);
}

export async function getReport(id: string): Promise<RoastReport | null> {
  if (isRedisConfigured()) {
    const redis = getRedis();
    const data = await redis.get<RoastReport>(reportKey(id));
    return data ?? null;
  }
  return loadFromFile(id);
}

export async function updateReport(
  id: string,
  patch: Partial<RoastReport>
): Promise<RoastReport | null> {
  const existing = await getReport(id);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  await saveReport(updated);
  return updated;
}
