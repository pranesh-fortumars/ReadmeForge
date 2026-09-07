import { create } from 'zustand';
import type { READMEProject, Section } from '../types';
import { StorageManager } from '../services/storage/storageService';

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

interface ReadmeStore {
  state: READMEProject;
  activeSectionId: string | null;
  history: READMEProject[];
  historyIndex: number;
  
  // Actions
  setState: (newState: READMEProject | ((prev: READMEProject) => READMEProject)) => void;
  setActiveSection: (id: string | null) => void;
  updateProjectDetails: (details: Partial<READMEProject['metadata']>) => void;
  toggleSection: (id: string) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  resetState: (type?: 'project' | 'profile') => void;
  loadProject: (project: READMEProject) => void;
  
  // History Actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const getInitialState = (): READMEProject => {
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
};

export const useReadme = create<ReadmeStore>((set, get) => ({
  state: getInitialState(),
  activeSectionId: 'project-details',
  history: [],
  historyIndex: -1,

  setState: (newStateOrUpdater) => {
    set((store) => {
      const newState = typeof newStateOrUpdater === 'function' ? newStateOrUpdater(store.state) : newStateOrUpdater;
      
      // Update history
      const newHistory = store.history.slice(0, store.historyIndex + 1);
      if (newHistory.length > 20) newHistory.shift();
      newHistory.push(newState);
      
      // Save to persistence layer
      localStorage.setItem('readmeforge:current-project', JSON.stringify(newState));
      StorageManager.saveProject(newState);
      
      return {
        state: newState,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  },

  setActiveSection: (id) => set({ activeSectionId: id }),

  updateProjectDetails: (details) => {
    get().setState((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, ...details }
    }));
  },

  toggleSection: (id) => {
    get().setState((prev) => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === id ? { ...section, enabled: !section.enabled } : section
      )
    }));
  },

  reorderSections: (startIndex, endIndex) => {
    get().setState((prev) => {
      const newSections = Array.from(prev.sections);
      const [reorderedItem] = newSections.splice(startIndex, 1);
      newSections.splice(endIndex, 0, reorderedItem);
      return { ...prev, sections: newSections };
    });
  },

  resetState: (type = 'project') => {
    get().setState(type === 'profile' ? { ...defaultProfile, id: 'profile-' + Date.now() } : { ...defaultProject, id: 'project-' + Date.now() });
  },

  loadProject: (project) => {
    // We overwrite state and clear history when loading a new project
    localStorage.setItem('readmeforge:current-project', JSON.stringify(project));
    set({
      state: project,
      history: [],
      historyIndex: -1
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const prevState = history[newIndex];
      localStorage.setItem('readmeforge:current-project', JSON.stringify(prevState));
      set({ state: prevState, historyIndex: newIndex });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      localStorage.setItem('readmeforge:current-project', JSON.stringify(nextState));
      set({ state: nextState, historyIndex: newIndex });
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1
}));
