"use client";

import { useState } from "react";

interface Project {
  id: string;
  slug: string;
  name: string;
  created_at: string;
}

interface ProjectManagementProps {
  projects: Project[];
  onUpdate: (projects: Project[]) => void;
}

export default function ProjectManagement({
  projects,
  onUpdate,
}: ProjectManagementProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectSlug, setNewProjectSlug] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProjectName,
          slug: newProjectSlug,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to create project");
      } else {
        const data = await response.json();
        onUpdate([data.project, ...projects]);
        setNewProjectName("");
        setNewProjectSlug("");
        setIsCreating(false);
        setSuccess("Project created successfully");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = async (projectId: string) => {
    if (!editingName.trim()) {
      setError("Project name cannot be empty");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to update project");
      } else {
        const updatedProjects = projects.map((p) =>
          p.id === projectId ? { ...p, name: editingName } : p
        );
        onUpdate(updatedProjects);
        setEditingId(null);
        setSuccess("Project updated successfully");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure? This will delete the project and all its reviews.")) {
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to delete project");
      } else {
        const updatedProjects = projects.filter((p) => p.id !== projectId);
        onUpdate(updatedProjects);
        setSuccess("Project deleted successfully");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
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

      {/* Create Project */}
      {!isCreating ? (
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Create New Project
        </button>
      ) : (
        <form onSubmit={handleCreateProject} className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., My App"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Slug (URL-friendly)
            </label>
            <input
              type="text"
              value={newProjectSlug}
              onChange={(e) => setNewProjectSlug(e.target.value.toLowerCase())}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., my-app"
              pattern="[a-z0-9-]+"
              title="Only lowercase letters, numbers, and hyphens allowed"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Projects ({projects.length})</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500 text-sm">No projects yet. Create one to get started.</p>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  {editingId === project.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                  ) : (
                    <div>
                      <h3 className="font-medium text-gray-900">{project.name}</h3>
                      <p className="text-xs text-gray-500">
                        Slug: <code className="bg-gray-100 px-1 py-0.5 rounded">{project.slug}</code>
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingId === project.id ? (
                    <>
                      <button
                        onClick={() => handleEditProject(project.id)}
                        disabled={loading}
                        className={`px-3 py-1 rounded text-sm font-medium text-white transition-colors ${
                          loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(project.id);
                          setEditingName(project.name);
                        }}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback URL */}
      {projects.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Feedback URLs</h3>
          <div className="space-y-2">
            {projects.map((project) => (
              <div key={project.id} className="text-sm">
                <p className="text-blue-700">
                  <code className="bg-white px-2 py-1 rounded border border-blue-300">
                    {process.env.NEXT_PUBLIC_APP_URL}/feedback?project={project.slug}
                  </code>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
