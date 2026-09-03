import { GitBranch, Moon, Sun } from 'lucide-react'

interface NavbarProps {
  onThemeToggle: () => void;
  theme: 'dark' | 'light';
  onHomeClick: () => void;
}

export default function Navbar({ onThemeToggle, theme, onHomeClick }: NavbarProps) {
  return (
    <nav className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={onHomeClick}>
        <div className="w-8 h-8 rounded-md bg-purple-100 flex items-center justify-center dark:bg-purple-900/30">
          <GitBranch className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <span className="font-bold text-xl tracking-tight">README<span className="text-purple-600 dark:text-purple-400">Forge</span></span>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <a 
          href="https://github.com" 
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
    </nav>
  )
}
