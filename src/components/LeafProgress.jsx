// Signature element: a leaf that grows vein-by-vein as the student
// completes each section of the form — echoing "study guide" as growth.
export default function LeafProgress({ step, totalSteps, labels = [] }) {
  const pct = Math.min(1, step / totalSteps)
  const leafPath =
    'M60 8 C90 20 108 55 96 92 C86 122 60 138 40 132 C16 125 6 96 12 68 C18 40 34 14 60 8 Z'
  const perimeter = 360 // approx path length for dash animation
  const dashOffset = perimeter * (1 - pct)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{ position: 'relative', width: 88, height: 100 }}>
        <svg viewBox="0 0 120 140" width="88" height="100" fill="none">
          {/* faint outline */}
          <path d={leafPath} stroke="var(--sky-200)" strokeWidth="3" fill="none" opacity="0.6" />
          {/* growing fill mask */}
          <clipPath id="leafClip">
            <path d={leafPath} />
          </clipPath>
          <g clipPath="url(#leafClip)">
            <rect
              x="0"
              y={140 - 140 * pct}
              width="120"
              height={140 * pct}
              fill="url(#skyGradient)"
              style={{ transition: 'y 420ms ease, height 420ms ease' }}
            />
          </g>
          {/* main vein */}
          <path
            d="M60 20 C58 55 62 95 58 128"
            stroke="var(--sky-600)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={perimeter}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 420ms ease' }}
          />
          <path d={leafPath} stroke="var(--sky-600)" strokeWidth="2" fill="none" />
          <defs>
            <linearGradient id="skyGradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="var(--sky-600)" />
              <stop offset="100%" stopColor="var(--sky-400)" />
            </linearGradient>
          </defs>
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 15,
            color: pct > 0.4 ? '#fff' : 'var(--ink-900)',
            transition: 'color 420ms ease'
          }}
        >
          {Math.round(pct * 100)}%
        </div>
      </div>
      {labels[step - 1] && (
        <span className="tamil-eyebrow" style={{ fontSize: 12 }}>
          {labels[step - 1]}
        </span>
      )}
    </div>
  )
}
