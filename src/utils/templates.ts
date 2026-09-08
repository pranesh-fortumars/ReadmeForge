import { defaultProject, defaultProfile } from '../hooks/useReadme';
import type { READMEProject } from '../types';

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  project: READMEProject;
}

export const templates: Template[] = [
  {
    id: 'minimal',
    name: 'Minimalist',
    description: 'A clean, simple starting point with just the essentials.',
    icon: '📝',
    project: {
      ...defaultProject,
      metadata: { ...defaultProject.metadata, name: 'Minimal Project', description: 'A lightweight and fast project.' },
      sections: defaultProject.sections.map(s => ({
        ...s,
        enabled: ['header', 'description', 'installation', 'usage', 'license'].includes(s.id)
      }))
    }
  },
  {
    id: 'saas',
    name: 'SaaS Product',
    description: 'Perfect for commercial products with screenshots and features.',
    icon: '🚀',
    project: {
      ...defaultProject,
      metadata: { ...defaultProject.metadata, name: 'Awesome SaaS', description: 'The next big thing in tech.' },
      sections: defaultProject.sections.map(s => ({
        ...s,
        enabled: ['header', 'description', 'features', 'screenshots', 'tech-stack', 'installation', 'usage', 'license'].includes(s.id)
      })),
      features: [
        { id: '1', title: 'User Authentication', description: 'Secure login via OAuth' },
        { id: '2', title: 'Real-time Sync', description: 'WebSockets for instant updates' },
      ],
      technologies: [
        { id: '1', name: 'React', category: 'Frontend' },
        { id: '2', name: 'Next.js', category: 'Framework' },
        { id: '3', name: 'Tailwind CSS', category: 'Styling' },
        { id: '4', name: 'PostgreSQL', category: 'Database' },
      ]
    }
  },
  {
    id: 'opensource',
    name: 'Open Source Library',
    description: 'Includes detailed contribution guidelines and badges.',
    icon: '🌍',
    project: {
      ...defaultProject,
      metadata: { ...defaultProject.metadata, name: 'OpenSourceLib', description: 'A utility library for developers.', license: 'MIT' },
      sections: defaultProject.sections.map(s => ({
        ...s,
        enabled: ['header', 'description', 'badges', 'installation', 'usage', 'contributing', 'license', 'author'].includes(s.id)
      })),
      badges: [
        { id: '1', label: 'License', url: '', imageUrl: 'https://img.shields.io/badge/License-MIT-blue.svg' },
        { id: '2', label: 'npm', url: '', imageUrl: 'https://img.shields.io/npm/v/your-package' }
      ],
      installation: {
        methods: [
          { id: 'npm', name: 'npm', command: 'npm install your-package' },
          { id: 'yarn', name: 'yarn', command: 'yarn add your-package' }
        ]
      }
    }
  },
  {
    id: 'profile',
    name: 'GitHub Profile',
    description: 'A personal README for your GitHub profile repository.',
    icon: '👋',
    project: {
      ...defaultProfile
    }
  }
];
