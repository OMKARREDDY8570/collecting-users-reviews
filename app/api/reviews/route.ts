import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { hashIP, getClientIP, verifyTurnstile } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_slug, rating, comment, turnstile_token } = body;

    // Validate required fields
    if (!project_slug || !rating || !comment || !turnstile_token) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json(
        { error: "Invalid rating" },
        { status: 400 }
      );
    }

    // Validate comment length
    if (comment.trim().length < 5 || comment.trim().length > 1000) {
      return NextResponse.json(
        { error: "Comment must be between 5 and 1000 characters" },
        { status: 400 }
      );
    }

    // Verify Turnstile token
    const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecretKey) {
      console.error("Turnstile secret key not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const isTurnstileValid = await verifyTurnstile(
      turnstile_token,
      turnstileSecretKey
    );
    if (!isTurnstileValid) {
      return NextResponse.json(
        { error: "Failed captcha verification" },
        { status: 400 }
      );
    }

    // Get client IP and hash it
    const clientIP = getClientIP(
      request.headers.get("x-forwarded-for") ||
        request.headers.get("cf-connecting-ip") ||
        "",
      request.ip || ""
    );
    const ipHash = hashIP(clientIP);

    // Check if project exists
    const { data: project, error: projectError } = await supabaseAdmin
      .from("projects")
      .select("id, slug")
      .eq("slug", project_slug)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // IP-based rate limiting: Check if this IP has submitted more than 3 reviews in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentReviews, error: rateCheckError } = await supabaseAdmin
      .from("reviews")
      .select("id")
      .eq("ip_hash", ipHash)
      .gte("created_at", oneHourAgo);

    if (rateCheckError) {
      console.error("Rate limit check error:", rateCheckError);
      return NextResponse.json(
        { error: "Failed to check rate limit" },
        { status: 500 }
      );
    }

    if (recentReviews && recentReviews.length >= 3) {
      return NextResponse.json(
        {
          error:
            "Too many submissions from your IP address. Please try again later.",
        },
        { status: 429 }
      );
    }

    // Insert review
    const { data: review, error: insertError } = await supabaseAdmin
      .from("reviews")
      .insert({
        project_slug,
        rating,
        comment: comment.trim(),
        ip_hash: ipHash,
      })
      .select();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to submit review" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, review: review?.[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Review submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
