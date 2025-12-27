import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ResumeUpload from "@/components/ResumeUpload";
import RoleSelector from "@/components/RoleSelector";
import Particles from "@/components/Particles";
import { Sparkles, Target, FileText, ArrowRight } from "lucide-react";

const Upload = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Particles quantity={50} color="139, 92, 246" />
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
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
              AI-Powered Resume Analysis
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Analyze Your <span className="gradient-text">Resume</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select your target role and upload your resume. Our AI will analyze
              your skills and identify gaps to help you succeed.
            </p>
          </motion.div>

          {/* Steps Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${selectedRole ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">1. Select Role</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${uploadedFile ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">2. Upload Resume</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">3. Get Analysis</span>
            </div>
          </motion.div>

          {/* Step 1: Role Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground">
                  Step 1: Select Your Target Role
                </h2>
                <p className="text-sm text-muted-foreground">
                  Choose the role you're aiming for in your career
                </p>
              </div>
            </div>
            <RoleSelector selectedRole={selectedRole} onSelect={setSelectedRole} />
          </motion.div>

          {/* Step 2: Resume Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`glass-card p-8 transition-opacity ${!selectedRole ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground">
                  Step 2: Upload Your Resume
                </h2>
                <p className="text-sm text-muted-foreground">
                  We support PDF, DOC, and DOCX formats up to 5MB
                </p>
              </div>
            </div>
            {!selectedRole && (
              <div className="text-center py-8 text-muted-foreground">
                Please select a target role first to continue
              </div>
            )}
            {selectedRole && <ResumeUpload onUpload={handleFileUpload} />}
          </motion.div>

          {/* Selected Role Display */}
          {selectedRole && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-muted-foreground">
                Analyzing resume for:{" "}
                <span className="font-semibold text-primary">{selectedRole}</span>
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
