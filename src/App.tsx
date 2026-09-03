import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import LandingPage from './components/LandingPage'
import Editor from './components/Editor/Editor'
import Preview from './components/Preview/Preview'

function App() {
  const [showEditor, setShowEditor] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

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
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 flex flex-col transition-colors duration-200">
      <Navbar onThemeToggle={toggleTheme} theme={theme} onHomeClick={() => setShowEditor(false)} />
      
      <main className="flex-1 flex flex-col">
        {!showEditor ? (
          <LandingPage onStart={() => setShowEditor(true)} />
        ) : (
          <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)]">
            <div className="w-full md:w-1/2 h-full overflow-hidden border-r border-gray-200 dark:border-gray-800">
              <Editor />
            </div>
            <div className="w-full md:w-1/2 h-full overflow-hidden bg-gray-100 dark:bg-[#0d1117]">
              <Preview />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
