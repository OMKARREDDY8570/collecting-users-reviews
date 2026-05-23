"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProjectManagement from "./ProjectManagement";
import ReviewFeed from "./ReviewFeed";

interface Project {
  id: string;
  slug: string;
  name: string;
  created_at: string;
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

interface AdminDashboardProps {
  initialProjects: Project[];
  initialReviews: Review[];
}

export default function AdminDashboard({
  initialProjects,
  initialReviews,
}: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"projects" | "reviews">("projects");
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const handleProjectsUpdate = useCallback((updatedProjects: Project[]) => {
    setProjects(updatedProjects);
  }, []);

  const handleReviewsUpdate = useCallback((updatedReviews: Review[]) => {
    setReviews(updatedReviews);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Manage projects and reviews</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab("projects")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "projects"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "reviews"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Reviews
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "projects" && (
          <ProjectManagement
            projects={projects}
            onUpdate={handleProjectsUpdate}
          />
        )}
        {activeTab === "reviews" && (
          <ReviewFeed
            reviews={reviews}
            projects={projects}
            onUpdate={handleReviewsUpdate}
          />
        )}
      </div>
    </div>
  );
}
