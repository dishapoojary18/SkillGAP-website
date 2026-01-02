import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User, FileText, Calendar, Target, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface ResumeAnalysis {
  id: string;
  role: string;
  created_at: string;
  skill_gaps: unknown;
  recommended_courses: unknown;
}

const Profile = () => {
  const { user, profile, isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [analysesLoading, setAnalysesLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("resume_analyses")
        .select("id, role, created_at, skill_gaps, recommended_courses")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching analyses:", error);
      } else {
        setAnalyses(data || []);
      }
      setAnalysesLoading(false);
    };

    if (user) {
      fetchAnalyses();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-48 w-full mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                  {getInitials(profile?.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">
                  {profile?.full_name || "User"}
                </h2>
                <p className="text-muted-foreground">{profile?.email || user?.email}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {user?.created_at ? format(new Date(user.created_at), "MMMM yyyy") : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Analysis History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resume Analysis History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysesLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : analyses.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No resume analyses yet</p>
                <Button onClick={() => navigate("/upload")}>
                  Upload Your First Resume
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {analyses.map((analysis) => (
                  <Card key={analysis.id} className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="font-medium">{analysis.role}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(analysis.created_at), "MMM d, yyyy")}
                        </div>
                      </div>
                      
                      {Array.isArray(analysis.skill_gaps) && analysis.skill_gaps.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Skill Gaps Identified:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {(analysis.skill_gaps as string[]).slice(0, 5).map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {(analysis.skill_gaps as string[]).length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{(analysis.skill_gaps as string[]).length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {Array.isArray(analysis.recommended_courses) && analysis.recommended_courses.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {analysis.recommended_courses.length} courses recommended
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
