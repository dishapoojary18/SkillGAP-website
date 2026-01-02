import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Manual authentication check (verify_jwt = false in config)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Missing or invalid Authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized - please log in" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the token using Supabase Auth
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Token validation failed:", authError?.message || "No user returned");
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid or expired session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Authenticated user: ${user.id}`);

    const { resumeText, targetRole } = await req.json();

    if (!resumeText || !targetRole) {
      return new Response(
        JSON.stringify({ error: "Resume text and target role are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an expert career counselor and resume analyst. Analyze resumes to identify skill gaps for specific job roles and provide actionable recommendations.

Your analysis should be thorough, practical, and encouraging. Focus on:
1. Identifying missing skills that are essential for the target role
2. Highlighting skills that need improvement
3. Recommending specific courses or certifications
4. Providing actionable next steps

Always return your response in valid JSON format with the following structure:
{
  "summary": "Brief overview of the candidate's current position relative to the target role",
  "matchScore": 75,
  "skillGaps": [
    {
      "skill": "Skill name",
      "importance": "critical" | "important" | "nice-to-have",
      "description": "Why this skill is needed for the role"
    }
  ],
  "existingStrengths": [
    {
      "skill": "Skill name",
      "relevance": "How this skill applies to the target role"
    }
  ],
  "recommendedCourses": [
    {
      "title": "Course name",
      "platform": "Coursera" | "Udemy" | "LinkedIn Learning" | "edX" | "Other",
      "skill": "Which skill gap this addresses",
      "estimatedDuration": "e.g., 4 weeks",
      "priority": "high" | "medium" | "low"
    }
  ],
  "actionPlan": [
    {
      "step": 1,
      "action": "Specific action to take",
      "timeframe": "e.g., Next 2 weeks"
    }
  ]
}`;

    const userPrompt = `Analyze the following resume for the target role of "${targetRole}":

RESUME:
${resumeText}

Please provide a comprehensive skill gap analysis with specific course recommendations to help this candidate become qualified for the ${targetRole} position. Return your analysis in the specified JSON format.`;

    console.log(`Analyzing resume for role: ${targetRole} (user: ${user.id})`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to analyze resume. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const analysisText = data.choices?.[0]?.message?.content;

    if (!analysisText) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "Failed to get analysis from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON from the response
    let analysis;
    try {
      const jsonMatch = analysisText.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, analysisText];
      const jsonString = jsonMatch[1] || analysisText;
      analysis = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.log("Raw response:", analysisText);

      return new Response(
        JSON.stringify({
          error: "Failed to parse analysis results",
          rawAnalysis: analysisText,
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analysis completed successfully for user:", user.id);

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-resume function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
