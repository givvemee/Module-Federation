import type { ButtonHTMLAttributes, CSSProperties } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

const VARIANT_STYLE: Record<NonNullable<ButtonProps['variant']>, CSSProperties> = {
  primary: { background: '#2563eb', color: '#fff', border: '1px solid #2563eb' },
  secondary: { background: '#fff', color: '#111827', border: '1px solid #d1d5db' },
  danger: { background: '#dc2626', color: '#fff', border: '1px solid #dc2626' },
};

export function Button({ variant = 'primary', style, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      style={{ padding: '6px 12px', borderRadius: 6, cursor: 'pointer', ...VARIANT_STYLE[variant], ...style }}
      {...props}
    />
  );
}
