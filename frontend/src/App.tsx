import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Github, Sparkles } from 'lucide-react'
import { UploadPage } from './pages/Upload'
import { ResultsPage } from './pages/Results'

export default function App() {
  const [result, setResult] = useState<{ data: unknown; mode: 'analyze' | 'match' } | null>(null)

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
              <FileText size={24} className="text-purple-400" />
            </div>
            <h1 className="text-4xl font-black tracking-tight">
              Resume<span className="text-purple-400">AI</span>
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            ИИ-анализ резюме: скор, навыки, советы.{' '}
            <span className="text-purple-400">Gemini 1.5 Flash</span> под капотом.
          </p>
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            {['PDF Upload', 'AI Scoring', 'Job Matching', 'Instant Results'].map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-dark-800 border border-slate-800 text-slate-400">
                <Sparkles size={10} className="text-purple-400" />
                {tag}
              </span>
            ))}
          </div>
        </motion.header>

        {/* Main */}
        {result ? (
          <ResultsPage
            data={result.data as Parameters<typeof ResultsPage>[0]['data']}
            mode={result.mode}
            onReset={() => setResult(null)}
          />
        ) : (
          <UploadPage onResult={(data, mode) => setResult({ data, mode })} />
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-slate-600 text-sm flex items-center justify-center gap-4">
          <span>ResumeAI — FastAPI + Gemini 1.5 Flash</span>
          <a href="https://github.com/3xfap2/resumeai" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-slate-400 transition-colors">
            <Github size={14} /> GitHub
          </a>
        </footer>
      </div>
    </div>
  )
}
