export function TextField({ label, value, onChange, error, required, type = 'text', name, ...rest }) {
  return (
    <div className="field">
      <input
        type={type}
        id={name}
        name={name}
        placeholder=" "
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
      <label htmlFor={name}>
        {label}
        {required && ' *'}
      </label>
      {error && <span className="hint-error">{error}</span>}
    </div>
  )
}

export function SelectField({ label, value, onChange, error, required, name, options, placeholder }) {
  return (
    <div className="field">
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={value ? 'has-value' : ''}
      >
        <option value="" disabled hidden>
          {placeholder || ' '}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <label htmlFor={name}>
        {label}
        {required && ' *'}
      </label>
      <span className="chevron">▾</span>
      {error && <span className="hint-error">{error}</span>}
    </div>
  )
}

export function RadioGroup({ label, value, onChange, options, name }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-600)', marginBottom: 10 }}>
        {label}
      </span>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {options.map((opt) => {
          const active = value === opt
          return (
            <button
              type="button"
              key={opt}
              onClick={() => onChange(opt)}
              style={{
                padding: '10px 18px',
                borderRadius: 999,
                border: active ? '1.5px solid var(--leaf-600)' : '1.5px solid rgba(18,54,43,0.14)',
                background: active ? 'var(--leaf-500)' : 'rgba(255,255,255,0.5)',
                color: active ? '#fff' : 'var(--ink-900)',
                fontWeight: 600,
                fontSize: 13.5,
                transition: 'all 160ms ease'
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
