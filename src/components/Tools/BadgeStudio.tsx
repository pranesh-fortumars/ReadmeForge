import { useState } from 'react'
import { ArrowLeft, Shield, Copy, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function BadgeStudio() {
  const navigate = useNavigate()
  const [label, setLabel] = useState('react')
  const [message, setMessage] = useState('18.2.0')
  const [color, setColor] = useState('blue')
  const [style, setStyle] = useState('flat')
  const [logo, setLogo] = useState('react')
  const [copied, setCopied] = useState(false)

  // shields.io format: https://img.shields.io/badge/<LABEL>-<MESSAGE>-<COLOR>?style=<STYLE>&logo=<LOGO>
  // Encode URI components to handle spaces and special chars
  const generateBadgeUrl = () => {
    const l = encodeURIComponent(label.replace(/-/g, '--'))
    const m = encodeURIComponent(message.replace(/-/g, '--'))
    const c = encodeURIComponent(color)
    let url = `https://img.shields.io/badge/${l}-${m}-${c}?style=${style}`
    if (logo) url += `&logo=${encodeURIComponent(logo)}`
    return url
  }

  const markdownSnippet = `![${label} badge](${generateBadgeUrl()})`

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownSnippet)
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
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Badge Studio</h1>
            <p className="text-gray-600 dark:text-gray-400">Generate custom markdown badges instantly.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white dark:bg-[#0d1117] p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Label</label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color (Hex or Name)</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SimpleIcon Logo</label>
                <input
                  type="text"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              >
                <option value="flat">Flat (Default)</option>
                <option value="flat-square">Flat Square</option>
                <option value="plastic">Plastic</option>
                <option value="for-the-badge">For The Badge</option>
                <option value="social">Social</option>
              </select>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#0d1117] p-8 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center min-h-[200px]">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">Live Preview</h3>
              {label || message ? (
                <img src={generateBadgeUrl()} alt="Generated Badge preview" className="scale-125 transform transition-transform" />
              ) : (
                <span className="text-gray-400 text-sm">Enter label and message to preview</span>
              )}
            </div>

            <div className="bg-gray-800 dark:bg-gray-900 p-4 rounded-xl relative group">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Markdown Snippet</span>
                <button 
                  onClick={handleCopy}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <code className="text-sm text-green-400 break-all select-all font-mono">
                {markdownSnippet}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
