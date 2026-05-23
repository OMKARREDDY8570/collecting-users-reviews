"use client";

import { useState, useMemo } from "react";

interface Project {
  id: string;
  slug: string;
  name: string;
}

interface Review {
  id: string;
  project_slug: string;
  rating: number;
  comment: string;
  created_at: string;
  projects?: {
    name: string;
  };
}

interface ReviewFeedProps {
  reviews: Review[];
  projects: Project[];
  onUpdate: (reviews: Review[]) => void;
}

export default function ReviewFeed({
  reviews,
  projects,
  onUpdate,
}: ReviewFeedProps) {
  const [filterSlug, setFilterSlug] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const filteredReviews = useMemo(() => {
    if (!filterSlug) return reviews;
    return reviews.filter((r) => r.project_slug === filterSlug);
  }, [reviews, filterSlug]);

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to delete review");
      } else {
        const updatedReviews = reviews.filter((r) => r.id !== reviewId);
        onUpdate(updatedReviews);
        setSuccess("Review deleted successfully");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-800";
    if (rating === 3) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getRatingStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="space-y-6">
      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Project
        </label>
        <select
          value={filterSlug}
          onChange={(e) => setFilterSlug(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.slug}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Reviews ({filteredReviews.length})
        </h2>
        {filteredReviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews found.</p>
        ) : (
          <div className="space-y-3">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">
                      {review.projects?.name || review.project_slug}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(review.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    disabled={loading}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      loading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    Delete
                  </button>
                </div>

                {/* Rating */}
                <div className="mb-3">
                  <span
                    className={`inline-block px-2 py-1 rounded text-sm font-semibold ${getRatingColor(
                      review.rating
                    )}`}
                  >
                    {getRatingStars(review.rating)} ({review.rating}/5)
                  </span>
                </div>

                {/* Comment */}
                <p className="text-gray-700 text-sm leading-relaxed break-words">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
            <p className="text-sm text-gray-600">Total Reviews</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {(
                reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
              ).toFixed(1)}
            </p>
            <p className="text-sm text-gray-600">Avg Rating</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <p className="text-2xl font-bold text-green-600">
              {reviews.filter((r) => r.rating >= 4).length}
            </p>
            <p className="text-sm text-gray-600">Positive</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <p className="text-2xl font-bold text-red-600">
              {reviews.filter((r) => r.rating <= 2).length}
            </p>
            <p className="text-sm text-gray-600">Negative</p>
          </div>
        </div>
      )}
    </div>
  );
}
