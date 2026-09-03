import { useState } from 'react'
import { ArrowLeft, FileClock, Copy, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ChangelogGenerator() {
  const navigate = useNavigate()
  const [version, setVersion] = useState('1.0.0')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [added, setAdded] = useState('New feature 1\\nNew feature 2')
  const [changed, setChanged] = useState('Updated some existing behavior')
  const [deprecated, setDeprecated] = useState('')
  const [removed, setRemoved] = useState('')
  const [fixed, setFixed] = useState('Fixed a critical bug in production')
  const [security, setSecurity] = useState('')
  const [copied, setCopied] = useState(false)

  const generateChangelog = () => {
    let md = `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n\n`
    
    md += `## [${version}] - ${date}\n`
    
    const renderSection = (title: string, content: string) => {
      if (!content.trim()) return ''
      const items = content.split('\\n').map(i => i.trim()).filter(Boolean)
      if (items.length === 0) return ''
      return `### ${title}\n` + items.map(i => `- ${i}`).join('\n') + '\n\n'
    }

    md += renderSection('Added', added)
    md += renderSection('Changed', changed)
    md += renderSection('Deprecated', deprecated)
    md += renderSection('Removed', removed)
    md += renderSection('Fixed', fixed)
    md += renderSection('Security', security)

    return md.trim()
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generateChangelog())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
            <FileClock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Changelog Generator</h1>
            <p className="text-gray-600 dark:text-gray-400">Standardize your release notes using the 'Keep a Changelog' format.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#0d1117] p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Version</label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                />
              </div>
            </div>

            {['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'].map((type) => {
              const valueMap: Record<string, string> = { Added: added, Changed: changed, Deprecated: deprecated, Removed: removed, Fixed: fixed, Security: security }
              const setterMap: Record<string, (val: string) => void> = { Added: setAdded, Changed: setChanged, Deprecated: setDeprecated, Removed: setRemoved, Fixed: setFixed, Security: setSecurity }
              
              return (
              <div key={type}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{type} <span className="text-gray-400 text-xs">(one per line)</span></label>
                <textarea
                  value={valueMap[type]}
                  onChange={(e) => setterMap[type](e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm min-h-[60px]"
                  placeholder={`Any ${type.toLowerCase()} items...`}
                />
              </div>
            )})}
          </div>

          <div className="bg-gray-800 dark:bg-gray-900 p-6 rounded-xl border border-gray-700 relative flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Preview (Markdown)</span>
              <button 
                onClick={handleCopy}
                className="text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Markdown'}
              </button>
            </div>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono flex-1 overflow-y-auto">
              {generateChangelog()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
