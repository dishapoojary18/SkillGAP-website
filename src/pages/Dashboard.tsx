import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import ResumeUpload from "@/components/ResumeUpload";
import RoleSelector from "@/components/RoleSelector";
import InternshipCard from "@/components/InternshipCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Target, BookOpen, Briefcase, User } from "lucide-react";

const sampleInternships = [
  {
    id: "1",
    title: "Frontend Developer Intern",
    company: "Google",
    location: "Bangalore",
    duration: "6 months",
    stipend: "₹50,000/mo",
    logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop",
    type: "Remote",
  },
  {
    id: "2",
    title: "Software Engineer Intern",
    company: "Microsoft",
    location: "Hyderabad",
    duration: "3 months",
    stipend: "₹45,000/mo",
    logo: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=100&h=100&fit=crop",
    type: "On-site",
  },
  {
    id: "3",
    title: "Data Science Intern",
    company: "Amazon",
    location: "Chennai",
    duration: "6 months",
    stipend: "₹60,000/mo",
    logo: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop",
    type: "Hybrid",
  },
];

const Dashboard = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { user, profile, isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Card for Logged In User */}
          {isAuthenticated && profile && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-primary/30">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {getInitials(profile.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-foreground">
                        Welcome back, {profile.full_name?.split(" ")[0] || "there"}! 👋
                      </h2>
                      <p className="text-muted-foreground">
                        Ready to continue your career journey?
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/profile")}
                      className="gap-2"
                    >
                      <User className="w-4 h-4" />
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Career Analysis
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Discover Your{" "}
              <span className="gradient-text">Skill Gaps</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your resume, select your dream role, and get personalized
              recommendations to bridge the gap between where you are and where
              you want to be.
            </p>
          </motion.div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            {[
              {
                icon: BookOpen,
                title: "Upload Resume",
                description: "Drag & drop your resume for AI analysis",
              },
              {
                icon: Target,
                title: "Select Role",
                description: "Choose your target career position",
              },
              {
                icon: Sparkles,
                title: "Get Insights",
                description: "Receive personalized skill gap analysis",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-12 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Resume Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Upload Your Resume
              </h2>
              <p className="text-muted-foreground mb-6">
                We support PDF, DOC, and DOCX formats up to 5MB
              </p>
              <ResumeUpload onUpload={handleFileUpload} selectedRole={selectedRole} />
            </motion.div>

            {/* Role Selector */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Select Target Role
              </h2>
              <p className="text-muted-foreground mb-6">
                Choose the role you're aiming for in your career
              </p>
              <RoleSelector
                selectedRole={selectedRole}
                onSelect={setSelectedRole}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Internships Preview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Latest Internships
              </h2>
              <p className="text-muted-foreground">
                Top opportunities matching your profile
              </p>
            </div>
            <Button
              variant="soft"
              onClick={() => navigate("/internships")}
              className="gap-2"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleInternships.map((internship, index) => (
              <InternshipCard key={internship.id} {...internship} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto text-center glass-card p-12 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative z-10">
            <Briefcase className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of students who have already discovered their skill
              gaps and landed their dream internships.
            </p>
            <Button variant="hero" size="lg" onClick={() => navigate("/signup")}>
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-2xl font-display font-bold gradient-text">
            SkillGAP
          </span>
          <p className="text-sm text-muted-foreground">
            © 2024 SkillGAP. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
