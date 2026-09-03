import { Settings, AlertCircle, GripVertical } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import type { DropResult } from '@hello-pangea/dnd'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useReadme } from '../../hooks/useReadme'
import { calculateQualityScore } from '../../services/analyzer/qualityScore'
import { Plus, Trash2 } from 'lucide-react'

export default function Editor() {
  const { id } = useParams<{ id: string }>()
  const { state, updateProjectDetails, toggleSection, reorderSections, resetState, undo, redo, canUndo, canRedo } = useReadme()
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
          <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-800 pr-4 mr-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="px-2 py-1 text-xs font-medium rounded text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"
              title="Undo"
            >
              Undo
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="px-2 py-1 text-xs font-medium rounded text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"
              title="Redo"
            >
              Redo
            </button>
          </div>
          <button 
            onClick={() => resetState()}
            className="text-xs text-red-500 hover:text-red-600 font-medium"
          >
            Reset
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Sections Manager */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0d1117] overflow-y-auto p-4 flex flex-col gap-6">
          
          <button 
            onClick={() => setActiveSection('project-details')}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              activeSectionId === 'project-details' 
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            ⚙️ Project Details
          </button>

          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Document Sections</h2>
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections-list">
                {(provided) => (
                  <div className="space-y-1" {...provided.droppableProps} ref={provided.innerRef}>
                    {state.sections.map((section, index) => (
                      <Draggable key={section.id} draggableId={section.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center gap-2 p-2 rounded-md ${
                              snapshot.isDragging 
                                ? 'bg-purple-50 border border-purple-200 dark:bg-purple-900/20 dark:border-purple-800 shadow-sm z-50' 
                                : activeSectionId === section.id
                                ? 'bg-purple-100 dark:bg-purple-900/30'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                            } transition-colors cursor-pointer group`}
                            onClick={() => setActiveSection(section.id)}
                          >
                            <div {...provided.dragHandleProps} className="cursor-grab hover:text-purple-500 text-gray-400">
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer flex-1" onClick={e => e.stopPropagation()}>
                              <input 
                                type="checkbox"
                                checked={section.enabled}
                                onChange={() => toggleSection(section.id)}
                                className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700"
                              />
                              <span className={`text-sm select-none ${
                                activeSectionId === section.id 
                                  ? 'text-purple-700 dark:text-purple-300 font-medium' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>{section.title}</span>
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
            <section className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <h3 className="text-sm font-semibold text-red-900 dark:text-red-300">Errors</h3>
              </div>
              <ul className="list-disc list-inside text-xs text-red-800 dark:text-red-400 space-y-1">
                {quality.errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </section>
          )}

        </div>

        {/* Right Area: Active Editor Pane */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-[#0d1117] p-6">
          {activeSectionId === 'project-details' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Details</h2>
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
                  <input
                    type="text"
                    className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    value={state.metadata.name}
                    onChange={(e) => updateProjectDetails({ name: e.target.value })}
                    placeholder="READMEForge"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Description</label>
                  <input
                    type="text"
                    className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    value={state.metadata.description}
                    onChange={(e) => updateProjectDetails({ description: e.target.value })}
                    placeholder="A modern GitHub README generator..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    value={state.metadata.githubUrl}
                    onChange={(e) => updateProjectDetails({ githubUrl: e.target.value })}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>
            </div>
          ) : activeSectionId === 'env-vars' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Environment Variables</h2>
                <button 
                  onClick={() => {
                    const newVars = [...state.environmentVariables, { name: '', description: '', required: false, default: '' }]
                    setState({ ...state, environmentVariables: newVars })
                  }}
                  className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  <Plus className="w-4 h-4" /> Add Variable
                </button>
              </div>
              
              <div className="space-y-4">
                {state.environmentVariables?.map((env, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-[#010409] border border-gray-200 dark:border-gray-800 rounded-lg flex gap-4">
                    <div className="flex-1 space-y-3">
                      <input 
                        type="text" 
                        value={env.name}
                        onChange={(e) => {
                          const newVars = [...state.environmentVariables]
                          newVars[idx].name = e.target.value
                          setState({ ...state, environmentVariables: newVars })
                        }}
                        placeholder="VARIABLE_NAME" 
                        className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm font-mono focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                      <input 
                        type="text" 
                        value={env.description}
                        onChange={(e) => {
                          const newVars = [...state.environmentVariables]
                          newVars[idx].description = e.target.value
                          setState({ ...state, environmentVariables: newVars })
                        }}
                        placeholder="Description" 
                        className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <input 
                            type="checkbox" 
                            checked={env.required}
                            onChange={(e) => {
                              const newVars = [...state.environmentVariables]
                              newVars[idx].required = e.target.checked
                              setState({ ...state, environmentVariables: newVars })
                            }}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" 
                          /> Required
                        </label>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const newVars = state.environmentVariables.filter((_, i) => i !== idx)
                        setState({ ...state, environmentVariables: newVars })
                      }}
                      className="text-gray-400 hover:text-red-500 self-start"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {(!state.environmentVariables || state.environmentVariables.length === 0) && (
                  <p className="text-center text-gray-500 py-8">No environment variables defined.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Editor for section "{state.sections.find(s => s.id === activeSectionId)?.title}" coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
