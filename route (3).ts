import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getSessionUser } from "@/lib/getSessionUser";

// Returns the currently logged-in user's profile, or null if not authenticated.
export async function GET(req: NextRequest) {
  const session = getSessionUser(req);
  if (!session) return NextResponse.json({ user: null });

  await connectDB();
  const user = await User.findById(session.userId).select("-passwordHash");
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({ user });
}
