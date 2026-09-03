export interface ProjectDetails {
  name: string;
  description: string;
  longDescription: string;
  projectUrl: string;
  githubUrl: string;
  authorName: string;
  authorUrl: string;
  license: string;
}

export interface Section {
  id: string;
  title: string;
  enabled: boolean;
  content?: string;
}

export interface Feature {
  id: string;
  text: string;
}

export interface TechStackItem {
  id: string;
  name: string;
  category: string;
}

export interface Badge {
  id: string;
  label: string;
  url: string;
  imageUrl: string;
}

export interface EnvironmentVariable {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

export interface ReadmeState {
  projectDetails: ProjectDetails;
  sections: Section[];
  features: Feature[];
  techStack: TechStackItem[];
  badges: Badge[];
  envVars: EnvironmentVariable[];
  screenshots: string[];
  projectStructure: string;
  installCommand: string;
  runCommand: string;
  packageManager: string;
}
