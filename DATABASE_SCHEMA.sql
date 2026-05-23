-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_slug TEXT NOT NULL REFERENCES projects(slug) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_reviews_project_slug ON reviews(project_slug);
CREATE INDEX idx_reviews_ip_hash ON reviews(ip_hash);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);
CREATE INDEX idx_projects_slug ON projects(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies (public can read projects, but not write)
CREATE POLICY "Projects are viewable by everyone" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

-- Create policies for insert (will be handled by backend API)
CREATE POLICY "Reviews can be inserted via API" ON reviews
  FOR INSERT WITH CHECK (true);

-- Seed some example data
INSERT INTO projects (slug, name) VALUES 
  ('app-one', 'App One'),
  ('app-two', 'App Two')
ON CONFLICT (slug) DO NOTHING;
