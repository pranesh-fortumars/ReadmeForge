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
  title: string;
  description: string;
  icon?: string;
  link?: string;
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
  style?: string;
}

export interface EnvironmentVariable {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

export interface Screenshot {
  id: string;
  url: string;
  title: string;
  caption: string;
  altText: string;
}

export interface DemoConfig {
  liveUrl: string;
  videoUrl: string;
  instructions: string;
}

export interface InstallationConfig {
  methods: { id: string; name: string; command: string }[];
}

export interface UsageConfig {
  commands: { id: string; description: string; command: string }[];
}

export interface APIEndpoint {
  id: string;
  method: string;
  path: string;
  description: string;
  parameters: string;
  request: string;
  response: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface TroubleshootingItem {
  id: string;
  problem: string;
  solution: string;
}

export interface READMEProject {
  id: string;
  projectType: 'project' | 'profile';
  version: number;
  metadata: ProjectDetails;
  sections: Section[];
  features: Feature[];
  technologies: TechStackItem[];
  badges: Badge[];
  installation: InstallationConfig;
  usage: UsageConfig;
  screenshots: Screenshot[];
  demo: DemoConfig;
  environmentVariables: EnvironmentVariable[];
  api: { endpoints: APIEndpoint[] };
  projectStructure: string;
  roadmap: RoadmapItem[];
  faq: FAQItem[];
  troubleshooting: TroubleshootingItem[];
  contributing: { instructions: string };
  deployment: { instructions: string };
  author: { name: string; url: string; email: string };
  contact: { links: { id: string; name: string; url: string }[] };
  settings: Record<string, any>;
  generatedMarkdown: string;
  qualityScore: { score: number; recommendations: any[] };
  createdAt: string;
  updatedAt: string;
}

// Temporary alias to smooth over the migration from the old ReadmeState
export type ReadmeState = READMEProject;
