import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Briefcase, Loader2, Sparkles } from 'lucide-react'
import axios from 'axios'

interface Props {
  onResult: (data: unknown, mode: 'analyze' | 'match') => void
}

export function UploadPage({ onResult }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [jobDesc, setJobDesc] = useState('')
  const [mode, setMode] = useState<'analyze' | 'match'>('analyze')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  })

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    setError(null)

    try {
      const fd = new FormData()
      fd.append('file', file)
      if (mode === 'match') fd.append('job_description', jobDesc)

      const url = mode === 'analyze' ? '/api/analyze' : '/api/match'
      const { data } = await axios.post(url, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onResult(data, mode)
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Ошибка анализа'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Mode switcher */}
      <div className="flex bg-dark-800 rounded-2xl p-1.5 mb-6 border border-slate-800 max-w-sm mx-auto">
        {(['analyze', 'match'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all
              ${mode === m ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {m === 'analyze' ? <><FileText size={15} /> Анализ</> : <><Briefcase size={15} /> Мэтчинг</>}
          </button>
        ))}
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-4
          ${isDragActive ? 'border-purple-500 bg-purple-500/5' : file ? 'border-green-500/50 bg-green-500/5' : 'border-slate-700 hover:border-slate-600 bg-dark-800'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          {file ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                <FileText size={28} className="text-green-400" />
              </div>
              <p className="font-medium text-green-400">{file.name}</p>
              <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(0)} KB · нажми для замены</p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-dark-700 border border-slate-700 flex items-center justify-center">
                <Upload size={28} className={isDragActive ? 'text-purple-400' : 'text-slate-500'} />
              </div>
              <p className="font-medium text-slate-300">Перетащи PDF резюме</p>
              <p className="text-sm text-slate-500">или нажми для выбора</p>
            </>
          )}
        </div>
      </div>

      {/* Job description for match mode */}
      <AnimatePresence>
        {mode === 'match' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Вставь описание вакансии..."
              rows={5}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-purple-500 resize-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={!file || loading || (mode === 'match' && !jobDesc.trim())}
        className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all"
      >
        {loading ? (
          <><Loader2 size={18} className="animate-spin" /> Анализирую...</>
        ) : (
          <><Sparkles size={18} /> {mode === 'analyze' ? 'Проанализировать резюме' : 'Сравнить с вакансией'}</>
        )}
      </motion.button>
    </div>
  )
}
