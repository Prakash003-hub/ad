import { useNavigate } from 'react-router-dom'
import { getFormattedLastDate, getWhatsAppShareUrl } from '../utils/shareUtils.js'

export default function LandingPage() {
  const navigate = useNavigate()
  const lastDate = getFormattedLastDate(5)
  const whatsappUrl = getWhatsAppShareUrl(5)

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: 480,
          width: '100%',
          padding: '40px 28px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <BackgroundGlow />

        {/* Grand Opening Special Offer Badge */}
        <div style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', color: '#fff', padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12, boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)' }}>
          <span>🎉</span>
          <span>திறப்பு விழாவின் சிறப்பு சலுகை! (Grand Opening Offer)</span>
        </div>

        <div style={{ display: 'block', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--sky-700)', background: 'var(--sky-100)', padding: '5px 14px', borderRadius: 999, display: 'inline-block' }}>
            🏢 Micro Notes (மைக்ரோ நோட்ஸ்) வழங்கும்
          </span>
        </div>

        <h1
          style={{
            fontSize: 25,
            fontWeight: 800,
            lineHeight: 1.3,
            marginTop: 4,
            marginBottom: 14,
            color: 'var(--ink-900)',
          }}
        >
          🎁 Micro Notes Free Study Guide Registration
        </h1>

        <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 12, color: 'var(--ink-900)', fontWeight: 600 }}>
          மைக்ரோ நோட்ஸ் <strong>திறப்பு விழாவின் சலுகையாக</strong> அனைத்து படிப்பு வழிகாட்டி குறிப்புகளும் இலவசமாக பெற பதிவு செய்யுங்கள்!
        </p>

        {/* Dynamic Last Date Banner */}
        <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 12, padding: '8px 14px', marginBottom: 14, display: 'inline-flex', alignItems: 'center', gap: 8, color: '#dc2626', fontSize: 13.5, fontWeight: 800 }}>
          <span>⏳</span>
          <span>பதிவு செய்ய கடைசி தேதி: {lastDate}</span>
        </div>

        {/* Free All Notes Highlight Banner */}
        <div style={{ background: 'linear-gradient(135deg, rgba(2,132,199,0.08), rgba(56,189,248,0.15))', border: '1.5px solid var(--sky-300)', borderRadius: 16, padding: '12px 14px', marginBottom: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--sky-700)', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span>📚</span>
            <span>அனைத்து படிப்பு குறிப்புகளும் 100% இலவசம்!</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, background: '#fff', color: 'var(--sky-800)', padding: '3px 9px', borderRadius: 999, border: '1px solid var(--sky-200)' }}>🏫 School Notes</span>
            <span style={{ fontSize: 11.5, fontWeight: 700, background: '#fff', color: 'var(--sky-800)', padding: '3px 9px', borderRadius: 999, border: '1px solid var(--sky-200)' }}>🎓 College Notes</span>
            <span style={{ fontSize: 11.5, fontWeight: 700, background: '#fff', color: 'var(--sky-800)', padding: '3px 9px', borderRadius: 999, border: '1px solid var(--sky-200)' }}>💼 TNPSC Notes</span>
            <span style={{ fontSize: 11.5, fontWeight: 700, background: '#fff', color: 'var(--sky-800)', padding: '3px 9px', borderRadius: 999, border: '1px solid var(--sky-200)' }}>⚡ NEET / JEE & All Exams</span>
          </div>
        </div>

        <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 12, color: 'var(--ink-600)' }}>
          குலுக்கல் முறையில் <strong style={{ color: 'var(--sky-600)' }}>100 அதிர்ஷ்டசாலிகள் (100 Participants)</strong> தேர்ந்தெடுக்கப்பட்டு இலவசமாக புத்தகங்கள் வழங்கப்படும்.
        </p>

        <p style={{ fontSize: 13.5, lineHeight: 1.5, marginBottom: 20, color: 'var(--ink-400)' }}>
          தேர்ந்தெடுக்கப்படும் வெற்றியாளர்களை எங்கள் குழு தொலைபேசி வழியாக தொடர்பு கொள்ளும்.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-primary" style={{ width: '100%', fontSize: 16.5, py: 16 }} onClick={() => navigate('/register')}>
            இப்பொழுதே பதிவு செய்ய (Register Now)
          </button>
          <a
            className="btn"
            style={{ background: '#25D366', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span>📲</span> WhatsApp-ல் பகிரவும் (Share on WhatsApp)
          </a>
        </div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 16, borderTop: '1px solid var(--glass-border)', paddingTop: 20 }}>
          <StatPill emoji="🏆" label="100 வெற்றியாளர்கள்" sub="100 Winners" />
          <StatPill emoji="📞" label="நேரடி தொடர்பு" sub="Phone Contact" />
          <StatPill emoji="🗺️" label="தமிழ்நாடு முழுவதும்" sub="All TN Districts" />
        </div>
      </div>

      <p style={{ marginTop: 20, fontSize: 13, color: 'var(--ink-400)', textAlign: 'center', fontWeight: 600 }}>
        Micro Notes - மாணவர்கள் மற்றும் போட்டித் தேர்வர்களுக்கு இலவச சேவை (Free Educational Support)
      </p>
    </div>
  )
}

function StatPill({ emoji, label, sub }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontSize: 12, color: 'var(--ink-900)', fontWeight: 600 }}>
      <span style={{ fontSize: 22 }}>{emoji}</span>
      <span>{label}</span>
      <span style={{ fontSize: 10.5, color: 'var(--ink-400)', fontWeight: 400 }}>{sub}</span>
    </div>
  )
}

function BackgroundGlow() {
  return (
    <div
      style={{
        position: 'absolute',
        top: -60,
        right: -60,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}
    />
  )
}
