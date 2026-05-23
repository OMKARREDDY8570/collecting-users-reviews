import { supabaseAdmin } from "@/lib/supabase";
import FeedbackForm from "./FeedbackForm";
import { notFound } from "next/navigation";

interface FeedbackPageProps {
  searchParams: Promise<{
    project?: string;
  }>;
}

export default async function FeedbackPage({
  searchParams,
}: FeedbackPageProps) {
  const params = await searchParams;
  const projectSlug = params.project;

  if (!projectSlug) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Project Not Found
          </h1>
          <p className="text-gray-600">
            Please provide a valid project parameter in the URL.
          </p>
        </div>
      </div>
    );
  }

  // Verify project exists
  const { data: project } = await supabaseAdmin
    .from("projects")
    .select("id, name, slug")
    .eq("slug", projectSlug)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Share Your Feedback
            </h1>
            <p className="text-gray-600">
              Help us improve <span className="font-semibold">{project.name}</span>
            </p>
          </div>

          <FeedbackForm projectSlug={projectSlug} />
        </div>
      </div>
    </div>
  );
}
