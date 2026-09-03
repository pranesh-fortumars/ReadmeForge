import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar.tsx'
import LandingPage from './components/LandingPage.tsx'
import Dashboard from './components/Dashboard.tsx'
import ImportRepo from './components/ImportRepo.tsx'
import Editor from './components/Editor/Editor.tsx'
import Preview from './components/Preview/Preview.tsx'
import BadgeStudio from './components/Tools/BadgeStudio.tsx'
import MarkdownPlayground from './components/Tools/MarkdownPlayground.tsx'
import ChangelogGenerator from './components/Tools/ChangelogGenerator.tsx'
import CommandPalette from './components/CommandPalette.tsx'

// A wrapper component for the Editor workspace
function Workspace() {
  return (
    <div className="flex-1 flex flex-col md:flex-row w-full h-full">
      <div className="w-full md:w-1/2 h-full overflow-hidden border-r border-gray-200 dark:border-gray-800">
        <Editor />
      </div>
      <div className="w-full md:w-1/2 h-full overflow-hidden bg-gray-100 dark:bg-[#0d1117]">
        <Preview />
      </div>
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const navigate = useNavigate()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-200">
      <Navbar 
        onThemeToggle={toggleTheme} 
        theme={theme} 
        onHomeClick={() => navigate('/')} 
      />
      
      <main className="flex-1 flex overflow-hidden w-full relative">
        <CommandPalette />
        <Routes>
          <Route path="/" element={<LandingPage onStart={() => navigate('/dashboard')} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/import" element={<ImportRepo />} />
          <Route path="/tools/badges" element={<BadgeStudio />} />
          <Route path="/tools/playground" element={<MarkdownPlayground />} />
          <Route path="/tools/changelog" element={<ChangelogGenerator />} />
          <Route path="/editor/:id" element={<Workspace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
