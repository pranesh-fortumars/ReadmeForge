import { useReadme } from '../../hooks/useReadme'
import { calculateQualityScore } from '../../utils/qualityScore'
import { Settings, AlertCircle } from 'lucide-react'

export default function Editor() {
  const { state, updateProjectDetails, toggleSection, resetState } = useReadme()
  const score = calculateQualityScore(state)

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      <div className="h-12 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 bg-gray-50 dark:bg-gray-900">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <Settings className="w-4 h-4" /> Configuration
        </h2>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Quality:</span>
            <span className={`font-bold ${score.score >= 80 ? 'text-green-500' : score.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
              {score.score}/100
            </span>
          </div>
          <button 
            onClick={resetState}
            className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 hover:underline"
          >
            Reset
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Project Details</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
              <input 
                type="text" 
                value={state.projectDetails.name}
                onChange={e => updateProjectDetails({ name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Short Description</label>
              <input 
                type="text" 
                value={state.projectDetails.description}
                onChange={e => updateProjectDetails({ description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
              <input 
                type="text" 
                placeholder="https://github.com/username/repo"
                value={state.projectDetails.githubUrl}
                onChange={e => updateProjectDetails({ githubUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Enabled Sections</h3>
          <div className="space-y-2">
            {state.sections.map(section => (
              <div key={section.id} className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id={`section-${section.id}`}
                  checked={section.enabled}
                  onChange={() => toggleSection(section.id)}
                  className="rounded text-purple-600 focus:ring-purple-500 bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700"
                />
                <label htmlFor={`section-${section.id}`} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                  {section.title}
                </label>
              </div>
            ))}
          </div>
        </div>

        {score.recommendations.length > 0 && (
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-300 flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4" /> Recommendations
            </h4>
            <ul className="text-xs text-purple-800 dark:text-purple-400 space-y-1 ml-4 list-disc">
              {score.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
