import type { TechStackItem } from '../../types';

interface GitHubRepoInfo {
  name: string;
  description: string;
  owner: string;
  stars: number;
  forks: number;
  license: string | null;
  defaultBranch: string;
  technologies: TechStackItem[];
}

// A simple dictionary to map common dependencies to tech stack items
const TECH_DICTIONARY: Record<string, Omit<TechStackItem, 'id'>> = {
  'react': { name: 'React', category: 'Frontend' },
  'vue': { name: 'Vue', category: 'Frontend' },
  'svelte': { name: 'Svelte', category: 'Frontend' },
  'next': { name: 'Next.js', category: 'Framework' },
  'nuxt': { name: 'Nuxt', category: 'Framework' },
  'express': { name: 'Express', category: 'Backend' },
  'tailwindcss': { name: 'Tailwind CSS', category: 'Styling' },
  'typescript': { name: 'TypeScript', category: 'Language' },
  'vite': { name: 'Vite', category: 'Tooling' },
  'jest': { name: 'Jest', category: 'Testing' },
  'vitest': { name: 'Vitest', category: 'Testing' },
  'mongoose': { name: 'MongoDB', category: 'Database' },
  'prisma': { name: 'Prisma', category: 'Database' },
  'firebase': { name: 'Firebase', category: 'Backend' },
  'supabase': { name: 'Supabase', category: 'Backend' },
};

export async function analyzeRepository(url: string): Promise<GitHubRepoInfo | null> {
  try {
    // Basic validation of github url
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) throw new Error('Invalid GitHub URL');
    
    const owner = match[1];
    const repo = match[2].replace('.git', '');
    
    // 1. Fetch metadata
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!repoRes.ok) throw new Error('Repository not found');
    const repoData = await repoRes.json();
    
    const info: GitHubRepoInfo = {
      name: repoData.name,
      description: repoData.description || '',
      owner: repoData.owner.login,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      license: repoData.license?.spdx_id || null,
      defaultBranch: repoData.default_branch,
      technologies: []
    };

    // 2. Try to fetch package.json for tech stack detection
    try {
      const pkgRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${info.defaultBranch}/package.json`);
      if (pkgRes.ok) {
        const pkg = await pkgRes.json();
        const allDeps = {
          ...(pkg.dependencies || {}),
          ...(pkg.devDependencies || {})
        };
        
        const detectedTech: TechStackItem[] = [];
        let idCounter = 1;

        // Check language
        if (pkg.devDependencies?.typescript || repoData.language === 'TypeScript') {
          detectedTech.push({ id: `tech-${idCounter++}`, name: 'TypeScript', category: 'Language' });
        } else if (repoData.language === 'JavaScript') {
          detectedTech.push({ id: `tech-${idCounter++}`, name: 'JavaScript', category: 'Language' });
        }

        // Match dependencies against dictionary
        for (const [dep, tech] of Object.entries(TECH_DICTIONARY)) {
          // simple includes check for things like @vitejs/plugin-react
          const hasDep = Object.keys(allDeps).some(d => d.includes(dep));
          if (hasDep && !detectedTech.find(t => t.name === tech.name)) {
            detectedTech.push({ id: `tech-${idCounter++}`, ...tech });
          }
        }

        info.technologies = detectedTech;
      }
    } catch (e) {
      console.warn('Could not parse package.json for tech stack analysis', e);
    }

    return info;
  } catch (error) {
    console.error('Repository analysis failed:', error);
    return null;
  }
}
