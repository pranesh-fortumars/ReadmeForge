import { ArrowRight, FileText, CheckCircle, Zap } from 'lucide-react'

export default function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Build a README people <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
              actually want to read.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Create beautiful, professional GitHub README files with a visual editor, live preview, templates, badges, and repository import.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2 group"
            >
              Create README
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg shadow-sm transition-all"
            >
              View Editor Demo
            </button>
          </div>
        </div>
        
        <div className="mt-20 w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FileText className="w-6 h-6 text-purple-500" />,
              title: 'Visual Editor',
              desc: 'Edit your README with a powerful interface, no Markdown knowledge required.'
            },
            {
              icon: <Zap className="w-6 h-6 text-blue-500" />,
              title: 'Live Preview',
              desc: 'See exactly how your README will look on GitHub as you type.'
            },
            {
              icon: <CheckCircle className="w-6 h-6 text-green-500" />,
              title: 'Quality Score',
              desc: 'Get a deterministic score to ensure your project documentation is complete.'
            }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-gray-800 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-24 w-full max-w-4xl border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[#0d1117]">
          <div className="h-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="p-4 sm:p-8 flex items-center justify-center opacity-70 min-h-[300px]">
            <div className="animate-pulse space-y-4 w-full">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mx-auto mt-8"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mx-auto"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded w-full mt-12"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
