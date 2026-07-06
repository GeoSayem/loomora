"use client";

import { useState, FormEvent } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus("done");
      setMessage(data.message ?? "You're on the list. Welcome to Loomora & Co.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section className="bg-ink text-cream py-20">
      <div className="container-luxe text-center max-w-xl mx-auto">
        <p className="eyebrow text-gold-light">Stay in the loom</p>
        <h2 className="text-3xl md:text-4xl mt-3">Join our list for new collections &amp; private offers</h2>
        <p className="mt-4 text-cream/70 text-sm">
          One considered email a month. No noise — just new weaves, restocks, and studio notes.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="email"
            required
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 sm:w-80 bg-transparent border border-cream/30 px-4 py-3 text-sm placeholder:text-cream/40 focus:border-gold outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-gold disabled:opacity-60"
          >
            {status === "loading" ? "Joining…" : "Subscribe"}
          </button>
        </form>
        {message && (
          <p className={`mt-3 text-xs ${status === "error" ? "text-red-400" : "text-gold-light"}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
