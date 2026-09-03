import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, FileText, GitBranch, Shield, Command, LayoutTemplate, Star, X, FileClock } from 'lucide-react'

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  if (!isOpen) return null

  const actions = [
    { id: 'dashboard', name: 'Go to Dashboard', icon: LayoutTemplate, route: '/dashboard', keywords: 'home dashboard start' },
    { id: 'new-project', name: 'Create New Project', icon: FileText, route: '/editor/new', keywords: 'new project readme create' },
    { id: 'new-profile', name: 'Create Profile README', icon: Star, route: '/editor/profile', keywords: 'profile github user' },
    { id: 'import', name: 'Import Repository', icon: GitBranch, route: '/import', keywords: 'import github repo repository clone' },
    { id: 'badges', name: 'Badge Studio', icon: Shield, route: '/tools/badges', keywords: 'badge shield tools studio' },
    { id: 'playground', name: 'Markdown Playground', icon: Command, route: '/tools/playground', keywords: 'markdown playground test editor' },
    { id: 'changelog', name: 'Changelog Generator', icon: FileClock, route: '/tools/changelog', keywords: 'changelog release notes version history' },
  ]

  const filteredActions = actions.filter(action => 
    action.name.toLowerCase().includes(query.toLowerCase()) || 
    action.keywords.includes(query.toLowerCase())
  )

  const handleSelect = (route: string) => {
    navigate(route)
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />
      
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0d1117] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transform transition-all">
        <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            autoFocus
            type="text"
            className="w-full bg-transparent border-0 focus:ring-0 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto py-2">
          {filteredActions.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              No results found for "{query}"
            </div>
          ) : (
            <div className="px-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </div>
              {filteredActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleSelect(action.route)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors group"
                >
                  <action.icon className="w-5 h-5 text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium group-hover:text-purple-700 dark:group-hover:text-purple-300">
                    {action.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="px-4 py-3 bg-gray-50 dark:bg-[#010409] border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
          <span>Search documentation and tools</span>
          <div className="flex gap-2">
            <span><kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs shadow-sm">↑</kbd> <kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs shadow-sm">↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs shadow-sm">enter</kbd> to select</span>
          </div>
        </div>
      </div>
    </div>
  )
}
