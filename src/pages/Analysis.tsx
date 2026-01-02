import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SkillGapCard from "@/components/SkillGapCard";
import CourseCard from "@/components/CourseCard";
import InternshipCard from "@/components/InternshipCard";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Download,
  Share2,
  AlertTriangle,
  TrendingUp,
  FileText,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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

interface AnalysisResult {
  summary: string;
  matchScore: number;
  skillGaps: SkillGap[];
  existingStrengths: Array<{ skill: string; relevance: string }>;
  recommendedCourses: RecommendedCourse[];
  actionPlan: Array<{ step: number; action: string; timeframe: string }>;
}

// Default fallback data
const defaultSkillGaps = [
  { skill: "React.js", currentLevel: 2, requiredLevel: 4, priority: "high" as const },
  { skill: "TypeScript", currentLevel: 1, requiredLevel: 4, priority: "high" as const },
  { skill: "Node.js", currentLevel: 2, requiredLevel: 3, priority: "medium" as const },
  { skill: "System Design", currentLevel: 1, requiredLevel: 3, priority: "medium" as const },
  { skill: "Git/GitHub", currentLevel: 3, requiredLevel: 4, priority: "low" as const },
  { skill: "CSS/Tailwind", currentLevel: 3, requiredLevel: 4, priority: "low" as const },
];

const defaultCourses = [
  {
    title: "React - The Complete Guide 2024",
    provider: "Udemy",
    rating: 4.8,
    duration: "40 hours",
    students: "500K+",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop",
    url: "https://udemy.com",
    skill: "React.js",
  },
  {
    title: "TypeScript for Professionals",
    provider: "Coursera",
    rating: 4.7,
    duration: "25 hours",
    students: "200K+",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=200&fit=crop",
    url: "https://coursera.org",
    skill: "TypeScript",
  },
  {
    title: "Node.js Complete Bootcamp",
    provider: "Udemy",
    rating: 4.9,
    duration: "35 hours",
    students: "300K+",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop",
    url: "https://udemy.com",
    skill: "Node.js",
  },
  {
    title: "System Design Fundamentals",
    provider: "LinkedIn Learning",
    rating: 4.6,
    duration: "15 hours",
    students: "150K+",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    url: "https://linkedin.com/learning",
    skill: "System Design",
  },
];

const matchingInternships = [
  {
    id: "1",
    title: "React Developer Intern",
    company: "Flipkart",
    location: "Bangalore",
    duration: "6 months",
    stipend: "₹40,000/mo",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
    type: "Remote",
  },
  {
    id: "2",
    title: "Frontend Intern",
    company: "Swiggy",
    location: "Mumbai",
    duration: "4 months",
    stipend: "₹35,000/mo",
    logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop",
    type: "Hybrid",
  },
];

const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"skills" | "courses" | "internships">("skills");

  // Get analysis data from navigation state
  const analysisData = location.state?.analysis as AnalysisResult | undefined;
  const targetRole = location.state?.role || "Frontend Developer";
  const fileName = location.state?.fileName;

  // Transform AI analysis data to component format
  const skillGaps = analysisData?.skillGaps?.map((gap, index) => ({
    skill: gap.skill,
    currentLevel: gap.importance === "critical" ? 1 : gap.importance === "important" ? 2 : 3,
    requiredLevel: 4,
    priority: gap.importance === "critical" ? "high" as const : gap.importance === "important" ? "medium" as const : "low" as const,
  })) || defaultSkillGaps;

  const recommendedCourses = analysisData?.recommendedCourses?.map((course) => ({
    title: course.title,
    provider: course.platform,
    rating: 4.5 + Math.random() * 0.4,
    duration: course.estimatedDuration,
    students: "100K+",
    image: `https://images.unsplash.com/photo-${1633356122544 + Math.floor(Math.random() * 1000)}-f134324a6cee?w=400&h=200&fit=crop`,
    url: "#",
    skill: course.skill,
  })) || defaultCourses;

  const overallScore = analysisData?.matchScore || 65;
  const highPriorityCount = skillGaps.filter((s) => s.priority === "high").length;
  const mediumPriorityCount = skillGaps.filter((s) => s.priority === "medium").length;

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
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
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
