import { useId, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, style, ...props }: InputProps) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        style={{ padding: '6px 8px', borderRadius: 6, border: `1px solid ${error ? '#dc2626' : '#d1d5db'}`, ...style }}
        {...props}
      />
      {error && <span style={{ color: '#dc2626', fontSize: 12 }}>{error}</span>}
    </div>
  );
}
