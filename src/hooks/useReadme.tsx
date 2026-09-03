import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ReadmeState, ProjectDetails, Section, Feature, TechStackItem, Badge, EnvironmentVariable } from '../types';

export const defaultSections: Section[] = [
  { id: 'header', title: 'Header', enabled: true },
  { id: 'description', title: 'Description', enabled: true },
  { id: 'badges', title: 'Badges', enabled: true },
  { id: 'features', title: 'Features', enabled: true },
  { id: 'demo', title: 'Demo', enabled: true },
  { id: 'screenshots', title: 'Screenshots', enabled: true },
  { id: 'techStack', title: 'Tech Stack', enabled: true },
  { id: 'installation', title: 'Installation', enabled: true },
  { id: 'usage', title: 'Usage', enabled: true },
  { id: 'envVars', title: 'Environment Variables', enabled: true },
  { id: 'projectStructure', title: 'Project Structure', enabled: true },
  { id: 'contributing', title: 'Contributing', enabled: true },
  { id: 'license', title: 'License', enabled: true },
  { id: 'author', title: 'Author', enabled: true },
];

export const defaultState: ReadmeState = {
  projectDetails: {
    name: 'READMEForge',
    description: 'A modern GitHub README generator that helps developers create professional documentation in minutes.',
    longDescription: '',
    projectUrl: '',
    githubUrl: '',
    authorName: '',
    authorUrl: '',
    license: 'MIT',
  },
  sections: defaultSections,
  features: [
    { id: '1', text: 'Live Markdown preview' },
    { id: '2', text: 'Professional templates' },
    { id: '3', text: 'GitHub repository import' },
    { id: '4', text: 'Badge generator' },
    { id: '5', text: 'README quality score' },
    { id: '6', text: 'One-click Markdown export' },
  ],
  techStack: [
    { id: 'react', name: 'React', category: 'Frontend' },
    { id: 'typescript', name: 'TypeScript', category: 'Language' },
    { id: 'vite', name: 'Vite', category: 'Tooling' },
    { id: 'tailwind', name: 'Tailwind CSS', category: 'Styling' },
  ],
  badges: [],
  envVars: [],
  screenshots: [],
  projectStructure: '',
  installCommand: 'npm install',
  runCommand: 'npm run dev',
  packageManager: 'npm',
};

interface ReadmeContextType {
  state: ReadmeState;
  setState: React.Dispatch<React.SetStateAction<ReadmeState>>;
  updateProjectDetails: (details: Partial<ProjectDetails>) => void;
  toggleSection: (id: string) => void;
  reorderSections: (newSections: Section[]) => void;
  resetState: () => void;
}

const ReadmeContext = createContext<ReadmeContextType | undefined>(undefined);

export function ReadmeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ReadmeState>(() => {
    const saved = localStorage.getItem('readmeforge_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved state');
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem('readmeforge_state', JSON.stringify(state));
  }, [state]);

  const updateProjectDetails = (details: Partial<ProjectDetails>) => {
    setState((prev) => ({
      ...prev,
      projectDetails: { ...prev.projectDetails, ...details },
    }));
  };

  const toggleSection = (id: string) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    }));
  };

  const reorderSections = (newSections: Section[]) => {
    setState((prev) => ({ ...prev, sections: newSections }));
  };

  const resetState = () => {
    if (window.confirm('Are you sure you want to reset your project? This cannot be undone.')) {
      setState(defaultState);
    }
  };

  return (
    <ReadmeContext.Provider
      value={{ state, setState, updateProjectDetails, toggleSection, reorderSections, resetState }}
    >
      {children}
    </ReadmeContext.Provider>
  );
}

export function useReadme() {
  const context = useContext(ReadmeContext);
  if (context === undefined) {
    throw new Error('useReadme must be used within a ReadmeProvider');
  }
  return context;
}
