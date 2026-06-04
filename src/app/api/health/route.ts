import { NextResponse } from "next/server";
import { getRedis, isRedisConfigured } from "@/lib/redis";
import { getStorageMode } from "@/lib/store";

export async function GET() {
  const mode = getStorageMode();

  if (!isRedisConfigured()) {
    return NextResponse.json({
      ok: true,
      storage: mode,
      message: "Using local .data/ files — add Upstash env vars for production",
    });
  }

  try {
    const redis = getRedis();
    const pong = await redis.ping();
    return NextResponse.json({
      ok: true,
      storage: mode,
      redis: pong === "PONG" ? "connected" : pong,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Redis ping failed";
    return NextResponse.json({ ok: false, storage: mode, error: message }, { status: 500 });
  }
}
