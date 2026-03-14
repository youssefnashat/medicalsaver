import { useState } from 'react'

// ── Severity definitions ──
const SEVERITIES = [
  { id: 'bleeding', icon: '🩸' },
  { id: 'broken',   icon: '🦴' },
  { id: 'burn',     icon: '🔥' },
  { id: 'pain',     icon: '🤕' },
]

// ── Body zone definitions (viewBox 0 0 200 380) ─────────────────────────────
// "left" = figure's left = viewer's right side of screen
const ZONES = [
  { id: 'head',      shape: 'ellipse', props: { cx: 100, cy: 40,  rx: 26,  ry: 28  } },
  { id: 'neck',      shape: 'rect',    props: { x: 90,  y: 67,   width: 20,  height: 18,  rx: 5  } },
  { id: 'chest',     shape: 'rect',    props: { x: 55,  y: 85,   width: 90,  height: 78,  rx: 6  } },
  { id: 'abdomen',   shape: 'rect',    props: { x: 58,  y: 163,  width: 84,  height: 50,  rx: 6  } },
  { id: 'leftArm',   shape: 'rect',    props: { x: 145, y: 85,   width: 30,  height: 100, rx: 8  } },
  { id: 'rightArm',  shape: 'rect',    props: { x: 25,  y: 85,   width: 30,  height: 100, rx: 8  } },
  { id: 'leftHand',  shape: 'ellipse', props: { cx: 160, cy: 200, rx: 16,  ry: 18  } },
  { id: 'rightHand', shape: 'ellipse', props: { cx: 40,  cy: 200, rx: 16,  ry: 18  } },
  { id: 'leftLeg',   shape: 'rect',    props: { x: 100, y: 213,  width: 44,  height: 130, rx: 8  } },
  { id: 'rightLeg',  shape: 'rect',    props: { x: 56,  y: 213,  width: 44,  height: 130, rx: 8  } },
  { id: 'leftFoot',  shape: 'ellipse', props: { cx: 122, cy: 357, rx: 24,  ry: 15  } },
  { id: 'rightFoot', shape: 'ellipse', props: { cx: 78,  cy: 357, rx: 24,  ry: 15  } },
]

// ── Zone display info (emoji + label for severity card header) ───────────────
const ZONE_DISPLAY = {
  head:      { emoji: '🧠', label: 'Head' },
  neck:      { emoji: '🩹', label: 'Neck' },
  chest:     { emoji: '🫀', label: 'Chest' },
  abdomen:   { emoji: '🫁', label: 'Stomach' },
  leftArm:   { emoji: '💪', label: 'Left Arm' },
  rightArm:  { emoji: '💪', label: 'Right Arm' },
  leftHand:  { emoji: '✋', label: 'Left Hand' },
  rightHand: { emoji: '🤚', label: 'Right Hand' },
  leftLeg:   { emoji: '🦵', label: 'Left Leg' },
  rightLeg:  { emoji: '🦵', label: 'Right Leg' },
  leftFoot:  { emoji: '🦶', label: 'Left Foot' },
  rightFoot: { emoji: '🦶', label: 'Right Foot' },
}

// ── Summary utility ──────────────────────────────────────────────────────────
const ZONE_LABELS = {
  head: 'the head',       neck: 'the neck',
  chest: 'the chest',     abdomen: 'the abdomen',
  leftArm: 'the left arm',  rightArm: 'the right arm',
  leftHand: 'the left hand', rightHand: 'the right hand',
  leftLeg: 'the left leg',  rightLeg: 'the right leg',
  leftFoot: 'the left foot', rightFoot: 'the right foot',
}
const SEV_LABELS = {
  bleeding: 'bleeding',
  broken: 'a broken bone',
  burn: 'a burn',
  pain: 'pain',
}

export function getBodySummary(selections) {
  if (!selections || !Object.keys(selections).length) return ''
  const parts = Object.entries(selections)
    .filter(([, sevs]) => sevs.length > 0)
    .map(([zone, sevs]) => {
      const loc = ZONE_LABELS[zone] || zone
      const issues = sevs.map(s => SEV_LABELS[s] || s)
      const issueStr =
        issues.length === 1
          ? issues[0]
          : `${issues.slice(0, -1).join(', ')} and ${issues.at(-1)}`
      return `${issueStr} in ${loc}`
    })
  if (!parts.length) return ''
  if (parts.length === 1) return `Patient is reporting ${parts[0]}.`
  return `Patient is reporting ${parts.slice(0, -1).join(', ')}, and ${parts.at(-1)}.`
}

// ── Component ────────────────────────────────────────────────────────────────
export default function BodySelector({ onChange }) {
  const [selections, setSelections] = useState({})

  const update = (next) => {
    setSelections(next)
    onChange?.(next)
  }

  const toggleZone = (id) => {
    const next = { ...selections }
    if (id in next) {
      delete next[id]
    } else {
      next[id] = []
    }
    update(next)
  }

  const toggleSeverity = (zoneId, sevId) => {
    const current = selections[zoneId] ?? []
    update({
      ...selections,
      [zoneId]: current.includes(sevId)
        ? current.filter(s => s !== sevId)
        : [...current, sevId],
    })
  }

  const selectedIds = Object.keys(selections)

  return (
    <div className="flex flex-col items-center bg-[#0a0a0a] pb-8">
      <style>{`
        @keyframes zone-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .zone-sel { animation: zone-pulse 1.4s ease-in-out infinite; }
      `}</style>

      {/* Interactive SVG body */}
      <svg
        viewBox="0 0 200 380"
        width="200"
        height="380"
        xmlns="http://www.w3.org/2000/svg"
        style={{ touchAction: 'none', display: 'block' }}
      >
        {ZONES.map(({ id, shape, props }) => {
          const sel = id in selections
          const shapeProps = {
            ...props,
            fill: sel ? 'rgba(239,68,68,0.28)' : 'rgba(255,255,255,0.07)',
            stroke: sel ? '#ef4444' : 'rgba(255,255,255,0.22)',
            strokeWidth: sel ? 1.5 : 1,
            className: sel ? 'zone-sel' : '',
            style: {
              cursor: 'pointer',
              filter: sel
                ? 'drop-shadow(0 0 5px rgba(239,68,68,0.7))'
                : 'none',
            },
            onClick: () => toggleZone(id),
          }
          return shape === 'ellipse'
            ? <ellipse key={id} {...shapeProps} />
            : <rect key={id} {...shapeProps} />
        })}
      </svg>

      {/* Severity pickers — one card per selected zone */}
      {selectedIds.length > 0 && (
        <div className="mt-2 w-full max-w-[320px] px-4 flex flex-col gap-3">
          {selectedIds.map(zoneId => (
            <div
              key={zoneId}
              className="rounded-2xl border border-red-500/25 bg-red-950/20 p-3"
            >
              {/* Zone header */}
              <div className="mb-2.5 flex items-center gap-2">
                <span className="text-xl leading-none">{ZONE_DISPLAY[zoneId]?.emoji}</span>
                <span className="font-syne text-xs font-bold uppercase tracking-wider text-red-400">
                  {ZONE_DISPLAY[zoneId]?.label}
                </span>
              </div>

              {/* Severity icon buttons */}
              <div className="flex gap-1.5">
                {SEVERITIES.map(({ id: sevId, icon }) => {
                  const active = selections[zoneId]?.includes(sevId)
                  return (
                    <button
                      key={sevId}
                      onClick={() => toggleSeverity(zoneId, sevId)}
                      className={`flex flex-1 items-center justify-center rounded-xl py-3 text-2xl transition-all duration-150 active:scale-90 ${
                        active
                          ? 'bg-red-500/25 border border-red-500/60'
                          : 'bg-white/5 border border-white/10 opacity-50'
                      }`}
                    >
                      {icon}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
