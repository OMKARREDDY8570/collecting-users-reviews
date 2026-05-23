import { supabaseAdmin } from "@/lib/supabase";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  // Fetch projects and reviews server-side
  const [projectsResult, reviewsResult] = await Promise.all([
    supabaseAdmin.from("projects").select("*").order("created_at", { ascending: false }),
    supabaseAdmin
      .from("reviews")
      .select("*, projects(name)")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const projects = projectsResult.data || [];
  const reviews = reviewsResult.data || [];

  return <AdminDashboard initialProjects={projects} initialReviews={reviews} />;
}
