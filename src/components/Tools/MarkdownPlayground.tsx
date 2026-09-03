import { useState } from 'react'
import { ArrowLeft, FileText, Code2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

const initialMarkdown = `# Markdown Playground

Welcome to the live Markdown testing ground.

## Features
- **Live Preview:** See your changes instantly
- *GFM Support:* Tables, strikethrough, task lists
- HTML Support: <span style="color: purple">Inline HTML works too!</span>

### Tables
| Header 1 | Header 2 |
|----------|----------|
| Row 1    | Data 1   |
| Row 2    | Data 2   |

### Task Lists
- [x] Create Markdown Playground
- [ ] Write awesome docs

> "The best documentation is documentation that gets written."
`

export default function MarkdownPlayground() {
  const navigate = useNavigate()
  const [markdown, setMarkdown] = useState(initialMarkdown)

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
      <div className="h-16 px-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#0d1117]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <FileText className="w-5 h-5" />
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Markdown Playground</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Editor */}
        <div className="w-full md:w-1/2 h-full flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0d1117]">
          <div className="h-10 bg-gray-50 dark:bg-[#010409] border-b border-gray-200 dark:border-gray-800 flex items-center px-4 gap-2">
            <Code2 className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Raw Markdown</span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 w-full p-4 bg-transparent outline-none resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
            spellCheck="false"
          />
        </div>

        {/* Preview */}
        <div className="w-full md:w-1/2 h-full flex flex-col bg-gray-50 dark:bg-[#0d1117]">
          <div className="h-10 bg-white dark:bg-[#010409] border-b border-gray-200 dark:border-gray-800 flex items-center px-4">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Live Output</span>
          </div>
          <div className="flex-1 overflow-y-auto p-8">
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
