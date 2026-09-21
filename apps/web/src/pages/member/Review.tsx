import { useState } from "react";
import { createReview } from "../../services/member/review.service";

export default function Review() {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [image1, setImage1] = useState<File | undefined>();
  const [image2, setImage2] = useState<File | undefined>();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!review.trim()) {
      setMessage("Please write your review.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await createReview(
        review,
        rating,
        image1,
        image2,
      );

      setReview("");
      setRating(5);
      setImage1(undefined);
      setImage2(undefined);

      setMessage("Review submitted successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <p className="mb-3 font-serif text-sm text-primary">
        YOUR EXPERIENCE
      </p>

      <h1 className="font-serif text-4xl text-white">
        Give Your Review
      </h1>

      <p className="mt-3 text-gray-400">
        Tell us about your experience at Vyayamshala.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-8"
      >
        {/* Rating */}
        <div>
          <label className="mb-3 block text-sm text-gray-400">
            Rating
          </label>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition ${
                  star <= rating
                    ? "text-primary"
                    : "text-gray-700"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Review */}
        <div>
          <label className="mb-3 block text-sm text-gray-400">
            Your Review
          </label>

          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={6}
            placeholder="Write about your experience..."
            className="w-full rounded-xl border border-gray-800 bg-gray-950 p-4 text-white outline-none transition focus:border-primary"
          />
        </div>

        {/* Images */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-3 block text-sm text-gray-400">
              Image 1
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage1(e.target.files?.[0])
              }
              className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-sm text-gray-400"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm text-gray-400">
              Image 2
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage2(e.target.files?.[0])
              }
              className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-sm text-gray-400"
            />
          </div>
        </div>

        {message && (
          <p className="text-sm text-primary">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-primary px-8 py-3 font-serif text-sm text-black transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}