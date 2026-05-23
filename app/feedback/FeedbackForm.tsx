"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import Turnstile from "./Turnstile";

interface FeedbackFormProps {
  projectSlug: string;
}

export default function FeedbackForm({ projectSlug }: FeedbackFormProps) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null
  );
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const formLoadTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Capture the form load time for submission timer protection
    formLoadTimeRef.current = Date.now();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Check form submission time (must be at least 3 seconds)
      const submissionTime = Date.now();
      const timeDiff = submissionTime - formLoadTimeRef.current;

      if (timeDiff < 3000) {
        setMessage({
          type: "error",
          text: "Please take your time to provide feedback.",
        });
        setLoading(false);
        return;
      }

      // Check honeypot field
      const honeypotValue = (
        document.querySelector('input[name="website"]') as HTMLInputElement
      )?.value;
      if (honeypotValue) {
        // Silently reject but don't show error (bot behavior)
        console.log("Honeypot field detected");
        setLoading(false);
        return;
      }

      // Verify Turnstile token
      if (!turnstileToken) {
        setMessage({
          type: "error",
          text: "Please verify you are human.",
        });
        setLoading(false);
        return;
      }

      // Submit feedback to API
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_slug: projectSlug,
          rating,
          comment,
          turnstile_token: turnstileToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          type: "error",
          text: data.error || "Failed to submit feedback. Please try again.",
        });
      } else {
        setMessage({
          type: "success",
          text: "Thank you for your feedback!",
        });
        setRating(5);
        setComment("");
        setTurnstileToken("");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot Field */}
      <input
        type="text"
        name="website"
        className="honeypot"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Rating */}
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl transition-all ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              } hover:scale-110`}
            >
              ★
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {rating} out of 5 stars
        </p>
      </div>

      {/* Comment */}
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Feedback
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          placeholder="Share your thoughts, suggestions, or concerns..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
        />
      </div>

      {/* Turnstile */}
      <Turnstile onToken={setTurnstileToken} />

      {/* Messages */}
      {message && (
        <div
          className={`p-4 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
          loading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
        }`}
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}
