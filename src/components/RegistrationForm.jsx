import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, SelectField, RadioGroup } from './FormField.jsx'
import LeafProgress from './LeafProgress.jsx'
import { api } from '../api/api.js'
import {
  STANDARDS,
  SUBJECTS_12TH,
  COLLEGE_YEARS,
  OCCUPATIONS,
  GUIDE_TYPES,
  LANGUAGES,
  SOURCES,
  TN_DISTRICTS,
  CATEGORY_OPTIONS,
  GENDER_OPTIONS
} from '../data/options.js'

const STEP_LABELS = ['தனிப்பட்ட விவரம்', 'படிப்பு விவரம்', 'முகவரி']
const TOTAL_STEPS = 3

const emptyForm = {
  fullName: '', mobile: '', age: '', gender: '',
  category: '',
  schoolName: '', standard: '', subject: '',
  collegeName: '', degree: '', department: '', courseCode: '', year: '',
  occupation: '', occupationOther: '',
  requestedNotes: '',
  guideType: 'Free Study Guide', language: 'Tamil',
  door: '', area: '', district: '', pincode: '',
  source: '', referral: '',
  consent: true
}

function validateStep(step, f) {
  const e = {}
  if (step === 1) {
    if (!f.fullName.trim()) e.fullName = 'Full name is required'
    if (!/^[6-9]\d{9}$/.test(f.mobile.trim())) e.mobile = 'Enter a valid 10-digit mobile number'
    if (!f.age || Number(f.age) < 5 || Number(f.age) > 100) e.age = 'Enter a valid age'
    if (!f.category) e.category = 'Please select a category'
  }
  if (step === 2) {
    if (!f.requestedNotes?.trim()) e.requestedNotes = 'Please enter subject or notes name'
    if (f.category === 'School') {
      if (!f.schoolName.trim()) e.schoolName = 'School name is required'
      if (!f.standard) e.standard = 'Please select standard'
      if (f.standard === '12th' && !f.subject) e.subject = 'Please select your subject'
    } else if (f.category === 'College') {
      if (!f.collegeName.trim()) e.collegeName = 'College name is required'
    } else if (f.category === 'Others') {
      if (!f.occupation) e.occupation = 'Please select an option'
      if (f.occupation === 'Other' && !f.occupationOther.trim()) e.occupationOther = 'Please specify'
    }
  }
  if (step === 3) {
    if (!f.district) e.district = 'Please select your district'
    if (!/^\d{6}$/.test(f.pincode.trim())) e.pincode = 'Enter a valid 6-digit pincode'
  }
  return e
}

export default function RegistrationForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))

  const goNext = async () => {
    const e = validateStep(step, form)
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setSubmitting(true)
    setSubmitError('')

    try {
      // Save data progressively at Step 1 and subsequent steps
      const res = await api.submitRegistration(form)
      let currentRegId = form.registrationId
      if (res?.registrationId && !currentRegId) {
        currentRegId = res.registrationId
        setForm((prev) => ({ ...prev, registrationId: res.registrationId }))
      }

      if (step === TOTAL_STEPS) {
        navigate('/success', { state: { registrationId: res?.registrationId || currentRegId } })
      } else {
        setStep((s) => Math.min(TOTAL_STEPS, s + 1))
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (err) {
      // On intermediate steps, allow user to continue even if network is slow
      if (step < TOTAL_STEPS) {
        setStep((s) => Math.min(TOTAL_STEPS, s + 1))
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setSubmitError(err.message || 'Could not submit your registration. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const goBack = () => {
    setStep((s) => Math.max(1, s - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const progressStep = useMemo(() => step, [step])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '28px 16px 60px' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textCenter: 'center', textAlign: 'center', marginBottom: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--sky-700)', background: 'var(--sky-100)', padding: '5px 14px', borderRadius: 999, display: 'inline-block' }}>
            🏢 Micro Notes (மைக்ரோ நோட்ஸ்)
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#0284c7', background: 'rgba(255,255,255,0.9)', padding: '3px 12px', borderRadius: 999, border: '1px solid var(--sky-300)' }}>
            🎉 திறப்பு விழா சிறப்பு சலுகை - All Notes FREE!
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <LeafProgress step={progressStep} totalSteps={TOTAL_STEPS} labels={STEP_LABELS} />
        </div>

        <div className="glass-card" style={{ padding: '28px 24px' }}>
          {step === 1 && <StepPersonal form={form} set={set} errors={errors} />}
          {step === 2 && <StepCategoryDetails form={form} set={set} errors={errors} />}
          {step === 3 && <StepAddress form={form} set={set} errors={errors} />}

          {submitError && (
            <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12, fontWeight: 500 }}>
              {submitError}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            {step > 1 && (
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={goBack} disabled={submitting}>
                ← முந்தைய (Back)
              </button>
            )}
            <button className="btn btn-primary" style={{ flex: 2 }} onClick={goNext} disabled={submitting}>
              {submitting ? <Spinner /> : step === TOTAL_STEPS ? 'பதிவு செய்க (Register Now)' : 'அடுத்து (Continue) →'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--ink-400)', marginTop: 16, fontWeight: 500 }}>
          படிநிலை {step} / {TOTAL_STEPS} (Step {step} of {TOTAL_STEPS})
        </p>
      </div>
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: 'var(--sky-600)' }}>{children}</h2>
  )
}

function StepPersonal({ form, set, errors }) {
  return (
    <>
      <SectionTitle>👤 தனிப்பட்ட விவரங்கள் (Personal Details)</SectionTitle>
      <TextField name="fullName" label="முழு பெயர் (Full Name) *" required value={form.fullName} onChange={set('fullName')} error={errors.fullName} />
      <TextField name="mobile" label="கைபேசி எண் (Mobile Number) *" required type="tel" inputMode="numeric" maxLength={10} value={form.mobile} onChange={(v) => set('mobile')(v.replace(/\D/g, ''))} error={errors.mobile} />
      <TextField name="age" label="வயது (Age) *" required type="number" value={form.age} onChange={set('age')} error={errors.age} />
      <SelectField name="gender" label="பாலினம் (Gender)" value={form.gender} onChange={set('gender')} options={GENDER_OPTIONS} />
      <SelectField name="category" label="பிரிவு (Category) *" required value={form.category} onChange={(v) => { set('category')(v) }} options={CATEGORY_OPTIONS} error={errors.category} />
    </>
  )
}

function StepCategoryDetails({ form, set, errors }) {
  return (
    <>
      <SectionTitle>📚 படிப்பு & குறிப்புகள் (Study & Notes Details)</SectionTitle>
      
      <TextField
        name="requestedNotes"
        label="தேவையான பாடம் / குறிப்பின் பெயர் (Subject or Notes Name) *"
        required
        value={form.requestedNotes}
        onChange={set('requestedNotes')}
        error={errors.requestedNotes}
      />

      {form.category === 'School' && (
        <>
          <TextField name="schoolName" label="பள்ளி பெயர் (School Name) *" required value={form.schoolName} onChange={set('schoolName')} error={errors.schoolName} />
          <SelectField name="standard" label="வகுப்பு (Standard) *" required value={form.standard} onChange={set('standard')} options={STANDARDS} error={errors.standard} />
          {form.standard === '12th' && (
            <SelectField name="subject" label="பாடம் / பிரிவு (Subject) *" required value={form.subject} onChange={set('subject')} options={SUBJECTS_12TH} error={errors.subject} />
          )}
        </>
      )}

      {form.category === 'College' && (
        <>
          <TextField name="collegeName" label="கல்லூரி பெயர் (College Name) *" required value={form.collegeName} onChange={set('collegeName')} error={errors.collegeName} />
          <TextField name="degree" label="பட்டப்படிப்பு (Degree)" value={form.degree} onChange={set('degree')} />
          <TextField name="department" label="துறை (Department)" value={form.department} onChange={set('department')} />
          <TextField name="courseCode" label="பாடக் குறியீடு (Course Code)" value={form.courseCode} onChange={set('courseCode')} />
          <SelectField name="year" label="ஆண்டு (Year)" value={form.year} onChange={set('year')} options={COLLEGE_YEARS} />
        </>
      )}

      {form.category === 'Others' && (
        <>
          <SelectField name="occupation" label="தொழில் / நிலை (Occupation) *" required value={form.occupation} onChange={set('occupation')} options={OCCUPATIONS} error={errors.occupation} />
          {form.occupation === 'Other' && (
            <TextField name="occupationOther" label="விவரம் (Please specify) *" required value={form.occupationOther} onChange={set('occupationOther')} error={errors.occupationOther} />
          )}
        </>
      )}

      {!form.category && (
        <p style={{ fontSize: 14, color: 'var(--ink-600)' }}>முந்தைய பக்கத்திற்கு சென்று பிரிவை தேர்ந்தெடுக்கவும்.</p>
      )}
    </>
  )
}

function StepGuide({ form, set, errors }) {
  return (
    <>
      <SectionTitle>📘 வழிகாட்டி விவரங்கள் (Guide Details)</SectionTitle>
      <SelectField name="guideType" label="தேவையான வழிகாட்டி (Which guide do you need?) *" required value={form.guideType} onChange={set('guideType')} options={GUIDE_TYPES} error={errors.guideType} />
      <RadioGroup name="language" label="விருப்பமான மொழி (Preferred Language) *" value={form.language} onChange={set('language')} options={LANGUAGES} />
      {errors.language && <span className="hint-error">{errors.language}</span>}
    </>
  )
}

function StepAddress({ form, set, errors }) {
  return (
    <>
      <SectionTitle>📍 முகவரி விவரங்கள் (Delivery Address)</SectionTitle>
      <TextField name="door" label="கதவு எண் / தெரு (Door No / Street)" value={form.door} onChange={set('door')} />
      <TextField name="area" label="ஊர் / பகுதி (Area / Village)" value={form.area} onChange={set('area')} />
      <SelectField name="district" label="மாவட்டம் (District) *" required value={form.district} onChange={set('district')} options={TN_DISTRICTS} error={errors.district} />
      <TextField name="pincode" label="அஞ்சல் குறியீடு (Pincode) *" required inputMode="numeric" maxLength={6} value={form.pincode} onChange={(v) => set('pincode')(v.replace(/\D/g, ''))} error={errors.pincode} />
    </>
  )
}

function StepExtraConsent({ form, set, errors }) {
  return (
    <>
      <SectionTitle>✅ இறுதி உறுதிப்படுத்தல் (Confirmation)</SectionTitle>
      <SelectField name="source" label="இத்தகவல் உங்களுக்கு எவ்வாறு கிடைத்தது?" value={form.source} onChange={set('source')} options={SOURCES} />
      <TextField name="referral" label="பரிந்துரை குறியீடு (Referral Code - Optional)" value={form.referral} onChange={set('referral')} />

      <label
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          fontSize: 13.5,
          color: 'var(--ink-900)',
          marginBottom: 8,
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => set('consent')(e.target.checked)}
          style={{ marginTop: 3, width: 18, height: 18, accentColor: 'var(--sky-600)' }}
        />
        வழங்கப்பட்ட விவரங்கள் அனைத்தும் உண்மையானவை என உறுதி செய்கிறேன். (I confirm that all information is correct.)
      </label>
      {errors.consent && <span className="hint-error">{errors.consent}</span>}
    </>
  )
}

function Spinner() {
  return (
    <span
      style={{
        width: 18,
        height: 18,
        border: '2.5px solid rgba(255,255,255,0.4)',
        borderTopColor: '#fff',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'spin 0.7s linear infinite'
      }}
    >
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </span>
  )
}
