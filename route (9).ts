import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/getSessionUser";
import { slugify } from "@/lib/utils";

export async function GET() {
  await connectDB();
  const categories = await Category.find().lean();
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  await connectDB();
  const category = await Category.create({
    name: body.name,
    slug: slugify(body.name),
    description: body.description,
    image: body.image,
  });
  return NextResponse.json({ category }, { status: 201 });
}
