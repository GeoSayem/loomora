import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getSessionUser } from "@/lib/getSessionUser";

export async function GET(req: NextRequest) {
  const session = getSessionUser(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findById(session.userId).populate("wishlist").lean();
  return NextResponse.json({ wishlist: user?.wishlist ?? [] });
}

// POST { productId } — toggles a product in the user's wishlist
export async function POST(req: NextRequest) {
  const session = getSessionUser(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: "productId is required" }, { status: 400 });

  await connectDB();
  const user = await User.findById(session.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const exists = user.wishlist.some((id: any) => id.toString() === productId);
  if (exists) {
    user.wishlist = user.wishlist.filter((id: any) => id.toString() !== productId);
  } else {
    user.wishlist.push(productId);
  }
  await user.save();

  return NextResponse.json({ wishlist: user.wishlist, added: !exists });
}
