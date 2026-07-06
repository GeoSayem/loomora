import { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, verifyToken, JwtPayload } from "./auth";

/**
 * Reads and verifies the JWT stored in the httpOnly cookie.
 * Returns null if there's no valid session — callers decide whether that's
 * acceptable (guest checkout) or should be rejected (401).
 */
export function getSessionUser(req: NextRequest): JwtPayload | null {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function requireAdmin(req: NextRequest): JwtPayload | null {
  const user = getSessionUser(req);
  if (!user || user.role !== "admin") return null;
  return user;
}
