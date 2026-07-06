"use client";

import { useState, FormEvent } from "react";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "911234567890";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("done");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="container-luxe py-16">
      <div className="text-center max-w-xl mx-auto mb-14">
        <p className="eyebrow">Get in Touch</p>
        <h1 className="font-display text-4xl mt-3">We'd love to help you find the right rug</h1>
        <p className="text-espresso mt-4 text-sm">
          Questions about sizing, custom orders, or an existing order — reach us any way that suits you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-line bg-transparent px-4 py-3 text-sm focus:border-gold outline-none"
          />
          <textarea
            required
            rows={6}
            placeholder="How can we help?"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border border-line bg-transparent px-4 py-3 text-sm focus:border-gold outline-none"
          />
          <button type="submit" disabled={status === "loading"} className="btn-primary w-full disabled:opacity-60">
            {status === "loading" ? "Sending…" : "Send Message"}
          </button>
          {status === "done" && <p className="text-sm text-green-700">Thank you — we'll reply within one business day.</p>}
          {status === "error" && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <div className="space-y-6">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card-surface flex items-center gap-4 p-5 hover:border-gold transition-colors"
          >
            <MessageCircle className="h-6 w-6 text-[#25D366]" />
            <div>
              <p className="font-medium">Chat on WhatsApp</p>
              <p className="text-xs text-espresso">Fastest way to reach our studio</p>
            </div>
          </a>
          <a href="mailto:hello@loomoraco.com" className="card-surface flex items-center gap-4 p-5 hover:border-gold transition-colors">
            <Mail className="h-6 w-6 text-gold" />
            <div>
              <p className="font-medium">hello@loomoraco.com</p>
              <p className="text-xs text-espresso">For orders, custom quotes and press</p>
            </div>
          </a>
          <div className="card-surface flex items-center gap-4 p-5">
            <Phone className="h-6 w-6 text-gold" />
            <div>
              <p className="font-medium">+91 12345 67890</p>
              <p className="text-xs text-espresso">Mon–Sat, 10am–7pm IST</p>
            </div>
          </div>
          <div className="card-surface p-2">
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-espresso">
              <MapPin className="h-4 w-4" /> Bhadohi, Uttar Pradesh, India
            </div>
            <iframe
              title="Loomora & Co. studio location"
              src="https://www.google.com/maps?q=Bhadohi,Uttar+Pradesh,India&output=embed"
              className="w-full h-64 border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
