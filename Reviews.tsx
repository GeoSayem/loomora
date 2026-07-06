"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Review } from "@/types";
import { useAuth } from "@/context/AuthContext";

export function Reviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const { user } = useAuth();

  async function loadReviews() {
    setLoading(true);
    const res = await fetch(`/api/reviews?productId=${productId}`);
    const data = await res.json();
    setReviews(data.reviews ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, title, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not submit review.");
      setComment("");
      setTitle("");
      setRating(5);
      setStatus("idle");
      loadReviews();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section className="mt-20 border-t border-line pt-12">
      <h2 className="font-display text-2xl mb-8">Customer Reviews</h2>

      {loading ? (
        <p className="text-sm text-espresso">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-espresso mb-10">Be the first to review this piece.</p>
      ) : (
        <div className="space-y-6 mb-12">
          {reviews.map((r) => (
            <div key={r._id} className="border-b border-line pb-6">
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-gold text-gold" : "text-line"}`} />
                ))}
                {r.verifiedPurchase && (
                  <span className="text-[10px] uppercase tracking-wide text-gold-dark">Verified Purchase</span>
                )}
              </div>
              {r.title && <h4 className="font-medium mt-2">{r.title}</h4>}
              <p className="text-sm text-espresso mt-1">{r.comment}</p>
              <p className="text-xs text-espresso/60 mt-2">{r.userName}</p>
            </div>
          ))}
        </div>
      )}

      {user ? (
        <form onSubmit={submitReview} className="max-w-lg">
          <h3 className="text-sm uppercase tracking-wide mb-3">Write a review</h3>
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} type="button" onClick={() => setRating(i + 1)}>
                <Star className={`h-6 w-6 ${i < rating ? "fill-gold text-gold" : "text-line"}`} />
              </button>
            ))}
          </div>
          <input
            placeholder="Review title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-line px-3 py-2 text-sm mb-3 bg-transparent"
          />
          <textarea
            placeholder="Share your experience with this piece…"
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full border border-line px-3 py-2 text-sm mb-3 bg-transparent"
          />
          {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
          <button type="submit" disabled={status === "loading"} className="btn-primary">
            {status === "loading" ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-espresso">
          Please log in to leave a review.
        </p>
      )}
    </section>
  );
}
