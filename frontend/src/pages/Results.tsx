import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, TrendingUp } from 'lucide-react'
import { ScoreRing } from '../components/ScoreRing'

interface AnalyzeResult {
  candidate_name: string
  position: string
  score: number
  score_breakdown: { skills: number; experience: number; education: number; presentation: number }
  skills: string[]
  experience_years: number | null
  strengths: string[]
  improvements: string[]
  keywords_missing: string[]
  summary: string
}

interface MatchResult {
  match_score: number
  matched_skills: string[]
  missing_skills: string[]
  verdict: string
  recommendation: string
}

interface Props {
  data: AnalyzeResult | MatchResult
  mode: 'analyze' | 'match'
  onReset: () => void
}

export function ResultsPage({ data, mode, onReset }: Props) {
  if (mode === 'match') {
    const d = data as MatchResult
    return (
      <div className="max-w-2xl mx-auto">
        <button onClick={onReset} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm">
          <ArrowLeft size={16} /> Загрузить другое
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-dark-800 rounded-2xl p-6 border-glow text-center">
            <ScoreRing score={d.match_score} size={140} label="Совпадение" />
            <p className="text-slate-300 mt-4 leading-relaxed">{d.verdict}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SkillList title="Совпадают" skills={d.matched_skills} type="good" />
            <SkillList title="Не хватает" skills={d.missing_skills} type="bad" />
          </div>

          <div className="bg-dark-800 rounded-2xl p-5 border-glow">
            <h3 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-1.5">
              <TrendingUp size={14} /> Рекомендация
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">{d.recommendation}</p>
          </div>
        </motion.div>
      </div>
    )
  }

  const d = data as AnalyzeResult
  const breakdown = [
    { label: 'Навыки', value: d.score_breakdown.skills, max: 25 },
    { label: 'Опыт', value: d.score_breakdown.experience, max: 25 },
    { label: 'Образование', value: d.score_breakdown.education, max: 25 },
    { label: 'Подача', value: d.score_breakdown.presentation, max: 25 },
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onReset} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm">
        <ArrowLeft size={16} /> Загрузить другое
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        {/* Header */}
        <div className="bg-dark-800 rounded-2xl p-6 border-glow flex flex-col sm:flex-row items-center gap-6">
          <ScoreRing score={d.score} size={130} label="Общий балл" />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-white">{d.candidate_name}</h2>
            <p className="text-purple-400 text-sm mt-0.5">{d.position}</p>
            {d.experience_years && (
              <p className="text-slate-500 text-sm mt-1">Опыт: {d.experience_years} лет</p>
            )}
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">{d.summary}</p>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="bg-dark-800 rounded-2xl p-5 border-glow">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Разбивка по критериям</h3>
          <div className="space-y-3">
            {breakdown.map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">{b.label}</span>
                  <span className="text-slate-400">{b.value}/{b.max}</span>
                </div>
                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(b.value / b.max) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        {d.skills.length > 0 && (
          <div className="bg-dark-800 rounded-2xl p-5 border-glow">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Навыки</h3>
            <div className="flex flex-wrap gap-2">
              {d.skills.map((s) => (
                <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FeedbackList title="Сильные стороны" items={d.strengths} type="good" />
          <FeedbackList title="Что улучшить" items={d.improvements} type="warn" />
        </div>

        {/* Missing keywords */}
        {d.keywords_missing.length > 0 && (
          <div className="bg-dark-800 rounded-2xl p-5 border-glow">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Недостающие ключевые слова</h3>
            <div className="flex flex-wrap gap-2">
              {d.keywords_missing.map((k) => (
                <span key={k} className="px-3 py-1 rounded-full text-xs bg-slate-700 text-slate-400 border border-slate-600">
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

function SkillList({ title, skills, type }: { title: string; skills: string[]; type: 'good' | 'bad' }) {
  return (
    <div className="bg-dark-800 rounded-2xl p-4 border-glow">
      <h3 className={`text-sm font-semibold mb-3 ${type === 'good' ? 'text-green-400' : 'text-red-400'}`}>{title}</h3>
      <ul className="space-y-1.5">
        {skills.map((s) => (
          <li key={s} className="flex items-center gap-2 text-sm text-slate-300">
            {type === 'good' ? <CheckCircle size={13} className="text-green-400 flex-shrink-0" /> : <XCircle size={13} className="text-red-400 flex-shrink-0" />}
            {s}
          </li>
        ))}
      </ul>
    </div>
  )
}

function FeedbackList({ title, items, type }: { title: string; items: string[]; type: 'good' | 'warn' }) {
  return (
    <div className="bg-dark-800 rounded-2xl p-5 border-glow">
      <h3 className={`text-sm font-semibold mb-3 ${type === 'good' ? 'text-green-400' : 'text-yellow-400'}`}>{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
            {type === 'good' ? <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" /> : <AlertCircle size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />}
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
