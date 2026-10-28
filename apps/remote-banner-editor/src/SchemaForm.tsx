import { Input } from '@mfe/design-system';
import type { BannerField, BannerSchema, BannerValues, ValidationError } from '@mfe/schema';
import { useId } from 'react';

interface Props {
  schema: BannerSchema;
  values: BannerValues;
  errors: ValidationError[];
  onChange: (key: string, value: string | boolean) => void;
}

/** 스키마의 fields를 순서대로 입력 컴포넌트로 바꾼다. */
export function SchemaForm({ schema, values, errors, onChange }: Props) {
  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }} onSubmit={(e) => e.preventDefault()}>
      {schema.fields.map((field) => (
        <FieldInput
          key={field.key}
          field={field}
          value={values[field.key]}
          error={errors.find((e) => e.path === field.key)?.message}
          onChange={(value) => onChange(field.key, value)}
        />
      ))}
    </form>
  );
}

interface FieldInputProps {
  field: BannerField;
  value: string | boolean | undefined;
  error?: string;
  onChange: (value: string | boolean) => void;
}

function FieldInput({ field, value, error, onChange }: FieldInputProps) {
  const id = useId();
  const label = field.required ? `${field.label} *` : field.label;
  const text = typeof value === 'string' ? value : '';

  switch (field.type) {
    case 'boolean':
      return (
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
          {label}
        </label>
      );
    case 'select':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label htmlFor={id}>{label}</label>
          <select id={id} value={text} onChange={(e) => onChange(e.target.value)} style={{ padding: 6, borderRadius: 6 }}>
            <option value="">선택</option>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {error && <span style={{ color: '#dc2626', fontSize: 12 }}>{error}</span>}
        </div>
      );
    case 'textarea':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label htmlFor={id}>{label}</label>
          <textarea id={id} rows={3} value={text} onChange={(e) => onChange(e.target.value)} style={{ padding: 6, borderRadius: 6 }} />
          {error && <span style={{ color: '#dc2626', fontSize: 12 }}>{error}</span>}
        </div>
      );
    default:
      return (
        <Input
          label={label}
          type={field.type === 'url' ? 'url' : field.type === 'color' ? 'color' : 'text'}
          value={text}
          error={error}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}
