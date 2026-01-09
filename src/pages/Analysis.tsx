import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import SkillGapCard from "@/components/SkillGapCard";
import CourseCard from "@/components/CourseCard";
import InternshipCard from "@/components/InternshipCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowRight,
  Download,
  Share2,
  AlertTriangle,
  TrendingUp,
  FileText,
  Sparkles,
  FileJson,
  FileType,
  Copy,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SkillGap {
  skill: string;
  importance: "critical" | "important" | "nice-to-have";
  description: string;
}

interface RecommendedCourse {
  title: string;
  platform: string;
  skill: string;
  estimatedDuration: string;
  priority: "high" | "medium" | "low";
}

interface RecommendedInternship {
  title: string;
  company: string;
  location: string;
  duration: string;
  stipend: string;
  type: "Remote" | "Hybrid" | "On-site";
  applyUrl?: string;
}

interface AnalysisResult {
  summary: string;
  matchScore: number;
  skillGaps: SkillGap[];
  existingStrengths: Array<{ skill: string; relevance: string }>;
  recommendedCourses: RecommendedCourse[];
  recommendedInternships?: RecommendedInternship[];
  actionPlan: Array<{ step: number; action: string; timeframe: string }>;
}

// Default fallback data - matching SkillGap interface
const defaultSkillGaps: SkillGap[] = [
  { skill: "React.js", importance: "critical", description: "Modern frontend framework" },
  { skill: "TypeScript", importance: "critical", description: "Type-safe JavaScript" },
  { skill: "Node.js", importance: "important", description: "Backend JavaScript runtime" },
  { skill: "System Design", importance: "important", description: "Architecture patterns" },
  { skill: "Git/GitHub", importance: "nice-to-have", description: "Version control" },
  { skill: "CSS/Tailwind", importance: "nice-to-have", description: "Styling frameworks" },
];

// Helper to generate platform search URLs
const getPlatformSearchUrl = (platform: string, query: string): string => {
  const encodedQuery = encodeURIComponent(query);
  const platformUrls: Record<string, string> = {
    "Udemy": `https://www.udemy.com/courses/search/?q=${encodedQuery}`,
    "Coursera": `https://www.coursera.org/search?query=${encodedQuery}`,
    "LinkedIn Learning": `https://www.linkedin.com/learning/search?keywords=${encodedQuery}`,
    "edX": `https://www.edx.org/search?q=${encodedQuery}`,
    "Pluralsight": `https://www.pluralsight.com/search?q=${encodedQuery}`,
    "Skillshare": `https://www.skillshare.com/en/search?query=${encodedQuery}`,
    "Udacity": `https://www.udacity.com/courses/all?search=${encodedQuery}`,
  };
  return platformUrls[platform] || `https://www.google.com/search?q=${encodedQuery}+online+course`;
};

const defaultCourses = [
  {
    title: "React - The Complete Guide 2026",
    provider: "Udemy",
    rating: 4.8,
    duration: "40 hours",
    students: "500K+",
    image: "",
    url: "https://www.udemy.com/courses/search/?q=react+complete+guide",
    skill: "React.js",
  },
  {
    title: "TypeScript for Professionals",
    provider: "Coursera",
    rating: 4.7,
    duration: "25 hours",
    students: "200K+",
    image: "",
    url: "https://www.coursera.org/search?query=typescript",
    skill: "TypeScript",
  },
  {
    title: "Node.js Complete Bootcamp",
    provider: "Udemy",
    rating: 4.9,
    duration: "35 hours",
    students: "300K+",
    image: "",
    url: "https://www.udemy.com/courses/search/?q=nodejs+bootcamp",
    skill: "Node.js",
  },
  {
    title: "System Design Fundamentals",
    provider: "LinkedIn Learning",
    rating: 4.6,
    duration: "15 hours",
    students: "150K+",
    image: "",
    url: "https://www.linkedin.com/learning/search?keywords=system+design",
    skill: "System Design",
  },
];

// Default internships for fallback - will be replaced by AI-generated ones
const getDefaultInternships = (role: string) => [
  {
    id: "1",
    title: `${role} Intern`,
    company: "TCS",
    location: "Mumbai",
    duration: "6 months",
    stipend: "₹25,000/mo",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
    type: "Hybrid" as const,
  },
  {
    id: "2",
    title: `${role} Trainee`,
    company: "Infosys",
    location: "Bangalore",
    duration: "4 months",
    stipend: "₹20,000/mo",
    logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop",
    type: "On-site" as const,
  },
];

const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"skills" | "courses" | "internships">("skills");
  const [loading, setLoading] = useState(false);
  const [fetchedAnalysis, setFetchedAnalysis] = useState<AnalysisResult | null>(null);
  const [fetchedRole, setFetchedRole] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const analysisId = searchParams.get("id");

  // Generate analysis report content
  const generateReportContent = () => {
    const lines: string[] = [];
    lines.push("=" .repeat(60));
    lines.push("SKILLGAP RESUME ANALYSIS REPORT");
    lines.push("=" .repeat(60));
    lines.push("");
    lines.push(`Target Role: ${targetRole}`);
    lines.push(`Profile Match Score: ${overallScore}%`);
    lines.push(`Analysis Date: ${new Date().toLocaleDateString()}`);
    lines.push("");
    
    if (analysisData?.summary) {
      lines.push("-".repeat(40));
      lines.push("SUMMARY");
      lines.push("-".repeat(40));
      lines.push(analysisData.summary);
      lines.push("");
    }

    lines.push("-".repeat(40));
    lines.push("SKILL GAPS IDENTIFIED");
    lines.push("-".repeat(40));
    skillGaps.forEach((gap, idx) => {
      const priorityLabel = gap.priority === "high" ? "🔴 HIGH" : gap.priority === "medium" ? "🟡 MEDIUM" : "🟢 LOW";
      lines.push(`${idx + 1}. ${gap.skill} - Priority: ${priorityLabel}`);
      lines.push(`   Current Level: ${gap.currentLevel}/5 | Required: ${gap.requiredLevel}/5`);
    });
    lines.push("");

    if (analysisData?.existingStrengths && analysisData.existingStrengths.length > 0) {
      lines.push("-".repeat(40));
      lines.push("YOUR STRENGTHS");
      lines.push("-".repeat(40));
      analysisData.existingStrengths.forEach((s, idx) => {
        lines.push(`${idx + 1}. ${s.skill}`);
      });
      lines.push("");
    }

    lines.push("-".repeat(40));
    lines.push("RECOMMENDED COURSES");
    lines.push("-".repeat(40));
    recommendedCourses.forEach((course, idx) => {
      lines.push(`${idx + 1}. ${course.title}`);
      lines.push(`   Platform: ${course.provider} | Duration: ${course.duration}`);
      lines.push(`   URL: ${course.url}`);
    });
    lines.push("");

    if (analysisData?.actionPlan && analysisData.actionPlan.length > 0) {
      lines.push("-".repeat(40));
      lines.push("ACTION PLAN");
      lines.push("-".repeat(40));
      analysisData.actionPlan.forEach((item) => {
        lines.push(`Step ${item.step}: ${item.action}`);
        lines.push(`   Timeframe: ${item.timeframe}`);
      });
    }

    lines.push("");
    lines.push("=" .repeat(60));
    lines.push("Generated by SkillGAP - Your Career Development Partner");
    lines.push("=" .repeat(60));

    return lines.join("\n");
  };

  // Export as text file
  const handleExportText = () => {
    const content = generateReportContent();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skillgap-analysis-${targetRole.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Report exported as text file!");
  };

  // Export as JSON
  const handleExportJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      targetRole,
      matchScore: overallScore,
      summary: analysisData?.summary || null,
      skillGaps: skillGaps.map((g) => ({
        skill: g.skill,
        currentLevel: g.currentLevel,
        requiredLevel: g.requiredLevel,
        priority: g.priority,
      })),
      existingStrengths: analysisData?.existingStrengths || [],
      recommendedCourses: recommendedCourses.map((c) => ({
        title: c.title,
        provider: c.provider,
        duration: c.duration,
        url: c.url,
      })),
      actionPlan: analysisData?.actionPlan || [],
    };
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skillgap-analysis-${targetRole.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Report exported as JSON file!");
  };

  // Share functionality - platform specific
  const getShareText = () => {
    return `Check out my SkillGAP resume analysis for ${targetRole} role. Profile Match Score: ${overallScore}%`;
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`${getShareText()}\n\n${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
    toast.success("Opening WhatsApp...");
  };

  const handleShareGmail = () => {
    const subject = encodeURIComponent(`SkillGAP Analysis - ${targetRole}`);
    const body = encodeURIComponent(`${getShareText()}\n\nView my analysis here: ${window.location.href}`);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, "_blank");
    toast.success("Opening Gmail...");
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
    toast.success("Opening LinkedIn...");
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    toast.success("Opening Twitter/X...");
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(window.location.href);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
    toast.success("Opening Telegram...");
  };

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  // Fetch analysis from database if ID is provided
  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!analysisId) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from("resume_analyses")
        .select("*")
        .eq("id", analysisId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching analysis:", error);
      } else if (data) {
        setFetchedRole(data.role);
        
        // Transform stored data to AnalysisResult format
        const skillGaps = Array.isArray(data.skill_gaps) 
          ? (data.skill_gaps as Array<{ skill: string; importance: string; description?: string }>).map(sg => ({
              skill: sg.skill || String(sg),
              importance: (sg.importance as "critical" | "important" | "nice-to-have") || "important",
              description: sg.description || "",
            }))
          : [];
        
        const recommendedCourses = Array.isArray(data.recommended_courses)
          ? (data.recommended_courses as Array<{ title: string; platform?: string; provider?: string; skill?: string; estimatedDuration?: string; priority?: string }>).map(rc => ({
              title: rc.title,
              platform: rc.platform || rc.provider || "Online",
              skill: rc.skill || "",
              estimatedDuration: rc.estimatedDuration || "Self-paced",
              priority: (rc.priority as "high" | "medium" | "low") || "medium",
            }))
          : [];

        const recommendedInternships = Array.isArray(data.recommended_internships)
          ? (data.recommended_internships as Array<{ title: string; company: string; location: string; duration: string; stipend: string; type: string; applyUrl?: string }>).map(ri => ({
              title: ri.title,
              company: ri.company,
              location: ri.location,
              duration: ri.duration,
              stipend: ri.stipend,
              type: ri.type as "Remote" | "Hybrid" | "On-site",
              applyUrl: ri.applyUrl,
            }))
          : [];

        setFetchedAnalysis({
          summary: `Analysis for ${data.role} role`,
          matchScore: 70,
          skillGaps,
          existingStrengths: [],
          recommendedCourses,
          recommendedInternships,
          actionPlan: [],
        });
      }
      setLoading(false);
    };

    fetchAnalysis();
  }, [analysisId]);

  // Get analysis data from navigation state or fetched data
  const analysisData = fetchedAnalysis || (location.state?.analysis as AnalysisResult | undefined);
  const targetRole = fetchedRole || location.state?.role || "Frontend Developer";
  const fileName = location.state?.fileName;

  // Transform AI analysis data to component format (SkillGapCard format)
  const transformSkillGap = (gap: SkillGap) => ({
    skill: gap.skill,
    currentLevel: gap.importance === "critical" ? 1 : gap.importance === "important" ? 2 : 3,
    requiredLevel: 4,
    priority: gap.importance === "critical" ? "high" as const : gap.importance === "important" ? "medium" as const : "low" as const,
  });
  
  const skillGaps = (analysisData?.skillGaps || defaultSkillGaps).map(transformSkillGap);

  const recommendedCourses = analysisData?.recommendedCourses?.map((course) => ({
    title: course.title,
    provider: course.platform,
    rating: 4.5 + Math.random() * 0.4,
    duration: course.estimatedDuration,
    students: "100K+",
    image: "",
    url: getPlatformSearchUrl(course.platform, course.title),
    skill: course.skill,
  })) || defaultCourses;

  // Transform AI-generated internships or use defaults
  const matchingInternships = analysisData?.recommendedInternships?.map((internship, index) => ({
    id: String(index + 1),
    title: internship.title,
    company: internship.company,
    location: internship.location,
    duration: internship.duration,
    stipend: internship.stipend,
    logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(internship.company)}&background=random&size=100`,
    type: internship.type,
    applyUrl: internship.applyUrl,
  })) || getDefaultInternships(targetRole);

  const overallScore = analysisData?.matchScore || 65;
  const highPriorityCount = skillGaps.filter((s) => s.priority === "high").length;
  const mediumPriorityCount = skillGaps.filter((s) => s.priority === "medium").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 pb-16 px-4 max-w-6xl mx-auto">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-48 mb-8" />
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Skeleton className="h-32 md:col-span-2" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-sm text-primary font-medium">AI Analysis Complete</span>
                </div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                  Your Analysis Results
                </h1>
                <p className="text-muted-foreground">
                  Based on your resume for{" "}
                  <span className="text-primary font-medium">
                    {targetRole}
                  </span>{" "}
                  role
                  {fileName && (
                    <span className="flex items-center gap-1 mt-1 text-sm">
                      <FileText className="w-4 h-4" />
                      {fileName}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportText} className="gap-2 cursor-pointer">
                      <FileType className="w-4 h-4" />
                      Export as Text (.txt)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportJSON} className="gap-2 cursor-pointer">
                      <FileJson className="w-4 h-4" />
                      Export as JSON (.json)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[180px]">
                    <DropdownMenuItem onClick={handleShareWhatsApp} className="gap-2 cursor-pointer">
                      <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShareGmail} className="gap-2 cursor-pointer">
                      <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                      </svg>
                      Gmail
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShareLinkedIn} className="gap-2 cursor-pointer">
                      <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShareTwitter} className="gap-2 cursor-pointer">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Twitter/X
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShareTelegram} className="gap-2 cursor-pointer">
                      <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      Telegram
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopyLink} className="gap-2 cursor-pointer">
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy Link"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.div>

          {/* Summary Card */}
          {analysisData?.summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="glass-card p-6 mb-6"
            >
              <h3 className="font-semibold text-foreground mb-2">Summary</h3>
              <p className="text-muted-foreground">{analysisData.summary}</p>
            </motion.div>
          )}

          {/* Score Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-4 gap-4 mb-8"
          >
            <div className="glass-card p-6 md:col-span-2">
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28">
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-secondary"
                    />
                    <motion.circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${overallScore * 3.02} 302`}
                      className="text-primary"
                      initial={{ strokeDasharray: "0 302" }}
                      animate={{ strokeDasharray: `${overallScore * 3.02} 302` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-display font-bold text-foreground">
                      {overallScore}%
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Profile Match Score
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your skills match {overallScore}% of the requirements for {targetRole}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <span className="text-2xl font-display font-bold text-foreground">
                  {highPriorityCount}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                High priority skills to develop
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
                <span className="text-2xl font-display font-bold text-foreground">
                  {mediumPriorityCount}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Medium priority improvements
              </p>
            </div>
          </motion.div>

          {/* Existing Strengths */}
          {analysisData?.existingStrengths && analysisData.existingStrengths.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card p-6 mb-8"
            >
              <h3 className="font-semibold text-foreground mb-4">Your Strengths</h3>
              <div className="flex flex-wrap gap-3">
                {analysisData.existingStrengths.map((strength, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
                  >
                    <span className="text-sm font-medium text-primary">{strength.skill}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 mb-6 p-1 bg-secondary/50 rounded-xl w-fit"
          >
            {[
              { id: "skills", label: "Skill Gaps" },
              { id: "courses", label: "Recommended Courses" },
              { id: "internships", label: "Matching Internships" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "skills" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skillGaps.map((gap, index) => (
                  <SkillGapCard key={gap.skill} {...gap} index={index} />
                ))}
              </div>
            )}

            {activeTab === "courses" && (
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Curated courses from top platforms to help you bridge your
                  skill gaps
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommendedCourses.map((course, index) => (
                    <CourseCard key={course.title + index} {...course} index={index} />
                  ))}
                </div>
                <div className="text-center">
                  <Button
                    variant="soft"
                    onClick={() => navigate("/courses")}
                    className="gap-2"
                  >
                    View All Courses
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "internships" && (
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Internships matching your current skill level and interests
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {matchingInternships.map((internship, index) => (
                    <InternshipCard key={internship.id} {...internship} index={index} />
                  ))}
                </div>
                <div className="text-center">
                  <Button
                    variant="soft"
                    onClick={() => navigate("/internships")}
                    className="gap-2"
                  >
                    View All Internships
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Action Plan */}
          {analysisData?.actionPlan && analysisData.actionPlan.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 glass-card p-6"
            >
              <h3 className="font-semibold text-foreground mb-4">Your Action Plan</h3>
              <div className="space-y-4">
                {analysisData.actionPlan.map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">{item.step}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.action}</p>
                      <p className="text-sm text-muted-foreground">{item.timeframe}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analysis;
