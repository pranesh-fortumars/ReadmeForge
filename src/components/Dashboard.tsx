import { Plus, FileText, ArrowRight, LayoutTemplate, Star, GitBranch, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useReadme } from '../hooks/useReadme'
import { StorageManager } from '../services/storage/storageService'
import type { READMEProject } from '../types'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card'

export default function Dashboard() {
  const navigate = useNavigate()
  const { loadProject } = useReadme()
  const [projects, setProjects] = useState<READMEProject[]>([])

  useEffect(() => {
    setProjects(StorageManager.getProjects())
  }, [])

  const handleLoadProject = (project: READMEProject) => {
    loadProject(project)
    navigate('/editor/default')
  }

  const handleDeleteProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    StorageManager.deleteProject(id)
    setProjects(StorageManager.getProjects())
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to READMEForge</h1>
            <p className="text-gray-600 dark:text-gray-400">Create documentation that makes your repository easier to understand.</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/editor/new')} className="gap-2">
              <Plus className="w-5 h-5" />
              Create README
            </Button>
            <Button onClick={() => navigate('/import')} variant="outline" className="gap-2">
              <GitBranch className="w-5 h-5" />
              Import Repository
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Projects</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {projects.map((project) => (
                  <Card 
                    key={project.id}
                    onClick={() => handleLoadProject(project)}
                    className="hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between h-40 group"
                  >
                    <CardHeader className="pb-2 pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg truncate max-w-[150px]" title={project.metadata.name || 'Untitled Project'}>
                            {project.metadata.name || 'Untitled Project'}
                          </CardTitle>
                          <CardDescription className="mt-1 capitalize">{project.projectType || 'Project'}</CardDescription>
                        </div>
                        <button 
                          onClick={(e) => handleDeleteProject(e, project.id)}
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {project.sections.filter(s => s.enabled).length} sections enabled
                        </span>
                        <span className="text-sm text-purple-600 dark:text-purple-400 font-medium hover:underline flex items-center gap-1">
                          Open <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Empty Create Card */}
                <div 
                  onClick={() => navigate('/editor/new')}
                  className="p-5 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-gray-900 transition-colors cursor-pointer flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 h-40"
                >
                  <Plus className="w-8 h-8 mb-2 text-gray-400" />
                  <span className="font-medium">New Project</span>
                </div>
                
                {/* Profile README Card */}
                <div 
                  onClick={() => navigate('/editor/profile')}
                  className="p-5 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-900 transition-colors cursor-pointer flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 h-40"
                >
                  <Star className="w-8 h-8 mb-2 text-gray-400" />
                  <span className="font-medium">New Profile</span>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Tools</h2>
              <div className="space-y-3">
                <button className="w-full p-4 bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 rounded-lg flex items-center gap-4 hover:border-purple-500 transition-colors text-left group">
                  <div className="w-10 h-10 rounded-md bg-purple-100 dark:bg-gray-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <LayoutTemplate className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Templates</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Browse starter layouts</p>
                  </div>
                </button>
                <button 
                  onClick={() => navigate('/tools/badges')}
                  className="w-full p-4 bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 rounded-lg flex items-center gap-4 hover:border-blue-500 transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-md bg-blue-100 dark:bg-gray-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Badge Studio</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Generate custom badges</p>
                  </div>
                </button>
                <button 
                  onClick={() => navigate('/tools/playground')}
                  className="w-full p-4 bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 rounded-lg flex items-center gap-4 hover:border-orange-500 transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-md bg-orange-100 dark:bg-gray-800 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Markdown Playground</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Test markdown syntax</p>
                  </div>
                </button>
                <button 
                  onClick={() => navigate('/tools/changelog')}
                  className="w-full p-4 bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 rounded-lg flex items-center gap-4 hover:border-emerald-500 transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-md bg-emerald-100 dark:bg-gray-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Changelog Gen</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Create release notes</p>
                  </div>
                </button>
              </div>
            </section>
          </div>
          
        </div>
      </div>
    </div>
  )
}
