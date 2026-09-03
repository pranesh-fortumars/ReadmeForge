export interface GitHubRepository {
  owner: string;
  name: string;
  fullName: string;
  url: string;
  defaultBranch: string;
  description: string;
  language: string;
  languages: string[];
  stars: number;
  forks: number;
  issues: number;
  license: string | null;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  size: number;
  visibility: string;
  headSha: string;
  analysisStatus: 'pending' | 'completed' | 'failed';
  lastAnalyzedAt: string | null;
}

export interface RepositoryAnalysis {
  projectType: string;
  languages: string[];
  frameworks: string[];
  libraries: string[];
  databases: string[];
  authentication: string[];
  testing: string[];
  deployment: string[];
  ciCd: string[];
  docker: boolean;
  packageManagers: string[];
  dependencies: string[];
  structure: string;
  documentation: string;
  securitySignals: string[];
}
