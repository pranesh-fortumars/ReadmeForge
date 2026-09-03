import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { READMEProject, Section } from '../types';

export const defaultSections: Section[] = [
  { id: 'header', title: 'Header', enabled: true },
  { id: 'description', title: 'Description', enabled: true },
  { id: 'badges', title: 'Badges', enabled: true },
  { id: 'screenshots', title: 'Screenshots', enabled: true },
  { id: 'tech-stack', title: 'Tech Stack', enabled: true },
  { id: 'installation', title: 'Installation', enabled: true },
  { id: 'usage', title: 'Usage', enabled: true },
  { id: 'env-vars', title: 'Environment Variables', enabled: true },
  { id: 'project-structure', title: 'Project Structure', enabled: true },
  { id: 'contributing', title: 'Contributing', enabled: true },
  { id: 'license', title: 'License', enabled: true },
  { id: 'author', title: 'Author', enabled: true }
];

export const defaultProject: READMEProject = {
  id: 'default',
  projectType: 'project',
  version: 2,
  metadata: {
    name: '',
    description: '',
    longDescription: '',
    projectUrl: '',
    githubUrl: '',
    authorName: '',
    authorUrl: '',
    license: 'MIT',
  },
  sections: defaultSections,
  features: [
    { id: '1', title: 'Live Markdown preview', description: '' },
    { id: '2', title: 'Professional templates', description: '' },
    { id: '3', title: 'GitHub repository import', description: '' },
    { id: '4', title: 'Badge generator', description: '' },
    { id: '5', title: 'README quality score', description: '' },
    { id: '6', title: 'One-click Markdown export', description: '' }
  ],
  technologies: [
    { id: '1', name: 'React', category: 'Frontend' },
    { id: '2', name: 'TypeScript', category: 'Language' },
    { id: '3', name: 'Vite', category: 'Tooling' },
    { id: '4', name: 'Tailwind CSS', category: 'Styling' }
  ],
  badges: [],
  installation: {
    methods: [
      { id: 'clone', name: 'Clone', command: 'git clone https://github.com/username/project.git' },
      { id: 'cd', name: 'Navigate', command: 'cd project-directory' },
      { id: 'install', name: 'Install', command: 'npm install' }
    ]
  },
  usage: {
    commands: [
      { id: 'dev', description: 'Run the development server:', command: 'npm run dev' }
    ]
  },
  screenshots: [],
  demo: { liveUrl: '', videoUrl: '', instructions: '' },
  environmentVariables: [],
  api: { endpoints: [] },
  projectStructure: 'src/\n├── components/\n├── hooks/\n├── utils/\n└── App.tsx',
  roadmap: [],
  faq: [],
  troubleshooting: [],
  contributing: { instructions: 'Contributions are always welcome!\n\n1. Fork the project\n2. Create your feature branch (`git checkout -b feature/AmazingFeature`)\n3. Commit your changes (`git commit -m \'Add some AmazingFeature\'`)\n4. Push to the branch (`git push origin feature/AmazingFeature`)\n5. Open a Pull Request' },
  deployment: { instructions: '' },
  author: { name: '', url: '', email: '' },
  contact: { links: [] },
  settings: {},
  generatedMarkdown: '',
  qualityScore: { score: 0, recommendations: [] },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const defaultProfile: READMEProject = {
  id: 'profile',
  projectType: 'profile',
  version: 2,
  metadata: {
    name: 'Hi, I am Developer 👋',
    description: 'Passionate frontend engineer and open-source contributor',
    longDescription: 'I am currently working on awesome web projects. I love building tools that empower developers.',
    projectUrl: '',
    githubUrl: '',
    authorName: '',
    authorUrl: '',
    license: '',
  },
  sections: [
    { id: 'header', title: 'Greeting', enabled: true },
    { id: 'description', title: 'About Me', enabled: true },
    { id: 'tech-stack', title: 'Skills', enabled: true },
    { id: 'stats', title: 'GitHub Stats', enabled: true },
    { id: 'contact', title: 'Socials', enabled: true },
  ],
  features: [],
  technologies: [
    { id: '1', name: 'React', category: 'Frontend' },
    { id: '2', name: 'TypeScript', category: 'Language' },
  ],
  badges: [],
  installation: { methods: [] },
  usage: { commands: [] },
  screenshots: [],
  demo: { liveUrl: '', videoUrl: '', instructions: '' },
  environmentVariables: [],
  api: { endpoints: [] },
  projectStructure: '',
  roadmap: [],
  faq: [],
  troubleshooting: [],
  contributing: { instructions: '' },
  deployment: { instructions: '' },
  author: { name: '', url: '', email: '' },
  contact: { links: [
    { id: 'twitter', name: 'Twitter', url: 'https://twitter.com/username' },
    { id: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com/in/username' }
  ] },
  settings: {
    showGithubStats: true,
    showTopLangs: true,
    theme: 'radical'
  },
  generatedMarkdown: '',
  qualityScore: { score: 0, recommendations: [] },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

interface ReadmeContextType {
  state: READMEProject;
  setState: React.Dispatch<React.SetStateAction<READMEProject>>;
  updateProjectDetails: (details: Partial<READMEProject['metadata']>) => void;
  toggleSection: (id: string) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  resetState: (type?: 'project' | 'profile') => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const ReadmeContext = createContext<ReadmeContextType | undefined>(undefined);

export function ReadmeProvider({ children }: { children: ReactNode }) {
  // Temporary: we manage one project right now, later we map this to multi-projects
  const [state, setState] = useState<READMEProject>(() => {
    const saved = localStorage.getItem('readmeforge:current-project');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.sections) {
          return { ...defaultProject, ...parsed };
        }
      } catch (e) {
        console.error('Failed to parse saved state');
      }
    }
    return defaultProject;
  });

  const [history, setHistory] = useState<READMEProject[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  useEffect(() => {
    localStorage.setItem('readmeforge:current-project', JSON.stringify(state));
  }, [state]);

  const commitToHistory = (newState: READMEProject) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1)
      if (newHistory.length > 20) newHistory.shift() // Keep last 20 changes
      return [...newHistory, newState]
    })
    setHistoryIndex(prev => Math.min(19, prev + 1))
    setState(newState)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1)
      setState(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1)
      setState(history[historyIndex + 1])
    }
  }

  const updateProjectDetails = (details: Partial<READMEProject['metadata']>) => {
    const newState = {
      ...state,
      metadata: { ...state.metadata, ...details }
    }
    commitToHistory(newState)
  };

  const toggleSection = (id: string) => {
    const newState = {
      ...state,
      sections: state.sections.map(s => 
        s.id === id ? { ...s, enabled: !s.enabled } : s
      )
    }
    commitToHistory(newState)
  };

  const reorderSections = (startIndex: number, endIndex: number) => {
    const result = Array.from(state.sections);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    const newState = { ...state, sections: result }
    commitToHistory(newState)
  };

  const resetState = (type: 'project' | 'profile' = 'project') => {
    if (window.confirm('Are you sure you want to reset your workspace? This cannot be undone.')) {
      const newState = type === 'profile' ? defaultProfile : defaultProject
      commitToHistory(newState)
    }
  };

  return (
    <ReadmeContext.Provider value={{ 
      state, setState, updateProjectDetails, toggleSection, reorderSections, resetState,
      undo, redo, canUndo: historyIndex > 0, canRedo: historyIndex < history.length - 1
    }}>
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
