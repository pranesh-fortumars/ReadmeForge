import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GitBranch, AlertCircle, Loader2, Sparkles } from 'lucide-react'
import { useReadme } from '../hooks/useReadme'
import { analyzeRepository } from '../services/github/githubApi'

export default function ImportRepo() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const navigate = useNavigate()
  const { setState } = useReadme()

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setLoading(true)
    setError(null)

    try {
      const data = await analyzeRepository(url)
      
      if (!data) {
        throw new Error('Could not analyze repository. Ensure it is a public GitHub repository.')
      }

      // Update the current project with the analyzed data
      setState(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          name: data.name,
          description: data.description,
          githubUrl: url,
          license: data.license || 'MIT',
        },
        technologies: data.technologies.length > 0 ? data.technologies : prev.technologies
      }))

      // Redirect to the editor
      navigate('/editor/imported')
    } catch (err: any) {
      setError(err.message || 'An error occurred during import.')
    } finally {
      setLoading(false)
    }
  }

  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setAiLoading(true)
    setError(null)

    try {
      const data = await analyzeRepository(url)
      
      if (!data) {
        throw new Error('Could not analyze repository. Ensure it is a public GitHub repository.')
      }

      // Fetch package.json content to send to AI
      let packageJson = null
      try {
        const pkgRes = await fetch(`https://raw.githubusercontent.com/${data.owner}/${data.name}/${data.defaultBranch}/package.json`)
        if (pkgRes.ok) packageJson = await pkgRes.json()
      } catch (e) {}

      // Call our secure serverless endpoint
      const aiRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: url,
          repoData: data,
          packageJson
        })
      })

      if (!aiRes.ok) {
        const errData = await aiRes.json()
        throw new Error(errData.error || 'AI generation failed.')
      }

      const generated = await aiRes.json()

      setState(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          name: generated.name || data.name,
          description: generated.description || data.description,
          longDescription: generated.longDescription || '',
          githubUrl: url,
          license: data.license || 'MIT',
        },
        features: generated.features || prev.features,
        faq: generated.faq || prev.faq,
        installation: generated.installation || prev.installation,
        usage: generated.usage || prev.usage,
        technologies: data.technologies.length > 0 ? data.technologies : prev.technologies
      }))

      navigate('/editor/ai-generated')
    } catch (err: any) {
      setError(err.message || 'An error occurred during AI generation.')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GitBranch className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Import Repository</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Paste a public GitHub repository URL to automatically detect its description, tech stack, and license.
          </p>
        </div>

        <form onSubmit={handleImport} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              required
              className="w-full px-4 py-3 bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-200 dark:border-red-900/50">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              onClick={handleImport}
              disabled={loading || aiLoading || !url}
              className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Basic Import'
              )}
            </button>
            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={loading || aiLoading || !url}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md flex items-center justify-center gap-2 transition-all relative overflow-hidden group"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  AI Generate
                </>
              )}
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
