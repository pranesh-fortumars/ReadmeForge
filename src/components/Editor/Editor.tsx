import { Settings, AlertCircle, GripVertical } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import type { DropResult } from '@hello-pangea/dnd'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useReadme } from '../../hooks/useReadme'
import { calculateQualityScore } from '../../utils/qualityScore'

export default function Editor() {
  const { id } = useParams<{ id: string }>()
  const { state, updateProjectDetails, toggleSection, reorderSections, resetState } = useReadme()
  const quality = calculateQualityScore(state)

  useEffect(() => {
    if (id === 'profile' && state.projectType !== 'profile') {
      resetState('profile')
    } else if (id === 'new' && state.projectType !== 'project') {
      resetState('project')
    }
  }, [id])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderSections(result.source.index, result.destination.index);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0d1117]">
      <div className="h-12 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 bg-gray-50 dark:bg-[#010409]">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Configuration</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Quality:</span>
            <span className={`font-bold ${
              quality.score >= 80 ? 'text-green-500' : 
              quality.score >= 50 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {quality.score}/100
            </span>
          </div>
          <button 
            onClick={() => resetState()}
            className="text-xs text-red-500 hover:text-red-600 font-medium"
          >
            Reset
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Project Details */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Project Details</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
              <input
                type="text"
                className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-gray-100"
                value={state.metadata.name}
                onChange={(e) => updateProjectDetails({ name: e.target.value })}
                placeholder="READMEForge"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Short Description</label>
              <input
                type="text"
                className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-gray-100"
                value={state.metadata.description}
                onChange={(e) => updateProjectDetails({ description: e.target.value })}
                placeholder="A modern GitHub README generator..."
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
              <input
                type="text"
                className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-gray-100"
                value={state.metadata.githubUrl}
                onChange={(e) => updateProjectDetails({ githubUrl: e.target.value })}
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>
        </section>

        <hr className="border-gray-200 dark:border-gray-800" />

        {/* Enabled Sections with Drag and Drop */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Enabled Sections</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Drag to reorder sections in your README.</p>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections-list">
              {(provided) => (
                <div 
                  className="space-y-2"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {state.sections.map((section, index) => (
                    <Draggable key={section.id} draggableId={section.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center gap-3 p-2 rounded-md border ${
                            snapshot.isDragging 
                              ? 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800 shadow-md z-50' 
                              : 'bg-gray-50 border-transparent dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'
                          } transition-colors`}
                        >
                          <div 
                            {...provided.dragHandleProps}
                            className="cursor-grab hover:text-purple-500 text-gray-400"
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer flex-1">
                            <input 
                              type="checkbox"
                              checked={section.enabled}
                              onChange={() => toggleSection(section.id)}
                              className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300 select-none">{section.title}</span>
                          </label>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </section>
        
        {quality.errors.length > 0 && (
          <section className="mt-8 p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <h3 className="text-sm font-semibold text-red-900 dark:text-red-300">Linter Errors</h3>
            </div>
            <ul className="list-disc list-inside text-xs text-red-800 dark:text-red-400 space-y-1">
              {quality.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </section>
        )}

        {quality.recommendations.length > 0 && (
          <section className="mt-4 p-4 rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-900/10 dark:border-purple-900">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-300">Recommendations</h3>
            </div>
            <ul className="list-disc list-inside text-xs text-purple-800 dark:text-purple-400 space-y-1">
              {quality.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
