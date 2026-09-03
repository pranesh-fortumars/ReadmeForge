import type { READMEProject } from '../types';

export interface QualityResult {
  score: number;
  completed: string[];
  recommendations: string[];
}

export function calculateQualityScore(state: READMEProject): QualityResult {
  const completed: string[] = [];
  const recommendations: string[] = [];
  let score = 0;

  const { metadata, sections, features, technologies, screenshots, installation, usage, demo } = state;
  const isEnabled = (id: string) => sections?.find(s => s.id === id)?.enabled;

  // Description
  if (metadata.description && metadata.description.length > 10) {
    completed.push('Project description');
    score += 15;
  } else {
    recommendations.push('Add a descriptive project description');
  }

  // Installation
  if (isEnabled('installation') && installation?.methods?.length > 0) {
    completed.push('Installation instructions');
    score += 15;
  } else {
    recommendations.push('Enable and complete installation section');
  }

  // Usage
  if (isEnabled('usage') && usage?.commands?.length > 0) {
    completed.push('Usage section');
    score += 15;
  } else {
    recommendations.push('Enable and complete usage section');
  }

  // Tech Stack
  if (isEnabled('tech-stack') && technologies && technologies.length > 0) {
    completed.push('Tech stack');
    score += 10;
  } else {
    recommendations.push('Add technologies to tech stack');
  }

  // License
  if (isEnabled('license') && metadata.license) {
    completed.push('License');
    score += 10;
  } else {
    recommendations.push('Specify a project license');
  }

  // Screenshots
  if (isEnabled('screenshots') && screenshots && screenshots.length > 0) {
    completed.push('Screenshots included');
    score += 15;
  } else {
    recommendations.push('Missing screenshots');
  }

  // Demo URL
  if (isEnabled('demo') && (demo?.liveUrl || metadata.projectUrl)) {
    completed.push('Live demo URL');
    score += 10;
  } else {
    recommendations.push('Missing demo URL');
  }

  // Features
  if (isEnabled('features') && features && features.length > 0) {
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
