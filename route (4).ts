import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { registerSchema } from "@/lib/validators";
import { hashPassword, signToken, AUTH_COOKIE_NAME, authCookieOptions } from "@/lib/auth";
import { allowRequest } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  if (!(await allowRequest(req, "auth"))) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { name, email, password } = parsed.data;

  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email: email.toLowerCase(), passwordHash });

  const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role });

  const res = NextResponse.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
  res.cookies.set(AUTH_COOKIE_NAME, token, authCookieOptions);
  return res;
}
