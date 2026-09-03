import type { READMEProject } from '../../types';

export interface QualityResult {
  score: number;
  categories: {
    structure: { score: number; max: number };
    content: { score: number; max: number };
    media: { score: number; max: number };
  };
  completed: string[];
  recommendations: string[];
  errors: string[];
}

export function calculateQualityScore(state: READMEProject): QualityResult {
  const completed: string[] = [];
  const recommendations: string[] = [];
  const errors: string[] = [];
  
  const categories = {
    structure: { score: 0, max: 40 },
    content: { score: 0, max: 40 },
    media: { score: 0, max: 20 },
  };

  const { metadata, sections, features, technologies, screenshots, installation, usage, demo } = state;
  const isEnabled = (id: string) => sections?.find(s => s.id === id)?.enabled;

  // -- STRUCTURE (Max 40) --
  if (isEnabled('installation') && installation?.methods?.length > 0) {
    completed.push('Installation instructions');
    categories.structure.score += 15;
  } else if (isEnabled('installation')) {
    errors.push('Installation section is enabled but empty.');
  } else {
    recommendations.push('Enable and complete installation section');
  }

  if (isEnabled('usage') && usage?.commands?.length > 0) {
    completed.push('Usage section');
    categories.structure.score += 15;
  } else if (isEnabled('usage')) {
    errors.push('Usage section is enabled but empty.');
  } else {
    recommendations.push('Enable and complete usage section');
  }

  if (isEnabled('license') && metadata.license) {
    completed.push('License');
    categories.structure.score += 10;
  } else {
    recommendations.push('Specify a project license');
  }

  // -- CONTENT (Max 40) --
  if (metadata.description && metadata.description.length > 10) {
    completed.push('Project description');
    categories.content.score += 15;
  } else {
    errors.push('Project description is too short or missing.');
  }

  if (isEnabled('tech-stack') && technologies && technologies.length > 0) {
    completed.push('Tech stack');
    categories.content.score += 15;
  } else if (isEnabled('tech-stack')) {
    errors.push('Tech Stack is enabled but empty.');
  } else {
    recommendations.push('Add technologies to tech stack');
  }

  if (isEnabled('features') && features && features.length > 0) {
    completed.push('Features list');
    categories.content.score += 10;
  } else if (isEnabled('features')) {
    errors.push('Features section is enabled but empty.');
  } else {
    recommendations.push('Add project features');
  }

  // -- MEDIA (Max 20) --
  if (isEnabled('screenshots') && screenshots && screenshots.length > 0) {
    // Check for missing alt text (Linter)
    const missingAlt = screenshots.find(s => !s.altText || s.altText.trim() === '');
    if (missingAlt) {
      errors.push('One or more screenshots are missing accessibility alt-text.');
      categories.media.score += 5; // partial credit
    } else {
      completed.push('Screenshots included with alt-text');
      categories.media.score += 15;
    }
  } else if (isEnabled('screenshots')) {
    errors.push('Screenshots section is enabled but empty.');
  } else {
    recommendations.push('Add screenshots to improve visual appeal');
  }

  if (isEnabled('demo') && (demo?.liveUrl || metadata.projectUrl)) {
    completed.push('Live demo URL');
    categories.media.score += 5;
  } else {
    recommendations.push('Add a live demo URL if applicable');
  }
  
  // Calculate final score
  const score = categories.structure.score + categories.content.score + categories.media.score;

  return {
    score: Math.min(100, score),
    categories,
    completed,
    recommendations,
    errors
  };
}
