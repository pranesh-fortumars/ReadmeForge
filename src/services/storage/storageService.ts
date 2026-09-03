import type { READMEProject } from '../../types';

const STORAGE_KEY = 'readmeforge:projects';
const CURRENT_PROJECT_KEY = 'readmeforge:current-project';

export class StorageManager {
  
  static getProjects(): READMEProject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load projects from storage', e);
      return [];
    }
  }

  static saveProject(project: READMEProject): void {
    const projects = this.getProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.push(project);
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save project', e);
    }
  }

  static deleteProject(id: string): void {
    const projects = this.getProjects().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }

  static migrateLegacyData(): void {
    try {
      // Check if we have the old format but no new format
      const legacyData = localStorage.getItem(CURRENT_PROJECT_KEY);
      const existingProjects = localStorage.getItem(STORAGE_KEY);

      if (legacyData && !existingProjects) {
        const parsedLegacy = JSON.parse(legacyData);
        if (parsedLegacy && typeof parsedLegacy === 'object') {
          // Ensure it has an id
          if (!parsedLegacy.id) parsedLegacy.id = 'legacy-project-' + Date.now();
          if (!parsedLegacy.metadata?.name) parsedLegacy.metadata.name = 'Migrated Project';
          
          this.saveProject(parsedLegacy as READMEProject);
          console.log('Successfully migrated legacy project to new storage format.');
        }
      }
    } catch (e) {
      console.error('Failed to migrate legacy data', e);
    }
  }
}
