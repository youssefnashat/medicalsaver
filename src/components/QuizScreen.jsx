import { useState, useEffect } from 'react'
import { emergencyConfig } from '../emergencyQuizLogic'
import { Card, CardContent } from './ui/card'
import { BorderBeam } from './ui/border-beam'
import BodySelector from './BodySelector'

export default function QuizScreen({ type, onComplete, onBack }) {
  const config = emergencyConfig[type]
  const [questionIdx, setQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)
  const [transitioning, setTransitioning] = useState(false)
  const [animating, setAnimating] = useState(true)
  const [phase, setPhase] = useState('quiz') // 'quiz' | 'body'
  const [bodySelections, setBodySelections] = useState({})
  const [selectedSymptoms, setSelectedSymptoms] = useState([])

  useEffect(() => {
    setAnimating(true)
    const t = setTimeout(() => setAnimating(false), 50)
    return () => clearTimeout(t)
  }, [questionIdx])

  const currentQuestion = config.questions[questionIdx]
  const totalQuestions = config.questions.length
  // medical shows both questions on one combined screen + body map = 2 steps total
  const totalSteps = type === 'medical' ? 2 : totalQuestions
  const progress = ((questionIdx + (selected ? 1 : 0)) / totalSteps) * 100

  const handleSelect = (value) => {
    if (transitioning) return
    setSelected(value)

    setTimeout(() => {
      const newAnswers = { ...answers, [currentQuestion.id]: value }
      setAnswers(newAnswers)
      setTransitioning(true)

      setTimeout(() => {
        if (questionIdx + 1 < totalQuestions) {
          setQuestionIdx(questionIdx + 1)
          setSelected(null)
          setTransitioning(false)
        } else if (type === 'medical') {
          setPhase('body')
          setTransitioning(false)
          setSelected(null)
        } else {
          onComplete(newAnswers)
        }
      }, 350)
    }, 500)
  }

  // Medical screen — single multi-select grid
  if (type === 'medical' && phase === 'quiz') {
    const symptomsQ = config.questions[0]
    const toggle = (val) =>
      setSelectedSymptoms(prev => {
        if (prev.includes(val)) return prev.filter(v => v !== val)
        // yes/no breathing are mutually exclusive
        const opposite = val === 'breathing_yes' ? 'breathing_no' : val === 'breathing_no' ? 'breathing_yes' : null
        return [...prev.filter(v => v !== opposite), val]
      })
    return (
      <div className="flex min-h-screen flex-col bg-[#0a0a0a] px-5 pb-8 pt-12">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-colors hover:bg-white/10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg text-base"
              style={{ background: `${config.color}20`, border: `1px solid ${config.color}40` }}
            >
              {config.emoji}
            </span>
            <span className="font-syne text-sm font-bold text-white/70 uppercase tracking-wider">
              {config.label} Emergency
            </span>
          </div>
        </div>

        {/* Progress bar — step 1 of 2 */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between">
            <span className="font-outfit text-xs text-white/40">Question 1 of 2</span>
            <span className="font-outfit text-xs" style={{ color: config.color }}>50%</span>
          </div>
          <div className="h-1 w-full rounded-full bg-white/10">
            <div
              className="h-1 rounded-full transition-all duration-500 ease-out"
              style={{ width: '50%', background: `linear-gradient(90deg, ${config.color}80, ${config.color})` }}
            />
          </div>
        </div>

        {/* Question */}
        <h2 className="font-syne text-2xl font-bold leading-tight text-white mb-2">
          {symptomsQ.text}
        </h2>
        <p className="font-outfit mb-6 text-sm text-white/40">Select all that apply</p>

        {/* Condition options — multi-select */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {symptomsQ.options.filter(o => !o.value.startsWith('breathing_')).map((option) => {
            const isSel = selectedSymptoms.includes(option.value)
            return (
              <button
                key={option.value}
                onClick={() => toggle(option.value)}
                className="relative overflow-hidden rounded-2xl border transition-all duration-200 active:scale-95"
                style={{
                  background: isSel ? `${config.color}15` : '#111',
                  borderColor: isSel ? config.color : 'rgba(255,255,255,0.08)',
                  minHeight: '80px',
                  boxShadow: isSel ? `0 0 20px ${config.color}30` : 'none',
                }}
              >
                <div className="flex flex-col items-center justify-center gap-2 p-3">
                  <span className="text-3xl leading-none">{option.emoji}</span>
                  <span className="font-outfit text-center text-xs font-medium leading-tight"
                    style={{ color: isSel ? 'white' : 'rgba(255,255,255,0.65)' }}>
                    {option.label}
                  </span>
                </div>
                {isSel && (
                  <div className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full"
                    style={{ background: config.color }}>
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Breathing section */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">😮‍💨</span>
          <span className="font-syne text-sm font-bold uppercase tracking-wider text-white/50">Breathing?</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { emoji: '✅', label: 'Yes', value: 'breathing_yes', color: '#22c55e' },
            { emoji: '❌', label: 'No',  value: 'breathing_no',  color: '#ef4444' },
          ].map((option) => {
            const isSel = selectedSymptoms.includes(option.value)
            return (
              <button
                key={option.value}
                onClick={() => toggle(option.value)}
                className="relative overflow-hidden rounded-2xl border transition-all duration-200 active:scale-95"
                style={{
                  background: isSel ? `${option.color}18` : '#111',
                  borderColor: isSel ? option.color : 'rgba(255,255,255,0.08)',
                  minHeight: '80px',
                  boxShadow: isSel ? `0 0 20px ${option.color}35` : 'none',
                }}
              >
                <div className="flex flex-col items-center justify-center gap-2 p-3">
                  <span className="text-3xl leading-none">{option.emoji}</span>
                  <span className="font-outfit text-center text-xs font-medium leading-tight"
                    style={{ color: isSel ? 'white' : 'rgba(255,255,255,0.65)' }}>
                    {option.label}
                  </span>
                </div>
                {isSel && (
                  <div className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full"
                    style={{ background: option.color }}>
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Continue button */}
        <div className="mt-auto pt-8">
          <button
            onClick={() => {
              setAnswers({ symptoms: selectedSymptoms })
              setPhase('body')
            }}
            disabled={selectedSymptoms.length === 0}
            className="w-full rounded-2xl py-4 font-syne text-base font-bold tracking-wide text-white transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}cc 100%)`,
              boxShadow: selectedSymptoms.length > 0 ? `0 8px 32px ${config.color}40` : 'none',
            }}
          >
            →
          </button>
        </div>
      </div>
    )
  }

  // Body map phase — medical only, shown after quiz questions
  if (phase === 'body') {
    return (
      <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center gap-3 px-5 pb-4 pt-12">
          <button
            onClick={() => {
              setPhase('quiz')
              setQuestionIdx(0)
              setSelected(null)
              setSelectedSymptoms([])
              setTransitioning(false)
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-colors hover:bg-white/10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg text-base"
              style={{ background: `${config.color}20`, border: `1px solid ${config.color}40` }}
            >
              {config.emoji}
            </span>
            <span className="font-syne text-sm font-bold uppercase tracking-wider text-white/70">
              {config.label} Emergency
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex-shrink-0 mb-6 px-5">
          <div className="mb-2 flex justify-between">
            <span className="font-outfit text-xs text-white/40">
              Question {totalSteps} of {totalSteps}
            </span>
            <span className="font-outfit text-xs" style={{ color: config.color }}>
              100%
            </span>
          </div>
          <div className="h-1 w-full rounded-full bg-white/10">
            <div
              className="h-1 rounded-full transition-all duration-500 ease-out"
              style={{
                width: '100%',
                background: `linear-gradient(90deg, ${config.color}80, ${config.color})`,
              }}
            />
          </div>
        </div>

        {/* Scrollable body selector */}
        <div className="flex-1 overflow-y-auto">
          <BodySelector onChange={setBodySelections} />
        </div>

        {/* Continue button */}
        <div className="flex-shrink-0 px-5 pb-8 pt-4">
          <button
            onClick={() => onComplete({ ...answers, bodySelections })}
            className="w-full rounded-2xl py-4 font-syne text-lg font-bold tracking-wide text-white transition-all active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}cc 100%)`,
              boxShadow: `0 8px 32px ${config.color}40`,
            }}
          >
            →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] px-5 pb-8 pt-12">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-colors hover:bg-white/10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-base"
            style={{ background: `${config.color}20`, border: `1px solid ${config.color}40` }}
          >
            {config.emoji}
          </span>
          <span className="font-syne text-sm font-bold text-white/70 uppercase tracking-wider">
            {config.label} Emergency
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between">
          <span className="font-outfit text-xs text-white/40">
            Question {questionIdx + 1} of {totalSteps}
          </span>
          <span className="font-outfit text-xs" style={{ color: config.color }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1 w-full rounded-full bg-white/10">
          <div
            className="h-1 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${config.color}80, ${config.color})`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div
        className="mb-8 transition-all duration-300"
        style={{ opacity: transitioning ? 0 : 1, transform: transitioning ? 'translateY(-8px)' : 'translateY(0)' }}
      >
        <h2 className="font-syne text-2xl font-bold leading-tight text-white">
          {currentQuestion.text}
        </h2>
        <p className="font-outfit mt-2 text-sm text-white/40">Tap the option that best describes your situation</p>
      </div>

      {/* Options grid */}
      <div
        className="grid grid-cols-2 gap-3 transition-all duration-300"
        style={{ opacity: transitioning ? 0 : 1, transform: transitioning ? 'translateY(8px)' : 'translateY(0)' }}
      >
        {currentQuestion.options.map((option) => {
          const isSelected = selected === option.value
          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              disabled={!!selected}
              className="relative overflow-hidden rounded-2xl border transition-all duration-200 active:scale-95"
              style={{
                background: isSelected ? `${config.color}15` : '#111',
                borderColor: isSelected ? config.color : 'rgba(255,255,255,0.08)',
                minHeight: '100px',
                boxShadow: isSelected ? `0 0 20px ${config.color}30, inset 0 1px 0 ${config.color}20` : 'none',
              }}
            >
              {/* Card content */}
              <div className="flex flex-col items-center justify-center gap-2.5 p-4">
                <span className="text-4xl leading-none">{option.emoji}</span>
                <span
                  className="font-outfit text-center text-sm font-medium leading-tight"
                  style={{ color: isSelected ? 'white' : 'rgba(255,255,255,0.65)' }}
                >
                  {option.label}
                </span>
              </div>

              {/* BorderBeam on selected */}
              {isSelected && (
                <BorderBeam
                  size={60}
                  duration={3}
                  colorFrom={config.color}
                  colorTo={`${config.color}60`}
                  borderWidth={1.5}
                />
              )}

              {/* Check indicator */}
              {isSelected && (
                <div
                  className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full"
                  style={{ background: config.color }}
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Skip / help text */}
      <div className="mt-auto pt-8 text-center">
        <p className="font-outfit text-xs text-white/25">Your answers help dispatch the right help faster</p>
      </div>
    </div>
  )
}
