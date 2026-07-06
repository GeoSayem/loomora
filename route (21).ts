import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Newsletter from "@/models/Newsletter";
import { z } from "zod";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });

  await connectDB();
  try {
    await Newsletter.create({ email: parsed.data.email.toLowerCase() });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ success: true, message: "You're already subscribed." });
    }
    throw err;
  }

  return NextResponse.json({ success: true });
}
