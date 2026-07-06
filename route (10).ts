import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CustomOrder from "@/models/CustomOrder";
import { customOrderSchema } from "@/lib/validators";
import { estimateCustomRugPrice } from "@/lib/pricing";
import { allowRequest } from "@/lib/rateLimit";

// POST /api/custom-order — submits a custom rug quote request with an
// instant estimate. Design/reference images are uploaded client-side to
// Cloudinary first; this route just stores the resulting URL.
export async function POST(req: NextRequest) {
  if (!(await allowRequest(req))) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = customOrderSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const estimatedPrice = estimateCustomRugPrice(
    parsed.data.widthFt,
    parsed.data.heightFt,
    parsed.data.material
  );

  await connectDB();
  const request = await CustomOrder.create({ ...parsed.data, estimatedPrice });

  return NextResponse.json({ request, estimatedPrice }, { status: 201 });
}

// GET — admin: list custom order requests
export async function GET(req: NextRequest) {
  await connectDB();
  const requests = await CustomOrder.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ requests });
}
