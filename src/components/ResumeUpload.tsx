import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import * as pdfjsLib from "pdfjs-dist";

// Set up PDF.js worker for v3.x
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

interface ResumeUploadProps {
  onUpload: (file: File) => void;
  selectedRole: string | null;
}

const ResumeUpload = ({ onUpload, selectedRole }: ResumeUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setIsUploaded(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = "";
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: unknown) => (item as { str: string }).str)
        .join(" ");
      fullText += pageText + "\n";
    }
    
    return fullText.trim();
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    // For text files, read directly
    if (file.type === "text/plain") {
      return await file.text();
    }
    
    // For PDF files, use PDF.js
    if (file.type === "application/pdf") {
      try {
        const text = await extractTextFromPdf(file);
        if (text && text.length > 0) {
          return text;
        }
        throw new Error("No text extracted from PDF");
      } catch (error) {
        console.error("PDF extraction error:", error);
        toast.error("Could not extract text from PDF. Try a text-based PDF.");
        return `[Resume file: ${file.name}]`;
      }
    }
    
    // For DOC/DOCX files, try basic text extraction
    try {
      const text = await file.text();
      return text;
    } catch {
      return `[Resume file: ${file.name}]`;
    }
  };

  const handleAnalyze = async () => {
    if (!file || !selectedRole) {
      toast.error("Please select a role and upload a resume");
      return;
    }

    if (!user) {
      toast.error("Please log in to analyze your resume");
      navigate("/login");
      return;
    }

    setIsUploading(true);

    try {
      // Extract text from file
      const resumeText = await extractTextFromFile(file);

      // Ensure we have a valid access token (avoid "Invalid JWT" when session is stale)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const accessToken = session?.access_token;
      if (!accessToken) {
        toast.error("Your session expired. Please log in again.");
        // Clear any stale auth state
        await supabase.auth.signOut();
        navigate("/login");
        setIsUploading(false);
        return;
      }

      // Call the backend function (requires JWT)
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: {
          resumeText,
          targetRole: selectedRole,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (error) {
        console.error("Analysis error:", error);

        const msg = error.message || "Failed to analyze resume";
        if (msg.includes("Invalid JWT") || msg.includes("returned 401")) {
          toast.error("Your session is invalid. Please log in again.");
          await supabase.auth.signOut();
          navigate("/login");
        } else {
          toast.error(msg);
        }

        setIsUploading(false);
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        setIsUploading(false);
        return;
      }

      // Save analysis to database if user is logged in
      if (user && data?.analysis) {
        const { error: saveError } = await supabase
          .from("resume_analyses")
          .insert({
            user_id: user.id,
            role: selectedRole,
            resume_text: resumeText.substring(0, 10000), // Limit stored text
            skill_gaps: data.analysis.skillGaps || [],
            recommended_courses: data.analysis.recommendedCourses || [],
          });

        if (saveError) {
          console.error("Failed to save analysis:", saveError);
        }
      }

      setIsUploading(false);
      setIsUploaded(true);
      onUpload(file);

      // Navigate to analysis with the results
      setTimeout(() => {
        navigate("/analysis", { 
          state: { 
            analysis: data.analysis,
            role: selectedRole,
            fileName: file.name
          } 
        });
      }, 500);

    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast.error("An error occurred while analyzing your resume");
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setIsUploaded(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        {...getRootProps()}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.02]"
            : file
            ? "border-primary/50 bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-secondary/50"
        }`}
      >
        <input {...getInputProps()} />

        <div className="p-12 text-center">
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
              >
                <motion.div
                  className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center"
                  animate={{
                    scale: isDragActive ? 1.1 : 1,
                    backgroundColor: isDragActive
                      ? "hsl(262 83% 58% / 0.2)"
                      : "hsl(262 83% 58% / 0.1)",
                  }}
                >
                  <Upload className="w-10 h-10 text-primary" />
                </motion.div>
                <div>
                  <p className="text-lg font-medium text-foreground">
                    {isDragActive
                      ? "Drop your resume here"
                      : "Drag & drop your resume"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    or click to browse (PDF, DOC, DOCX, TXT - max 5MB)
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="file"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {!isUploading && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="p-2 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {isUploaded && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 text-primary"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Analysis complete! Redirecting...
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-accent/5 blur-2xl" />
      </div>

      {/* Analyze Button */}
      <AnimatePresence>
        {file && !isUploaded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 text-center"
          >
            <Button
              variant="hero"
              size="lg"
              onClick={handleAnalyze}
              disabled={isUploading || !selectedRole}
              className="min-w-[200px]"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                "Analyze Resume"
              )}
            </Button>
            {!selectedRole && (
              <p className="text-sm text-muted-foreground mt-2">
                Please select a target role first
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResumeUpload;
