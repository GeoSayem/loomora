"use client";

import { useMemo, useState, FormEvent } from "react";
import { UploadCloud } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { formatPrice } from "@/lib/utils";

const MATERIALS = ["Wool", "Silk", "Wool & Silk Blend", "Bamboo Silk", "Cotton", "Jute"];

// Mirrors src/lib/pricing.ts so the estimate updates instantly client-side;
// the server recalculates the same way when the request is submitted.
const RATES: Record<string, number> = {
  Wool: 1800,
  Silk: 4200,
  "Wool & Silk Blend": 2800,
  "Bamboo Silk": 2400,
  Cotton: 1200,
  Jute: 900,
};

function estimate(widthFt: number, heightFt: number, material: string) {
  const rate = RATES[material] ?? RATES.Wool;
  const area = widthFt * heightFt;
  const surcharge = area < 15 ? 4000 : 0;
  const discount = area > 100 ? 0.9 : 1;
  return Math.round(area * rate * discount + surcharge);
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function CustomOrderPage() {
  const { currency } = useCurrency();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    widthFt: 6,
    heightFt: 9,
    material: "Wool",
    notes: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [confirmedEstimate, setConfirmedEstimate] = useState<number | null>(null);

  const liveEstimate = useMemo(
    () => estimate(form.widthFt, form.heightFt, form.material),
    [form.widthFt, form.heightFt, form.material]
  );

  async function uploadReferenceImage(): Promise<string | undefined> {
    if (!imageFile || !CLOUD_NAME || !UPLOAD_PRESET) return undefined;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", imageFile);
      data.append("upload_preset", UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      return json.secure_url as string;
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const referenceImage = await uploadReferenceImage();
      const res = await fetch("/api/custom-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, referenceImage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setConfirmedEstimate(data.estimatedPrice);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className="container-luxe py-24 text-center max-w-lg mx-auto">
        <h1 className="font-display text-3xl mb-4">Request received</h1>
        <p className="text-espresso mb-2">
          Estimated price: <span className="text-ink font-medium">{formatPrice(confirmedEstimate ?? 0, currency)}</span>
        </p>
        <p className="text-sm text-espresso">
          Our studio will confirm final pricing and lead time by email within 1–2 business days.
        </p>
      </div>
    );
  }

  return (
    <div className="container-luxe py-16">
      <div className="text-center max-w-xl mx-auto mb-14">
        <p className="eyebrow">Made to your room</p>
        <h1 className="font-display text-4xl mt-3">Design a Custom Rug</h1>
        <p className="text-espresso mt-4 text-sm">
          Enter your dimensions and material, upload a reference if you have one, and get an
          instant estimate. Our studio confirms final pricing before production begins.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-12 max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              required
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-line bg-transparent px-4 py-3 text-sm focus:border-gold outline-none"
            />
            <input
              required
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-line bg-transparent px-4 py-3 text-sm focus:border-gold outline-none"
            />
          </div>
          <input
            required
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-line bg-transparent px-4 py-3 text-sm focus:border-gold outline-none"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="text-sm">
              Width (ft)
              <input
                type="number"
                min={1}
                max={50}
                step={0.5}
                required
                value={form.widthFt}
                onChange={(e) => setForm({ ...form, widthFt: Number(e.target.value) })}
                className="mt-1 w-full border border-line bg-transparent px-4 py-3 text-sm focus:border-gold outline-none"
              />
            </label>
            <label className="text-sm">
              Length (ft)
              <input
                type="number"
                min={1}
                max={50}
                step={0.5}
                required
                value={form.heightFt}
                onChange={(e) => setForm({ ...form, heightFt: Number(e.target.value) })}
                className="mt-1 w-full border border-line bg-transparent px-4 py-3 text-sm focus:border-gold outline-none"
              />
            </label>
          </div>

          <label className="text-sm block">
            Material
            <select
              value={form.material}
              onChange={(e) => setForm({ ...form, material: e.target.value })}
              className="mt-1 w-full border border-line bg-cream px-4 py-3 text-sm focus:border-gold outline-none"
            >
              {MATERIALS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>

          <label className="border border-dashed border-line flex items-center gap-3 px-4 py-4 text-sm cursor-pointer hover:border-gold transition-colors">
            <UploadCloud className="h-5 w-5 text-gold" />
            {imageFile ? imageFile.name : "Upload a reference design or photo (optional)"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </label>

          <textarea
            rows={4}
            placeholder="Notes — colors, pattern inspiration, room, deadline…"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full border border-line bg-transparent px-4 py-3 text-sm focus:border-gold outline-none"
          />

          <button
            type="submit"
            disabled={status === "loading" || uploading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {status === "loading" || uploading ? "Submitting…" : "Request Quote"}
          </button>
          {status === "error" && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <div className="md:col-span-2">
          <div className="card-surface p-6 sticky top-24">
            <p className="eyebrow">Instant Estimate</p>
            <p className="font-display text-4xl mt-3">{formatPrice(liveEstimate, currency)}</p>
            <p className="text-xs text-espresso mt-2">
              For a {form.widthFt}×{form.heightFt} ft rug in {form.material.toLowerCase()}. Final
              quote may vary slightly based on pattern complexity.
            </p>
            <ul className="text-xs text-espresso mt-6 space-y-2 list-disc list-inside">
              <li>4–6 week production time for custom pieces</li>
              <li>Free swatch samples available on request</li>
              <li>Worldwide shipping, duties calculated at checkout</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
