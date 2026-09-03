import type { ReadmeState } from '../types';

export function generateMarkdown(state: ReadmeState): string {
  const { projectDetails, sections, features, techStack, badges, envVars, screenshots, projectStructure, installCommand, runCommand } = state;
  let markdown = '';

  // Helper to check if a section is enabled
  const isEnabled = (id: string) => sections.find(s => s.id === id)?.enabled;
  const getSection = (id: string) => sections.find(s => s.id === id);

  // 1. Badges
  if (isEnabled('badges') && badges.length > 0) {
    markdown += `<div align="center">\n`;
    badges.forEach(badge => {
      markdown += `  <a href="${badge.url}">\n    <img src="${badge.imageUrl}" alt="${badge.label}" />\n  </a>\n`;
    });
    markdown += `</div>\n\n`;
  }

  // 2. Header
  if (isEnabled('header')) {
    markdown += `<h1 align="center">${projectDetails.name}</h1>\n\n`;
  }

  // 3. Description
  if (isEnabled('description')) {
    if (projectDetails.description) {
      markdown += `<p align="center">\n  <strong>${projectDetails.description}</strong>\n</p>\n\n`;
    }
    if (projectDetails.longDescription) {
      markdown += `${projectDetails.longDescription}\n\n`;
    }
  }

  // Generate Table of Contents
  markdown += `## Table of Contents\n\n`;
  sections.filter(s => s.enabled && !['header', 'description', 'badges'].includes(s.id)).forEach(s => {
    const slug = s.title.toLowerCase().replace(/\s+/g, '-');
    markdown += `- [${s.title}](#${slug})\n`;
  });
  markdown += `\n---\n\n`;

  // 4. Features
  if (isEnabled('features') && features.length > 0) {
    markdown += `## ${getSection('features')?.title || 'Features'}\n\n`;
    features.forEach(f => {
      markdown += `- ✓ ${f.text}\n`;
    });
    markdown += `\n`;
  }

  // 5. Tech Stack
  if (isEnabled('techStack') && techStack.length > 0) {
    markdown += `## ${getSection('techStack')?.title || 'Tech Stack'}\n\n`;
    const categories = Array.from(new Set(techStack.map(t => t.category)));
    
    categories.forEach(category => {
      const categoryTechs = techStack.filter(t => t.category === category);
      if (categoryTechs.length > 0) {
        markdown += `**${category}:**\n`;
        categoryTechs.forEach(t => {
          markdown += `- ${t.name}\n`;
        });
        markdown += `\n`;
      }
    });
  }

  // 6. Installation
  if (isEnabled('installation')) {
    markdown += `## ${getSection('installation')?.title || 'Installation'}\n\n`;
    markdown += `1. Clone the repository:\n`;
    const repoUrl = projectDetails.githubUrl || 'https://github.com/username/project.git';
    markdown += `\`\`\`bash\ngit clone ${repoUrl}\n\`\`\`\n\n`;
    markdown += `2. Navigate to the project directory:\n`;
    const folderName = projectDetails.name.toLowerCase().replace(/\s+/g, '-') || 'project';
    markdown += `\`\`\`bash\ncd ${folderName}\n\`\`\`\n\n`;
    markdown += `3. Install dependencies:\n`;
    markdown += `\`\`\`bash\n${installCommand}\n\`\`\`\n\n`;
  }

  // 7. Usage
  if (isEnabled('usage')) {
    markdown += `## ${getSection('usage')?.title || 'Usage'}\n\n`;
    markdown += `Run the development server:\n\n`;
    markdown += `\`\`\`bash\n${runCommand}\n\`\`\`\n\n`;
  }

  // 8. Environment Variables
  if (isEnabled('envVars') && envVars.length > 0) {
    markdown += `## ${getSection('envVars')?.title || 'Environment Variables'}\n\n`;
    markdown += `| Variable | Description | Required |\n`;
    markdown += `|----------|-------------|----------|\n`;
    envVars.forEach(env => {
      markdown += `| \`${env.name}\` | ${env.description} | ${env.required ? 'Yes' : 'No'} |\n`;
    });
    markdown += `\n`;
  }

  // 9. Project Structure
  if (isEnabled('projectStructure') && projectStructure.trim()) {
    markdown += `## ${getSection('projectStructure')?.title || 'Project Structure'}\n\n`;
    markdown += `\`\`\`text\n${projectStructure}\n\`\`\`\n\n`;
  }

  // 10. Screenshots
  if (isEnabled('screenshots') && screenshots.length > 0) {
    markdown += `## ${getSection('screenshots')?.title || 'Screenshots'}\n\n`;
    screenshots.forEach((url, i) => {
      markdown += `![Screenshot ${i + 1}](${url})\n\n`;
    });
  }

  // 11. Demo
  if (isEnabled('demo') && projectDetails.projectUrl) {
    markdown += `## ${getSection('demo')?.title || 'Demo'}\n\n`;
    markdown += `Check out the live demo [here](${projectDetails.projectUrl}).\n\n`;
  }

  // 12. Contributing
  if (isEnabled('contributing')) {
    markdown += `## ${getSection('contributing')?.title || 'Contributing'}\n\n`;
    markdown += `Contributions are always welcome! Please follow these steps:\n\n`;
    markdown += `1. Fork the project\n2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)\n3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)\n4. Push to the branch (\`git push origin feature/AmazingFeature\`)\n5. Open a Pull Request\n\n`;
  }

  // 13. License
  if (isEnabled('license')) {
    markdown += `## ${getSection('license')?.title || 'License'}\n\n`;
    markdown += `This project is licensed under the ${projectDetails.license} License - see the [LICENSE](LICENSE) file for details.\n\n`;
  }

  // 14. Author
  if (isEnabled('author')) {
    markdown += `## ${getSection('author')?.title || 'Author'}\n\n`;
    markdown += `**${projectDetails.authorName || 'Your Name'}**\n\n`;
    if (projectDetails.authorUrl) {
      markdown += `- Website: [${projectDetails.authorUrl}](${projectDetails.authorUrl})\n`;
    }
    if (projectDetails.githubUrl) {
      markdown += `- GitHub: [@${projectDetails.githubUrl.split('/').pop()}](${projectDetails.githubUrl})\n`;
    }
    markdown += `\n`;
  }

  return markdown;
}
