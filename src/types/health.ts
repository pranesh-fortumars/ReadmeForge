export interface DocumentationHealth {
  overallScore: number;
  categories: {
    overview: number;
    installation: number;
    usage: number;
    features: number;
    techStack: number;
    screenshots: number;
    structure: number;
    configuration: number;
    testing: number;
    deployment: number;
    contributing: number;
    license: number;
    links: number;
    formatting: number;
  };
  issues: string[];
  warnings: string[];
  recommendations: string[];
}
