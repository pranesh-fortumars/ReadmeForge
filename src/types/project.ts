// Central model for a READMEForge project

import type { 
  ProjectDetails, 
  Section, 
  Feature, 
  TechStackItem, 
  Badge, 
  InstallationConfig, 
  UsageConfig,
  APIEndpoint,
  FAQItem,
  RoadmapItem,
  TroubleshootingItem
} from './index';

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
  screenshots: { url: string; altText: string; caption: string }[];
  demo: { liveUrl: string; videoUrl: string; instructions: string };
  environmentVariables: { name: string; description: string; required: boolean; default: string }[];
  api: { endpoints: APIEndpoint[] };
  projectStructure: string;
  roadmap: RoadmapItem[];
  faq: FAQItem[];
  troubleshooting: TroubleshootingItem[];
  contributing: { instructions: string };
  deployment: { instructions: string };
  author: { name: string; url: string; email: string };
  contact: { links: { id: string; name: string; url: string }[] };
  settings: {
    theme?: string;
    showGithubStats?: boolean;
    showTopLangs?: boolean;
  };
  generatedMarkdown: string;
  qualityScore: { score: number; recommendations: string[] };
  createdAt: string;
  updatedAt: string;
}
