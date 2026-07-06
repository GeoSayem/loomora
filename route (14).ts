import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { contactSchema } from "@/lib/validators";
import { allowRequest } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  if (!(await allowRequest(req, "contact"))) {
    return NextResponse.json({ error: "Too many messages sent. Please try later." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  await ContactMessage.create(parsed.data);

  // TODO: also send a notification email via lib/mailer.ts (see sendMail helper).
  return NextResponse.json({ success: true });
}
