import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Particles from "@/components/Particles";
import { toast } from "sonner";
import { 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Trash2,
  ArrowLeft,
  Loader2
} from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [notifPrefs, setNotifPrefs] = useState({
    email_analysis_complete: true,
    email_weekly_summary: false,
    email_course_recommendations: true,
    email_internship_alerts: true,
  });
  const [notifLoading, setNotifLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchNotificationPrefs = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("notification_preferences")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching notification preferences:", error);
        }

        if (data) {
          setNotifPrefs({
            email_analysis_complete: data.email_analysis_complete ?? true,
            email_weekly_summary: data.email_weekly_summary ?? false,
            email_course_recommendations: data.email_course_recommendations ?? true,
            email_internship_alerts: data.email_internship_alerts ?? true,
          });
        }
      } finally {
        setNotifLoading(false);
      }
    };

    if (user) {
      fetchNotificationPrefs();
    }
  }, [user]);

  const handleNotificationChange = async (key: keyof typeof notifPrefs, value: boolean) => {
    if (!user) return;
    
    setSaving(true);
    const newPrefs = { ...notifPrefs, [key]: value };
    setNotifPrefs(newPrefs);

    try {
      const { error } = await supabase
        .from("notification_preferences")
        .upsert({
          user_id: user.id,
          ...newPrefs,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

      if (error) throw error;
      toast.success("Preferences saved");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences");
      setNotifPrefs(notifPrefs); // Revert
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    
    if (!confirmed) return;

    setDeleteLoading(true);
    try {
      // Delete user data from tables
      await supabase.from("resume_analyses").delete().eq("user_id", user.id);
      await supabase.from("notification_preferences").delete().eq("user_id", user.id);
      await supabase.from("profiles").delete().eq("user_id", user.id);
      
      await signOut();
      toast.success("Account deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Particles />
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account preferences and settings
            </p>
          </motion.div>

          <div className="space-y-6">
            {/* Appearance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize how the app looks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="theme-toggle">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Switch between light and dark themes
                      </p>
                    </div>
                    <Switch
                      id="theme-toggle"
                      checked={theme === "dark"}
                      onCheckedChange={toggleTheme}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Configure email notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {notifLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="analysis-complete">Analysis Complete</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified when your resume analysis is ready
                          </p>
                        </div>
                        <Switch
                          id="analysis-complete"
                          checked={notifPrefs.email_analysis_complete}
                          onCheckedChange={(v) => handleNotificationChange("email_analysis_complete", v)}
                          disabled={saving}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="weekly-summary">Weekly Summary</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive a weekly digest of your progress
                          </p>
                        </div>
                        <Switch
                          id="weekly-summary"
                          checked={notifPrefs.email_weekly_summary}
                          onCheckedChange={(v) => handleNotificationChange("email_weekly_summary", v)}
                          disabled={saving}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="course-recs">Course Recommendations</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified about new recommended courses
                          </p>
                        </div>
                        <Switch
                          id="course-recs"
                          checked={notifPrefs.email_course_recommendations}
                          onCheckedChange={(v) => handleNotificationChange("email_course_recommendations", v)}
                          disabled={saving}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="internship-alerts">Internship Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified about matching internships
                          </p>
                        </div>
                        <Switch
                          id="internship-alerts"
                          checked={notifPrefs.email_internship_alerts}
                          onCheckedChange={(v) => handleNotificationChange("email_internship_alerts", v)}
                          disabled={saving}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <Shield className="w-5 h-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible account actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-destructive">Delete Account</Label>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
