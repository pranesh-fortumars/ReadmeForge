import type { READMEProject } from '../types';

export function generateMarkdown(state: READMEProject): string {
  const { metadata, sections, features, technologies, badges, environmentVariables, screenshots, projectStructure, installation, usage } = state;
  let markdown = '';

  const isEnabled = (id: string) => sections?.find(s => s.id === id)?.enabled;

  // Header Section
  if (isEnabled('header')) {
    markdown += `<h1 align="center">${metadata.name || 'Project Name'}</h1>\n\n`;
    
    if (metadata.description) {
      markdown += `<p align="center">\n  <strong>${metadata.description}</strong>\n</p>\n\n`;
    }
  }

  // Badges
  if (isEnabled('badges') && badges && badges.length > 0) {
    markdown += `<div align="center">\n`;
    badges.forEach(b => {
      markdown += `  <img src="${b.imageUrl}" alt="${b.label}" />\n`;
    });
    markdown += `</div>\n\n`;
  }

  // Description
  if (isEnabled('description') && metadata.longDescription) {
    markdown += `## Description\n\n${metadata.longDescription}\n\n`;
  }
  
  // Screenshots
  if (isEnabled('screenshots') && screenshots && screenshots.length > 0) {
    markdown += `## Screenshots\n\n`;
    screenshots.forEach(s => {
      markdown += `![${s.altText}](${s.url})\n*${s.caption}*\n\n`;
    });
  }

  // Features
  if (isEnabled('features') && features && features.length > 0) {
    markdown += `## Features\n\n`;
    features.forEach(f => {
      markdown += `- ${f.title}${f.description ? `: ${f.description}` : ''}\n`;
    });
    markdown += `\n`;
  }

  // Tech Stack / Skills
  if (isEnabled('tech-stack') && technologies && technologies.length > 0) {
    markdown += state.projectType === 'profile' ? `## Skills\n\n` : `## Tech Stack\n\n`;
    
    // Group by category
    const categories = [...new Set(technologies.map(t => t.category))];
    categories.forEach(cat => {
      const items = technologies.filter(t => t.category === cat);
      markdown += `**${cat}:**\n`;
      items.forEach(item => {
        markdown += `- ${item.name}\n`;
      });
      markdown += '\n';
    });
  }

  // GitHub Stats (Profile Specific)
  if (state.projectType === 'profile' && isEnabled('stats') && state.settings?.showGithubStats && metadata.githubUrl) {
    const username = metadata.githubUrl.split('/').pop();
    const theme = state.settings.theme || 'radical';
    if (username) {
      markdown += `## GitHub Stats\n\n`;
      markdown += `<div align="center">\n`;
      markdown += `  <img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${theme}" alt="${username}'s GitHub stats" />\n`;
      if (state.settings?.showTopLangs) {
        markdown += `  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${theme}" alt="${username}'s Top Languages" />\n`;
      }
      markdown += `</div>\n\n`;
    }
  }

  // Installation
  if (isEnabled('installation') && installation?.methods?.length > 0) {
    markdown += `## Installation\n\n`;
    installation.methods.forEach(method => {
      markdown += `${method.name}:\n\`\`\`bash\n${method.command}\n\`\`\`\n\n`;
    });
  }

  // Usage
  if (isEnabled('usage') && usage?.commands?.length > 0) {
    markdown += `## Usage\n\n`;
    usage.commands.forEach(cmd => {
      markdown += `${cmd.description}\n\`\`\`bash\n${cmd.command}\n\`\`\`\n\n`;
    });
  }

  // Environment Variables
  if (isEnabled('env-vars') && environmentVariables && environmentVariables.length > 0) {
    markdown += `## Environment Variables\n\nTo run this project, you will need to add the following environment variables to your .env file\n\n`;
    environmentVariables.forEach(env => {
      markdown += `\`${env.name}\` ${env.required ? '(Required)' : ''} - ${env.description}\n\n`;
    });
  }

  // Project Structure
  if (isEnabled('project-structure') && projectStructure) {
    markdown += `## Project Structure\n\n\`\`\`text\n${projectStructure}\n\`\`\`\n\n`;
  }
  
  // Contributing
  if (isEnabled('contributing') && state.contributing?.instructions) {
    markdown += `## Contributing\n\n${state.contributing.instructions}\n\n`;
  }

  // License
  if (isEnabled('license')) {
    markdown += `## License\n\nThis project is licensed under the ${metadata.license || 'MIT'} License - see the [LICENSE](LICENSE) file for details.\n\n`;
  }

  // Author
  if (isEnabled('author') && (metadata.authorName || metadata.githubUrl)) {
    markdown += `## Author\n\n`;
    if (metadata.authorName) markdown += `**${metadata.authorName}**\n\n`;
    if (metadata.authorUrl) markdown += `- Website: [${metadata.authorUrl}](${metadata.authorUrl})\n`;
    if (metadata.githubUrl) markdown += `- GitHub: [@${metadata.githubUrl.split('/').pop()}](${metadata.githubUrl})\n`;
  }

  return markdown.trim();
}
