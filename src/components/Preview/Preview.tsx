import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Check, Copy, Download, Code, FileText } from 'lucide-react'
import { useReadme } from '../../hooks/useReadme'
import { generateMarkdown } from '../../utils/markdownGenerator'

export default function Preview() {
  const { state } = useReadme()
  const [viewMode, setViewMode] = useState<'preview' | 'markdown'>('preview')
  const [copied, setCopied] = useState(false)
  const markdown = generateMarkdown(state)

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([markdown], { type: 'text/markdown' })
    element.href = URL.createObjectURL(file)
    element.download = 'README.md'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0d1117]">
      <div className="h-12 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 bg-gray-50 dark:bg-[#010409]">
        <div className="flex items-center bg-gray-200 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${
              viewMode === 'preview' 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => setViewMode('markdown')}
            className={`px-3 py-1 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${
              viewMode === 'markdown' 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Code className="w-4 h-4" />
            Markdown
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors"
            title="Copy Markdown"
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors"
            title="Download README.md"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          {viewMode === 'preview' ? (
            <div className="prose prose-slate dark:prose-invert max-w-none 
              prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400 
              prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:text-gray-900 dark:prose-pre:text-gray-200 border border-transparent dark:border-transparent">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {markdown}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={markdown}
              readOnly
              className="w-full h-full min-h-[500px] p-4 font-mono text-sm bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          )}
        </div>
      </div>
    </div>
  )
}
