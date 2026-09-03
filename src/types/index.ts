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

export type { READMEProject } from './project';
export type { GitHubRepository, RepositoryAnalysis } from './repository';
export type { DocumentationHealth } from './health';

export type ReadmeState = import('./project').READMEProject;
