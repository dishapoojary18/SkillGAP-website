-- Add recommended_internships column to resume_analyses table
ALTER TABLE public.resume_analyses 
ADD COLUMN recommended_internships jsonb DEFAULT NULL;