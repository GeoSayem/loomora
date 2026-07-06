import { RateLimiterMemory } from "rate-limiter-flexible";
import { NextRequest } from "next/server";

// NOTE: RateLimiterMemory keeps state per server instance. On a
// multi-instance deployment (e.g. Vercel serverless, multiple containers),
// swap this for RateLimiterRedis pointed at a shared Redis instance so
// limits are enforced consistently across instances.
const limiters: Record<string, RateLimiterMemory> = {
  auth: new RateLimiterMemory({ points: 10, duration: 60 }), // 10 req/min
  checkout: new RateLimiterMemory({ points: 15, duration: 60 }),
  contact: new RateLimiterMemory({ points: 5, duration: 60 }),
  default: new RateLimiterMemory({ points: 60, duration: 60 }),
};

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Returns true if the request should be allowed, false if it's been
 * rate-limited. Usage:
 *   if (!(await allowRequest(req, "auth"))) return 429 response
 */
export async function allowRequest(
  req: NextRequest,
  bucket: keyof typeof limiters = "default"
): Promise<boolean> {
  const limiter = limiters[bucket] ?? limiters.default;
  const key = `${bucket}:${getClientIp(req)}`;
  try {
    await limiter.consume(key);
    return true;
  } catch {
    return false;
  }
}
