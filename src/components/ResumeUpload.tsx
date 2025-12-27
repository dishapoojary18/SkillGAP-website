import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface ResumeUploadProps {
  onUpload: (file: File) => void;
}

const ResumeUpload = ({ onUpload }: ResumeUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const navigate = useNavigate();

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
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleAnalyze = async () => {
    if (!file) return;

    setIsUploading(true);
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsUploading(false);
    setIsUploaded(true);
    onUpload(file);

    // Navigate to analysis after a short delay
    setTimeout(() => {
      navigate("/analysis");
    }, 500);
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
                    or click to browse (PDF, DOC, DOCX - max 5MB)
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
                      Upload complete! Redirecting...
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
              disabled={isUploading}
              className="min-w-[200px]"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Resume"
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResumeUpload;
