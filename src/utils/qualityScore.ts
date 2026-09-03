import { ReadmeState } from '../types';

export interface QualityResult {
  score: number;
  completed: string[];
  recommendations: string[];
}

export function calculateQualityScore(state: ReadmeState): QualityResult {
  const completed: string[] = [];
  const recommendations: string[] = [];
  let score = 0;

  const { projectDetails, sections, features, techStack, screenshots } = state;
  const isEnabled = (id: string) => sections.find(s => s.id === id)?.enabled;

  // Description
  if (projectDetails.description && projectDetails.description.length > 10) {
    completed.push('Project description');
    score += 15;
  } else {
    recommendations.push('Add a descriptive project description');
  }

  // Installation
  if (isEnabled('installation') && state.installCommand) {
    completed.push('Installation instructions');
    score += 15;
  } else {
    recommendations.push('Enable and complete installation section');
  }

  // Usage
  if (isEnabled('usage') && state.runCommand) {
    completed.push('Usage section');
    score += 15;
  } else {
    recommendations.push('Enable and complete usage section');
  }

  // Tech Stack
  if (isEnabled('techStack') && techStack.length > 0) {
    completed.push('Tech stack');
    score += 10;
  } else {
    recommendations.push('Add technologies to tech stack');
  }

  // License
  if (isEnabled('license') && projectDetails.license) {
    completed.push('License');
    score += 10;
  } else {
    recommendations.push('Specify a project license');
  }

  // Screenshots
  if (isEnabled('screenshots') && screenshots.length > 0) {
    completed.push('Screenshots included');
    score += 15;
  } else {
    recommendations.push('Missing screenshots');
  }

  // Demo URL
  if (isEnabled('demo') && projectDetails.projectUrl) {
    completed.push('Live demo URL');
    score += 10;
  } else {
    recommendations.push('Missing demo URL');
  }

  // Features
  if (isEnabled('features') && features.length > 0) {
    completed.push('Features list');
    score += 10;
  } else {
    recommendations.push('Add project features');
  }

  return {
    score: Math.min(100, score),
    completed,
    recommendations
  };
}
