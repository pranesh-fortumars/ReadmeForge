import { Settings, AlertCircle, GripVertical } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import MarkdownEditor from '@uiw/react-markdown-editor'
import type { DropResult } from '@hello-pangea/dnd'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useReadme } from '../../hooks/useReadme'
import { calculateQualityScore } from '../../services/analyzer/qualityScore'
import { Plus, Trash2 } from 'lucide-react'

export default function Editor() {
  const { id } = useParams<{ id: string }>()
  const { 
    state, setState, updateProjectDetails, toggleSection, reorderSections, 
    resetState, activeSectionId, setActiveSection, undo, redo, canUndo, canRedo 
  } = useReadme()
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Long Description (Markdown)</label>
                  <div data-color-mode="light" className="dark:hidden">
                    <MarkdownEditor
                      value={state.metadata.longDescription || ''}
                      height="300px"
                      onChange={(value) => updateProjectDetails({ longDescription: value })}
                      className="rounded-md overflow-hidden border border-gray-300"
                    />
                  </div>
                  <div data-color-mode="dark" className="hidden dark:block">
                    <MarkdownEditor
                      value={state.metadata.longDescription || ''}
                      height="300px"
                      onChange={(value) => updateProjectDetails({ longDescription: value })}
                      className="rounded-md overflow-hidden border border-gray-700"
                    />
                  </div>
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
          ) : activeSectionId === 'badges' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Badges</h2>
                <button 
                  onClick={() => {
                    const newBadges = [...state.badges, { 
                      id: Date.now().toString(), 
                      label: '', 
                      url: '', 
                      imageUrl: 'https://img.shields.io/badge/label-message-blue?style=flat',
                      shieldParams: { label: 'label', message: 'message', color: 'blue', logo: '', style: 'flat' }
                    }]
                    setState({ ...state, badges: newBadges })
                  }}
                  className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  <Plus className="w-4 h-4" /> Add Badge
                </button>
              </div>
              <div className="space-y-4">
                {state.badges?.map((badge, idx) => (
                  <div key={badge.id} className="p-4 bg-gray-50 dark:bg-[#010409] border border-gray-200 dark:border-gray-800 rounded-lg flex gap-4">
                    <div className="flex-1 space-y-3">
                      {badge.shieldParams ? (
                        <>
                          <div className="flex gap-2">
                            <input 
                              type="text" value={badge.shieldParams.label} onChange={(e) => {
                                const newBadges = [...state.badges]; 
                                newBadges[idx].shieldParams!.label = e.target.value;
                                newBadges[idx].label = e.target.value;
                                const p = newBadges[idx].shieldParams!;
                                newBadges[idx].imageUrl = `https://img.shields.io/badge/${encodeURIComponent(p.label)}-${encodeURIComponent(p.message)}-${p.color}?style=${p.style}${p.logo ? '&logo=' + p.logo : ''}`;
                                setState({ ...state, badges: newBadges });
                              }}
                              placeholder="Label (e.g. build)" className="flex-1 bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm outline-none"
                            />
                            <input 
                              type="text" value={badge.shieldParams.message} onChange={(e) => {
                                const newBadges = [...state.badges]; 
                                newBadges[idx].shieldParams!.message = e.target.value;
                                const p = newBadges[idx].shieldParams!;
                                newBadges[idx].imageUrl = `https://img.shields.io/badge/${encodeURIComponent(p.label)}-${encodeURIComponent(p.message)}-${p.color}?style=${p.style}${p.logo ? '&logo=' + p.logo : ''}`;
                                setState({ ...state, badges: newBadges });
                              }}
                              placeholder="Message (e.g. passing)" className="flex-1 bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm outline-none"
                            />
                            <select 
                              value={badge.shieldParams.color} onChange={(e) => {
                                const newBadges = [...state.badges]; 
                                newBadges[idx].shieldParams!.color = e.target.value;
                                const p = newBadges[idx].shieldParams!;
                                newBadges[idx].imageUrl = `https://img.shields.io/badge/${encodeURIComponent(p.label)}-${encodeURIComponent(p.message)}-${p.color}?style=${p.style}${p.logo ? '&logo=' + p.logo : ''}`;
                                setState({ ...state, badges: newBadges });
                              }}
                              className="w-32 bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm outline-none"
                            >
                              <option value="brightgreen">Bright Green</option>
                              <option value="green">Green</option>
                              <option value="yellowgreen">Yellow Green</option>
                              <option value="yellow">Yellow</option>
                              <option value="orange">Orange</option>
                              <option value="red">Red</option>
                              <option value="blue">Blue</option>
                              <option value="lightgrey">Light Grey</option>
                              <option value="success">Success</option>
                              <option value="important">Important</option>
                              <option value="critical">Critical</option>
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <input 
                              type="text" value={badge.shieldParams.logo} onChange={(e) => {
                                const newBadges = [...state.badges]; 
                                newBadges[idx].shieldParams!.logo = e.target.value;
                                const p = newBadges[idx].shieldParams!;
                                newBadges[idx].imageUrl = `https://img.shields.io/badge/${encodeURIComponent(p.label)}-${encodeURIComponent(p.message)}-${p.color}?style=${p.style}${p.logo ? '&logo=' + p.logo : ''}`;
                                setState({ ...state, badges: newBadges });
                              }}
                              placeholder="Logo (e.g. react)" className="flex-1 bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm outline-none"
                            />
                            <select 
                              value={badge.shieldParams.style} onChange={(e) => {
                                const newBadges = [...state.badges]; 
                                newBadges[idx].shieldParams!.style = e.target.value;
                                const p = newBadges[idx].shieldParams!;
                                newBadges[idx].imageUrl = `https://img.shields.io/badge/${encodeURIComponent(p.label)}-${encodeURIComponent(p.message)}-${p.color}?style=${p.style}${p.logo ? '&logo=' + p.logo : ''}`;
                                setState({ ...state, badges: newBadges });
                              }}
                              className="w-32 bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm outline-none"
                            >
                              <option value="flat">Flat</option>
                              <option value="flat-square">Flat Square</option>
                              <option value="plastic">Plastic</option>
                              <option value="for-the-badge">For The Badge</option>
                              <option value="social">Social</option>
                            </select>
                          </div>
                          <input 
                            type="text" value={badge.url} onChange={(e) => {
                              const newBadges = [...state.badges]; newBadges[idx].url = e.target.value; setState({ ...state, badges: newBadges });
                            }}
                            placeholder="Link URL (optional, e.g. https://github.com/...)" className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm outline-none"
                          />
                        </>
                      ) : (
                        <>
                          <div className="flex gap-2">
                            <input 
                              type="text" value={badge.label} onChange={(e) => {
                                const newBadges = [...state.badges]; newBadges[idx].label = e.target.value; setState({ ...state, badges: newBadges });
                              }}
                              placeholder="Alt text (e.g. build status)" className="flex-1 bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm outline-none"
                            />
                            <input 
                              type="text" value={badge.imageUrl} onChange={(e) => {
                                const newBadges = [...state.badges]; newBadges[idx].imageUrl = e.target.value; setState({ ...state, badges: newBadges });
                              }}
                              placeholder="Image URL (e.g. https://img.shields.io/...)" className="flex-2 bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm outline-none w-full"
                            />
                          </div>
                          <input 
                            type="text" value={badge.url} onChange={(e) => {
                              const newBadges = [...state.badges]; newBadges[idx].url = e.target.value; setState({ ...state, badges: newBadges });
                            }}
                            placeholder="Link URL (optional, e.g. https://github.com/...)" className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm outline-none"
                          />
                        </>
                      )}
                    </div>
                    <button onClick={() => setState({ ...state, badges: state.badges.filter(b => b.id !== badge.id) })} className="text-gray-400 hover:text-red-500 self-start"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSectionId === 'tech-stack' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tech Stack</h2>
                <button 
                  onClick={() => {
                    const newTech = [...state.technologies, { id: Date.now().toString(), name: '', category: 'Frontend' }]
                    setState({ ...state, technologies: newTech })
                  }}
                  className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  <Plus className="w-4 h-4" /> Add Technology
                </button>
              </div>
              <div className="space-y-4">
                {state.technologies?.map((tech, idx) => (
                  <div key={tech.id} className="p-4 bg-gray-50 dark:bg-[#010409] border border-gray-200 dark:border-gray-800 rounded-lg flex gap-4">
                    <div className="flex-1 flex gap-2">
                      <input 
                        type="text" value={tech.name} onChange={(e) => {
                          const newTech = [...state.technologies]; newTech[idx].name = e.target.value; setState({ ...state, technologies: newTech });
                        }}
                        placeholder="Name (e.g. React)" className="flex-1 bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm outline-none"
                      />
                      <select
                        value={tech.category} onChange={(e) => {
                          const newTech = [...state.technologies]; newTech[idx].category = e.target.value; setState({ ...state, technologies: newTech });
                        }}
                        className="bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm outline-none"
                      >
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Database">Database</option>
                        <option value="Tooling">Tooling</option>
                        <option value="Language">Language</option>
                      </select>
                    </div>
                    <button onClick={() => setState({ ...state, technologies: state.technologies.filter(t => t.id !== tech.id) })} className="text-gray-400 hover:text-red-500 self-center"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSectionId === 'installation' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Installation Methods</h2>
                <button 
                  onClick={() => {
                    const newMethods = [...(state.installation?.methods || []), { id: Date.now().toString(), name: '', command: '' }]
                    setState({ ...state, installation: { methods: newMethods } })
                  }}
                  className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  <Plus className="w-4 h-4" /> Add Method
                </button>
              </div>
              <div className="space-y-4">
                {state.installation?.methods?.map((method, idx) => (
                  <div key={method.id} className="p-4 bg-gray-50 dark:bg-[#010409] border border-gray-200 dark:border-gray-800 rounded-lg flex gap-4">
                    <div className="flex-1 space-y-3">
                      <input 
                        type="text" value={method.name} onChange={(e) => {
                          const newMethods = [...state.installation.methods]; newMethods[idx].name = e.target.value; setState({ ...state, installation: { methods: newMethods } });
                        }}
                        placeholder="Method Name (e.g. npm)" className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm outline-none"
                      />
                      <input 
                        type="text" value={method.command} onChange={(e) => {
                          const newMethods = [...state.installation.methods]; newMethods[idx].command = e.target.value; setState({ ...state, installation: { methods: newMethods } });
                        }}
                        placeholder="Command (e.g. npm install)" className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm font-mono outline-none"
                      />
                    </div>
                    <button onClick={() => setState({ ...state, installation: { methods: state.installation.methods.filter(m => m.id !== method.id) } })} className="text-gray-400 hover:text-red-500 self-start"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSectionId === 'usage' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Usage Commands</h2>
                <button 
                  onClick={() => {
                    const newCmds = [...(state.usage?.commands || []), { id: Date.now().toString(), description: '', command: '' }]
                    setState({ ...state, usage: { commands: newCmds } })
                  }}
                  className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  <Plus className="w-4 h-4" /> Add Command
                </button>
              </div>
              <div className="space-y-4">
                {state.usage?.commands?.map((cmd, idx) => (
                  <div key={cmd.id} className="p-4 bg-gray-50 dark:bg-[#010409] border border-gray-200 dark:border-gray-800 rounded-lg flex gap-4">
                    <div className="flex-1 space-y-3">
                      <input 
                        type="text" value={cmd.description} onChange={(e) => {
                          const newCmds = [...state.usage.commands]; newCmds[idx].description = e.target.value; setState({ ...state, usage: { commands: newCmds } });
                        }}
                        placeholder="Description (e.g. Run development server)" className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm outline-none"
                      />
                      <input 
                        type="text" value={cmd.command} onChange={(e) => {
                          const newCmds = [...state.usage.commands]; newCmds[idx].command = e.target.value; setState({ ...state, usage: { commands: newCmds } });
                        }}
                        placeholder="Command (e.g. npm run dev)" className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm font-mono outline-none"
                      />
                    </div>
                    <button onClick={() => setState({ ...state, usage: { commands: state.usage.commands.filter(c => c.id !== cmd.id) } })} className="text-gray-400 hover:text-red-500 self-start"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSectionId === 'features' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Features</h2>
                <button 
                  onClick={() => {
                    const newFeatures = [...(state.features || []), { id: Date.now().toString(), title: '', description: '' }]
                    setState({ ...state, features: newFeatures })
                  }}
                  className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  <Plus className="w-4 h-4" /> Add Feature
                </button>
              </div>
              <div className="space-y-4">
                {state.features?.map((feature, idx) => (
                  <div key={feature.id} className="p-4 bg-gray-50 dark:bg-[#010409] border border-gray-200 dark:border-gray-800 rounded-lg flex gap-4">
                    <div className="flex-1 space-y-3">
                      <input 
                        type="text" value={feature.title} onChange={(e) => {
                          const newFeatures = [...state.features]; newFeatures[idx].title = e.target.value; setState({ ...state, features: newFeatures });
                        }}
                        placeholder="Feature Title" className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm outline-none"
                      />
                      <input 
                        type="text" value={feature.description || ''} onChange={(e) => {
                          const newFeatures = [...state.features]; newFeatures[idx].description = e.target.value; setState({ ...state, features: newFeatures });
                        }}
                        placeholder="Feature Description (optional)" className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm outline-none"
                      />
                    </div>
                    <button onClick={() => setState({ ...state, features: state.features.filter(f => f.id !== feature.id) })} className="text-gray-400 hover:text-red-500 self-start"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSectionId === 'screenshots' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Screenshots</h2>
                <button 
                  onClick={() => {
                    const newScreenshots = [...(state.screenshots || []), { id: Date.now().toString(), url: '', altText: '', caption: '' }]
                    setState({ ...state, screenshots: newScreenshots })
                  }}
                  className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  <Plus className="w-4 h-4" /> Add Screenshot
                </button>
              </div>
              <div className="space-y-4">
                {state.screenshots?.map((screenshot, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-[#010409] border border-gray-200 dark:border-gray-800 rounded-lg flex gap-4">
                    <div className="flex-1 space-y-3">
                      <input 
                        type="text" value={screenshot.url} onChange={(e) => {
                          const newScreenshots = [...state.screenshots]; newScreenshots[idx].url = e.target.value; setState({ ...state, screenshots: newScreenshots });
                        }}
                        placeholder="Image URL" className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm outline-none"
                      />
                      <div className="flex gap-2">
                        <input 
                          type="text" value={screenshot.altText} onChange={(e) => {
                            const newScreenshots = [...state.screenshots]; newScreenshots[idx].altText = e.target.value; setState({ ...state, screenshots: newScreenshots });
                          }}
                          placeholder="Alt Text" className="flex-1 bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm outline-none"
                        />
                        <input 
                          type="text" value={screenshot.caption || ''} onChange={(e) => {
                            const newScreenshots = [...state.screenshots]; newScreenshots[idx].caption = e.target.value; setState({ ...state, screenshots: newScreenshots });
                          }}
                          placeholder="Caption (optional)" className="flex-1 bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm outline-none"
                        />
                      </div>
                    </div>
                    <button onClick={() => setState({ ...state, screenshots: state.screenshots.filter((_, i) => i !== idx) })} className="text-gray-400 hover:text-red-500 self-start"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSectionId === 'project-structure' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Structure</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Provide a tree view of your repository's layout.</p>
              <textarea
                value={state.projectStructure || ''}
                onChange={(e) => setState({ ...state, projectStructure: e.target.value })}
                placeholder={`src/\n├── components/\n└── App.tsx`}
                className="w-full h-64 p-4 font-mono text-sm bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
              />
            </div>
          ) : activeSectionId === 'contributing' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contributing Guidelines</h2>
              <div data-color-mode="light" className="dark:hidden">
                <MarkdownEditor
                  value={state.contributing?.instructions || ''}
                  height="400px"
                  onChange={(value) => setState({ ...state, contributing: { instructions: value } })}
                  className="rounded-md overflow-hidden border border-gray-300"
                />
              </div>
              <div data-color-mode="dark" className="hidden dark:block">
                <MarkdownEditor
                  value={state.contributing?.instructions || ''}
                  height="400px"
                  onChange={(value) => setState({ ...state, contributing: { instructions: value } })}
                  className="rounded-md overflow-hidden border border-gray-700"
                />
              </div>
            </div>
          ) : activeSectionId === 'license' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">License</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Open Source License</label>
                <select
                  value={state.metadata.license || 'MIT'}
                  onChange={(e) => updateProjectDetails({ license: e.target.value })}
                  className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="MIT">MIT License</option>
                  <option value="Apache-2.0">Apache License 2.0</option>
                  <option value="GPL-3.0">GNU General Public License v3.0</option>
                  <option value="BSD-3-Clause">BSD 3-Clause "New" or "Revised" License</option>
                  <option value="ISC">ISC License</option>
                  <option value="Unlicense">The Unlicense</option>
                </select>
              </div>
            </div>
          ) : activeSectionId === 'author' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Author Information</h2>
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author Name</label>
                  <input
                    type="text"
                    className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    value={state.metadata.authorName || ''}
                    onChange={(e) => updateProjectDetails({ authorName: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author Website</label>
                  <input
                    type="text"
                    className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    value={state.metadata.authorUrl || ''}
                    onChange={(e) => updateProjectDetails({ authorUrl: e.target.value })}
                    placeholder="https://johndoe.com"
                  />
                </div>
              </div>
            </div>
          ) : activeSectionId === 'demo' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Demo Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Live Demo URL</label>
                  <input type="text" value={state.demo?.liveUrl || ''} onChange={e => setState({ ...state, demo: { ...state.demo, liveUrl: e.target.value } })} className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2" placeholder="https://example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Video URL (e.g., YouTube)</label>
                  <input type="text" value={state.demo?.videoUrl || ''} onChange={e => setState({ ...state, demo: { ...state.demo, videoUrl: e.target.value } })} className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2" placeholder="https://youtube.com/watch?v=..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Demo Instructions</label>
                  <textarea value={state.demo?.instructions || ''} onChange={e => setState({ ...state, demo: { ...state.demo, instructions: e.target.value } })} className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 h-24 font-mono text-sm" placeholder="Sign in with demo@example.com / password" />
                </div>
              </div>
            </div>
          ) : activeSectionId === 'env-vars' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Environment Variables</h2>
                <button onClick={() => setState({ ...state, environmentVariables: [...state.environmentVariables, { name: '', description: '', required: false, default: '' }] })} className="flex items-center gap-1 text-sm font-medium text-purple-600">
                  <Plus className="w-4 h-4" /> Add Variable
                </button>
              </div>
              <div className="space-y-4">
                {state.environmentVariables?.map((env, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-[#010409] border border-gray-200 dark:border-gray-800 rounded-lg flex gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-2 items-center">
                        <input type="text" value={env.name} onChange={e => { const newEnv = [...state.environmentVariables]; newEnv[idx].name = e.target.value; setState({ ...state, environmentVariables: newEnv }) }} placeholder="API_KEY" className="flex-1 bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5" />
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <input type="checkbox" checked={env.required} onChange={e => { const newEnv = [...state.environmentVariables]; newEnv[idx].required = e.target.checked; setState({ ...state, environmentVariables: newEnv }) }} className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" /> Required
                        </label>
                      </div>
                      <input type="text" value={env.description} onChange={e => { const newEnv = [...state.environmentVariables]; newEnv[idx].description = e.target.value; setState({ ...state, environmentVariables: newEnv }) }} placeholder="Description" className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5" />
                    </div>
                    <button onClick={() => setState({ ...state, environmentVariables: state.environmentVariables.filter((_, i) => i !== idx) })} className="text-gray-400 hover:text-red-500 self-start"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSectionId === 'deployment' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Deployment Instructions</h2>
              <textarea
                className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-lg p-4 h-64 font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                value={state.deployment?.instructions || ''}
                onChange={(e) => setState({ ...state, deployment: { instructions: e.target.value } })}
                placeholder="Deployment steps..."
                spellCheck={false}
              />
            </div>
          ) : activeSectionId === 'stats' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">GitHub Stats Settings</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" checked={state.settings?.showGithubStats || false} onChange={e => setState({ ...state, settings: { ...state.settings, showGithubStats: e.target.checked } })} className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  Show GitHub Stats (Requires GitHub URL in Metadata)
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" checked={state.settings?.showTopLangs || false} onChange={e => setState({ ...state, settings: { ...state.settings, showTopLangs: e.target.checked } })} className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  Show Top Languages
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme</label>
                  <select value={state.settings?.theme || 'radical'} onChange={e => setState({ ...state, settings: { ...state.settings, theme: e.target.value } })} className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2">
                    <option value="radical">Radical</option>
                    <option value="tokyonight">Tokyo Night</option>
                    <option value="dracula">Dracula</option>
                    <option value="github_dark">GitHub Dark</option>
                  </select>
                </div>
              </div>
            </div>
          ) : activeSectionId === 'api' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">API Reference</h2>
                <button onClick={() => setState({ ...state, api: { ...state.api, endpoints: [...(state.api?.endpoints || []), { id: Date.now().toString(), method: 'GET', path: '', description: '', parameters: '', request: '', response: '' }] } })} className="flex items-center gap-1 text-sm font-medium text-purple-600">
                  <Plus className="w-4 h-4" /> Add Endpoint
                </button>
              </div>
              <div className="space-y-4">
                {state.api?.endpoints?.map((endpoint, idx) => (
                  <div key={endpoint.id} className="p-4 bg-gray-50 dark:bg-[#010409] border border-gray-200 dark:border-gray-800 rounded-lg flex gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-2">
                        <select value={endpoint.method} onChange={e => { const newEndpoints = [...state.api.endpoints]; newEndpoints[idx].method = e.target.value; setState({ ...state, api: { endpoints: newEndpoints } }) }} className="bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 font-mono">
                          <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option><option>PATCH</option>
                        </select>
                        <input type="text" value={endpoint.path} onChange={e => { const newEndpoints = [...state.api.endpoints]; newEndpoints[idx].path = e.target.value; setState({ ...state, api: { endpoints: newEndpoints } }) }} placeholder="/api/users" className="flex-1 bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 font-mono" />
                      </div>
                      <input type="text" value={endpoint.description} onChange={e => { const newEndpoints = [...state.api.endpoints]; newEndpoints[idx].description = e.target.value; setState({ ...state, api: { endpoints: newEndpoints } }) }} placeholder="Description" className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5" />
                      <textarea value={endpoint.parameters} onChange={e => { const newEndpoints = [...state.api.endpoints]; newEndpoints[idx].parameters = e.target.value; setState({ ...state, api: { endpoints: newEndpoints } }) }} placeholder="Parameters (JSON)" className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 h-20 font-mono text-sm" />
                      <textarea value={endpoint.response} onChange={e => { const newEndpoints = [...state.api.endpoints]; newEndpoints[idx].response = e.target.value; setState({ ...state, api: { endpoints: newEndpoints } }) }} placeholder="Response (JSON)" className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 h-20 font-mono text-sm" />
                    </div>
                    <button onClick={() => setState({ ...state, api: { endpoints: state.api.endpoints.filter(e => e.id !== endpoint.id) } })} className="text-gray-400 hover:text-red-500 self-start"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSectionId === 'roadmap' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Roadmap</h2>
                <button onClick={() => setState({ ...state, roadmap: [...(state.roadmap || []), { id: Date.now().toString(), title: '', completed: false }] })} className="flex items-center gap-1 text-sm font-medium text-purple-600">
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>
              <div className="space-y-4">
                {state.roadmap?.map((item, idx) => (
                  <div key={item.id} className="p-4 bg-gray-50 dark:bg-[#010409] border border-gray-200 dark:border-gray-800 rounded-lg flex gap-4 items-center">
                    <input type="checkbox" checked={item.completed} onChange={e => { const newRoadmap = [...state.roadmap]; newRoadmap[idx].completed = e.target.checked; setState({ ...state, roadmap: newRoadmap }) }} className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-5 h-5" />
                    <input type="text" value={item.title} onChange={e => { const newRoadmap = [...state.roadmap]; newRoadmap[idx].title = e.target.value; setState({ ...state, roadmap: newRoadmap }) }} placeholder="Feature description" className="flex-1 bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5" />
                    <button onClick={() => setState({ ...state, roadmap: state.roadmap.filter(i => i.id !== item.id) })} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSectionId === 'faq' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">FAQ</h2>
                <button onClick={() => setState({ ...state, faq: [...(state.faq || []), { id: Date.now().toString(), question: '', answer: '' }] })} className="flex items-center gap-1 text-sm font-medium text-purple-600">
                  <Plus className="w-4 h-4" /> Add FAQ
                </button>
              </div>
              <div className="space-y-4">
                {state.faq?.map((item, idx) => (
                  <div key={item.id} className="p-4 bg-gray-50 dark:bg-[#010409] border border-gray-200 dark:border-gray-800 rounded-lg flex gap-4">
                    <div className="flex-1 space-y-3">
                      <input type="text" value={item.question} onChange={e => { const newFaq = [...state.faq]; newFaq[idx].question = e.target.value; setState({ ...state, faq: newFaq }) }} placeholder="Question" className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 font-medium" />
                      <textarea value={item.answer} onChange={e => { const newFaq = [...state.faq]; newFaq[idx].answer = e.target.value; setState({ ...state, faq: newFaq }) }} placeholder="Answer" className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 h-20" />
                    </div>
                    <button onClick={() => setState({ ...state, faq: state.faq.filter(i => i.id !== item.id) })} className="text-gray-400 hover:text-red-500 self-start"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSectionId === 'troubleshooting' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Troubleshooting</h2>
                <button onClick={() => setState({ ...state, troubleshooting: [...(state.troubleshooting || []), { id: Date.now().toString(), problem: '', solution: '' }] })} className="flex items-center gap-1 text-sm font-medium text-purple-600">
                  <Plus className="w-4 h-4" /> Add Issue
                </button>
              </div>
              <div className="space-y-4">
                {state.troubleshooting?.map((item, idx) => (
                  <div key={item.id} className="p-4 bg-gray-50 dark:bg-[#010409] border border-gray-200 dark:border-gray-800 rounded-lg flex gap-4">
                    <div className="flex-1 space-y-3">
                      <input type="text" value={item.problem} onChange={e => { const newTs = [...state.troubleshooting]; newTs[idx].problem = e.target.value; setState({ ...state, troubleshooting: newTs }) }} placeholder="Common Problem" className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 font-medium" />
                      <textarea value={item.solution} onChange={e => { const newTs = [...state.troubleshooting]; newTs[idx].solution = e.target.value; setState({ ...state, troubleshooting: newTs }) }} placeholder="Solution" className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 h-20" />
                    </div>
                    <button onClick={() => setState({ ...state, troubleshooting: state.troubleshooting.filter(i => i.id !== item.id) })} className="text-gray-400 hover:text-red-500 self-start"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSectionId === 'contact' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact Links</h2>
                <button onClick={() => setState({ ...state, contact: { ...state.contact, links: [...(state.contact?.links || []), { id: Date.now().toString(), name: '', url: '' }] } })} className="flex items-center gap-1 text-sm font-medium text-purple-600">
                  <Plus className="w-4 h-4" /> Add Link
                </button>
              </div>
              <div className="space-y-4">
                {state.contact?.links?.map((link, idx) => (
                  <div key={link.id} className="p-4 bg-gray-50 dark:bg-[#010409] border border-gray-200 dark:border-gray-800 rounded-lg flex gap-4 items-center">
                    <input type="text" value={link.name} onChange={e => { const newLinks = [...state.contact.links]; newLinks[idx].name = e.target.value; setState({ ...state, contact: { links: newLinks } }) }} placeholder="Platform (e.g. Twitter)" className="w-1/3 bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5" />
                    <input type="text" value={link.url} onChange={e => { const newLinks = [...state.contact.links]; newLinks[idx].url = e.target.value; setState({ ...state, contact: { links: newLinks } }) }} placeholder="URL" className="flex-1 bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5" />
                    <button onClick={() => setState({ ...state, contact: { links: state.contact.links.filter(l => l.id !== link.id) } })} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
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
