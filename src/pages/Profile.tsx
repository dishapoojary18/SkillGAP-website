import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, FileText, Calendar, Target, TrendingUp, Pencil, Camera, Loader2, Bell, Mail } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ResumeAnalysis {
  id: string;
  role: string;
  created_at: string;
  skill_gaps: unknown;
  recommended_courses: unknown;
}

interface NotificationPreferences {
  email_analysis_complete: boolean;
  email_weekly_summary: boolean;
  email_course_recommendations: boolean;
  email_internship_alerts: boolean;
}

const Profile = () => {
  const { user, profile, isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [analysesLoading, setAnalysesLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>({
    email_analysis_complete: true,
    email_weekly_summary: false,
    email_course_recommendations: true,
    email_internship_alerts: true,
  });
  const [notifLoading, setNotifLoading] = useState(true);
  const [notifSaving, setNotifSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (profile?.full_name) {
      setEditName(profile.full_name);
    }
    if (profile?.avatar_url) {
      setLocalAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

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

  useEffect(() => {
    const fetchNotificationPrefs = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching notification preferences:", error);
      } else if (data) {
        setNotifPrefs({
          email_analysis_complete: data.email_analysis_complete,
          email_weekly_summary: data.email_weekly_summary,
          email_course_recommendations: data.email_course_recommendations,
          email_internship_alerts: data.email_internship_alerts,
        });
      }
      setNotifLoading(false);
    };

    if (user) {
      fetchNotificationPrefs();
    }
  }, [user]);

  const handleNotifToggle = async (key: keyof NotificationPreferences, value: boolean) => {
    if (!user) return;
    
    const newPrefs = { ...notifPrefs, [key]: value };
    setNotifPrefs(newPrefs);
    setNotifSaving(true);

    // Check if preferences exist
    const { data: existing } = await supabase
      .from("notification_preferences")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    let error;
    if (existing) {
      // Update existing
      ({ error } = await supabase
        .from("notification_preferences")
        .update(newPrefs)
        .eq("user_id", user.id));
    } else {
      // Insert new
      ({ error } = await supabase
        .from("notification_preferences")
        .insert({ user_id: user.id, ...newPrefs }));
    }

    if (error) {
      console.error("Error saving notification preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preferences.",
        variant: "destructive",
      });
      // Revert on error
      setNotifPrefs({ ...notifPrefs });
    }
    setNotifSaving(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: editName.trim() })
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      setEditDialogOpen(false);
      // Refresh the page to get updated profile
      window.location.reload();
    }
    setSaving(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingAvatar(true);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      setLocalAvatarUrl(avatarUrl);
      toast({
        title: "Success",
        description: "Avatar updated successfully!",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

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
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-24">
        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={saving || !editName.trim()}
                      className="w-full"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={localAvatarUrl || undefined} />
                  <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                    {getInitials(profile?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleAvatarClick}
                  disabled={uploadingAvatar}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {uploadingAvatar ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  ) : (
                    <Camera className="h-6 w-6 text-white" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
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
                  <Card 
                    key={analysis.id} 
                    className="bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => navigate(`/analysis?id=${analysis.id}`)}
                  >
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

        {/* Notification Settings */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Email Notifications
            </CardTitle>
            <CardDescription>
              Manage how you receive email updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {notifLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Analysis Complete</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when your resume analysis is ready
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifPrefs.email_analysis_complete}
                    onCheckedChange={(checked) => handleNotifToggle("email_analysis_complete", checked)}
                    disabled={notifSaving}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Weekly Summary</p>
                      <p className="text-sm text-muted-foreground">
                        Receive a weekly digest of your progress
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifPrefs.email_weekly_summary}
                    onCheckedChange={(checked) => handleNotifToggle("email_weekly_summary", checked)}
                    disabled={notifSaving}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Course Recommendations</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about new courses matching your skill gaps
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifPrefs.email_course_recommendations}
                    onCheckedChange={(checked) => handleNotifToggle("email_course_recommendations", checked)}
                    disabled={notifSaving}
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Internship Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts for new internship opportunities
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifPrefs.email_internship_alerts}
                    onCheckedChange={(checked) => handleNotifToggle("email_internship_alerts", checked)}
                    disabled={notifSaving}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
