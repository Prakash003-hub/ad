import { useLocation, useNavigate } from 'react-router-dom'

export default function SuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const registrationId = location.state?.registrationId

  const shareMessage =
`🎉 *மைக்ரோ நோட்ஸ் திறப்பு விழா சிறப்பு சலுகை!*

📚 *School, College, TNPSC, NEET/JEE உள்ளிட்ட Study Guides இலவசம்!*

🎁 பதிவு செய்பவர்களில் இருந்து *குலுக்கல் முறையில் 100 அதிர்ஷ்டசாலிகள்* தேர்வு செய்யப்பட்டு *இலவச Study Guide புத்தகங்கள்* வழங்கப்படும்.

📞 தேர்வு செய்யப்பட்டவர்களை எங்கள் குழு தொடர்புகொள்ளும்.

👉 *இப்போதே பதிவு செய்யுங்கள்:*`

  const shareUrl = 'https://micronotesoffer.vercel.app/'
  const fullShareText = encodeURIComponent(`${shareMessage}\n${shareUrl}`)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
      <div className="glass-card" style={{ maxWidth: 460, width: '100%', padding: '44px 28px', textAlign: 'center' }}>
        <ConfettiLeaf />

        <div style={{ margin: '12px 0 6px' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--sky-700)', background: 'var(--sky-100)', padding: '5px 14px', borderRadius: 999, display: 'inline-block' }}>
            🏢 Micro Notes (மைக்ரோ நோட்ஸ்)
          </span>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 10, marginBottom: 6, color: 'var(--ink-900)' }}>
          🎉 பதிவு வெற்றிகரமாக முடிந்தது!
        </h1>
        <p style={{ fontSize: 14, color: 'var(--ink-600)', marginBottom: 12, fontWeight: 600 }}>
          Micro Notes Free Study Guide Registration Successful!
        </p>

        {registrationId && (
          <p style={{ fontSize: 14, color: 'var(--sky-600)', fontWeight: 800, marginBottom: 16, background: 'var(--sky-100)', padding: '8px 16px', borderRadius: 999, display: 'inline-block' }}>
            பதிவு எண் (Registration ID): {registrationId}
          </p>
        )}

        <p style={{ fontSize: 14.5, lineHeight: 1.6, marginBottom: 8, color: 'var(--ink-900)' }}>
          குலுக்கல் முறையில் <strong>100 மாணவர்கள் (100 Participants)</strong> தேர்ந்தெடுக்கப்படுவார்கள்.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 8, color: 'var(--ink-600)' }}>
          நீங்கள் தேர்ந்தெடுக்கப்பட்டால் எங்கள் குழு உங்களை கைபேசி வழியாக தொடர்பு கொள்ளும்.
        </p>
        <p style={{ fontSize: 13.5, lineHeight: 1.6, marginBottom: 28, color: 'var(--ink-400)' }}>
          இவ்வாய்ப்பை உங்கள் நண்பர்களுடனும் பகிர்ந்து கொள்ளுங்கள்!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a
            className="btn"
            style={{ background: '#25D366', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 15 }}
            href={`https://api.whatsapp.com/send?text=${fullShareText}`}
            target="_blank"
            rel="noreferrer"
          >
            📲 WhatsApp-ல் பகிரவும் (Share via WhatsApp)
          </a>
          <button className="btn btn-ghost" onClick={() => navigate('/')}>
            முகப்பு பக்கத்திற்கு செல்ல (Go Home)
          </button>
        </div>
      </div>
    </div>
  )
}

function ConfettiLeaf() {
  return (
    <svg viewBox="0 0 200 140" width="140" style={{ margin: '0 auto', display: 'block' }}>
      <path
        d="M100 10 C140 24 164 62 150 100 C138 132 100 146 72 132 C44 118 32 78 50 46 C64 22 82 4 100 10 Z"
        fill="var(--sky-500)"
      >
        <animateTransform
          attributeName="transform"
          type="scale"
          values="0.7;1.05;1"
          dur="0.6s"
          keyTimes="0;0.7;1"
          repeatCount="1"
        />
      </path>
      {[...Array(8)].map((_, i) => (
        <circle
          key={i}
          cx={30 + i * 20}
          cy={20 + (i % 3) * 12}
          r={i % 2 === 0 ? 4 : 3}
          fill={i % 2 === 0 ? 'var(--gold-500)' : 'var(--sky-400)'}
          opacity="0.8"
        >
          <animate attributeName="cy" from={0} to={20 + (i % 3) * 12} dur="0.8s" begin={`${i * 0.05}s`} fill="freeze" />
        </circle>
      ))}
    </svg>
  )
}
