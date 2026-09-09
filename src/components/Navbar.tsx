import { GitBranch, Moon, Sun } from 'lucide-react'

interface NavbarProps {
  onThemeToggle: () => void;
  theme: 'dark' | 'light';
  onHomeClick: () => void;
}

export default function Navbar({ onThemeToggle, theme, onHomeClick }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={onHomeClick}>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight">READMEForge</span>
          </div>
      
          <div className="flex items-center gap-2 sm:gap-4">
            <a 
              href="https://github.com/pranesh-fortumars/ReadmeForge" 
              target="_blank" 
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 px-3 py-2 rounded-md transition-colors"
            >
              <GitBranch className="w-4 h-4" />
              <span>Star on GitHub</span>
            </a>
            
            <button 
              onClick={onThemeToggle}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
