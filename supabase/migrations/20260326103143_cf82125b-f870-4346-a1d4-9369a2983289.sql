
-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  ca_level TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 1,
  applying_for TEXT NOT NULL,
  domain TEXT NOT NULL,
  resume_url TEXT,
  answer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public form)
CREATE POLICY "Anyone can submit an application"
ON public.applications FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow reading own application (by email match - optional)
CREATE POLICY "Anyone can read applications"
ON public.applications FOR SELECT
TO authenticated
USING (true);

-- Create resumes storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true);

-- Allow anyone to upload to resumes bucket
CREATE POLICY "Anyone can upload resumes"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'resumes');

-- Allow public read access to resumes
CREATE POLICY "Resumes are publicly accessible"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'resumes');
