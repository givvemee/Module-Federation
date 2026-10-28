import type { BannerField, BannerSchema, BannerValues } from './banner';

export interface ValidationError {
  path: string;
  message: string;
}

export type ValidationResult = { ok: true } | { ok: false; errors: ValidationError[] };

const FIELD_TYPES = new Set(['text', 'textarea', 'color', 'url', 'select', 'boolean']);
const ROLES = new Set(['title', 'subtitle', 'backgroundColor', 'textColor', 'ctaLabel', 'ctaUrl', 'align', 'showCta']);
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

/** 외부에서 들어온 JSON이 BannerSchema 형태인지 검사한다. */
export function validateSchema(input: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  if (typeof input !== 'object' || input === null) {
    return { ok: false, errors: [{ path: '', message: '객체여야 합니다' }] };
  }
  const schema = input as Partial<BannerSchema>;
  if (schema.version !== 1) errors.push({ path: 'version', message: 'version은 1이어야 합니다' });
  if (typeof schema.name !== 'string' || !schema.name) {
    errors.push({ path: 'name', message: 'name은 비어 있지 않은 문자열이어야 합니다' });
  }
  if (!Array.isArray(schema.fields)) {
    errors.push({ path: 'fields', message: 'fields는 배열이어야 합니다' });
  } else {
    const keys = new Set<string>();
    const roles = new Set<string>();
    schema.fields.forEach((field: Partial<BannerField>, i) => {
      const path = `fields[${i}]`;
      if (typeof field.key !== 'string' || !field.key) {
        errors.push({ path: `${path}.key`, message: 'key가 필요합니다' });
      } else if (keys.has(field.key)) {
        errors.push({ path: `${path}.key`, message: `중복된 key: ${field.key}` });
      } else {
        keys.add(field.key);
      }
      if (!field.type || !FIELD_TYPES.has(field.type)) {
        errors.push({ path: `${path}.type`, message: `지원하지 않는 type: ${String(field.type)}` });
      }
      if (field.type === 'select' && !Array.isArray((field as { options?: unknown }).options)) {
        errors.push({ path: `${path}.options`, message: 'select는 options가 필요합니다' });
      }
      if (field.role !== undefined) {
        if (!ROLES.has(field.role)) {
          errors.push({ path: `${path}.role`, message: `지원하지 않는 role: ${String(field.role)}` });
        } else if (roles.has(field.role)) {
          errors.push({ path: `${path}.role`, message: `role은 한 필드에만 지정할 수 있습니다: ${field.role}` });
        } else {
          roles.add(field.role);
        }
      }
    });
  }
  return errors.length ? { ok: false, errors } : { ok: true };
}

/** 스키마에 맞춰 사용자가 입력한 값을 검사한다. */
export function validateValues(schema: BannerSchema, values: BannerValues): ValidationResult {
  const errors: ValidationError[] = [];
  for (const field of schema.fields) {
    const value = values[field.key];
    const empty = value === undefined || value === '';
    if (empty) {
      if (field.required) errors.push({ path: field.key, message: `${field.label}은(는) 필수입니다` });
      continue;
    }
    switch (field.type) {
      case 'boolean':
        if (typeof value !== 'boolean') errors.push({ path: field.key, message: 'true/false여야 합니다' });
        break;
      case 'color':
        if (typeof value !== 'string' || !HEX_COLOR.test(value)) {
          errors.push({ path: field.key, message: '#RRGGBB 형식이어야 합니다' });
        }
        break;
      case 'url':
        if (typeof value !== 'string' || !URL.canParse(value)) {
          errors.push({ path: field.key, message: '올바른 URL이 아닙니다' });
        }
        break;
      case 'select':
        if (!field.options.some((o) => o.value === value)) {
          errors.push({ path: field.key, message: '선택지에 없는 값입니다' });
        }
        break;
      default:
        if (typeof value !== 'string') {
          errors.push({ path: field.key, message: '문자열이어야 합니다' });
        } else if (field.maxLength && value.length > field.maxLength) {
          errors.push({ path: field.key, message: `${field.maxLength}자 이하여야 합니다` });
        }
    }
  }
  return errors.length ? { ok: false, errors } : { ok: true };
}

/** 스키마의 defaultValue로 폼 초기값을 만든다. */
export function initialValues(schema: BannerSchema): BannerValues {
  return Object.fromEntries(
    schema.fields.map((field) => [field.key, field.defaultValue ?? (field.type === 'boolean' ? false : '')]),
  );
}
