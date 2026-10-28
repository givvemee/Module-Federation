import { Button } from '@mfe/design-system';
import { initialValues, validateSchema, validateValues, type BannerSchema, type BannerValues, type ValidationError } from '@mfe/schema';
import { useMemo, useState } from 'react';
import { BannerPreview } from './BannerPreview';
import { DEFAULT_SCHEMA } from './defaultSchema';
import { SchemaForm } from './SchemaForm';

type ParseResult = { schema: BannerSchema; errors: [] } | { schema: null; errors: ValidationError[] };

function parseSchema(source: string): ParseResult {
  let json: unknown;
  try {
    json = JSON.parse(source);
  } catch (e) {
    return { schema: null, errors: [{ path: '', message: `JSON 문법 오류: ${(e as Error).message}` }] };
  }
  const result = validateSchema(json);
  return result.ok ? { schema: json as BannerSchema, errors: [] } : { schema: null, errors: result.errors };
}

const panel = { display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 } as const;

export default function BannerEditorPage() {
  const [source, setSource] = useState(() => JSON.stringify(DEFAULT_SCHEMA, null, 2));
  // 마지막으로 유효했던 스키마로 폼·미리보기를 유지해, 편집 중 JSON이 잠깐 깨져도 화면이 비지 않게 한다.
  const [schema, setSchema] = useState(DEFAULT_SCHEMA);
  const [schemaErrors, setSchemaErrors] = useState<ValidationError[]>([]);
  const [values, setValues] = useState<BannerValues>(() => initialValues(DEFAULT_SCHEMA));

  const valueResult = useMemo(() => validateValues(schema, values), [schema, values]);
  const valueErrors = valueResult.ok ? [] : valueResult.errors;

  const onSourceChange = (next: string) => {
    setSource(next);
    const parsed = parseSchema(next);
    setSchemaErrors(parsed.errors);
    if (parsed.schema) {
      setSchema(parsed.schema);
      // 새 필드는 기본값으로 채우고, 이미 입력한 값은 유지한다.
      setValues((prev) => ({ ...initialValues(parsed.schema), ...pick(prev, parsed.schema) }));
    }
  };

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>배너 에디터 · {schema.name}</h2>
        <Button variant="secondary" onClick={() => onSourceChange(JSON.stringify(DEFAULT_SCHEMA, null, 2))}>
          스키마 초기화
        </Button>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        <div style={panel}>
          <h3 style={{ margin: 0 }}>스키마 (JSON)</h3>
          <textarea
            aria-label="배너 스키마 JSON"
            spellCheck={false}
            value={source}
            onChange={(e) => onSourceChange(e.target.value)}
            style={{ minHeight: 420, fontFamily: 'ui-monospace, monospace', fontSize: 12, padding: 8, borderRadius: 6 }}
          />
          {schemaErrors.length > 0 && (
            <ul role="alert" style={{ margin: 0, paddingLeft: 16, color: '#dc2626', fontSize: 12 }}>
              {schemaErrors.map((e) => (
                <li key={`${e.path}:${e.message}`}>{e.path ? `${e.path}: ` : ''}{e.message}</li>
              ))}
            </ul>
          )}
        </div>
        <div style={panel}>
          <h3 style={{ margin: 0 }}>폼</h3>
          <SchemaForm
            schema={schema}
            values={values}
            errors={valueErrors}
            onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
          />
        </div>
        <div style={panel}>
          <h3 style={{ margin: 0 }}>미리보기</h3>
          <BannerPreview schema={schema} values={values} />
          <p style={{ margin: 0, fontSize: 12, color: valueErrors.length ? '#dc2626' : '#16a34a' }}>
            {valueErrors.length ? `입력값 오류 ${valueErrors.length}건` : '입력값이 스키마를 만족합니다'}
          </p>
        </div>
      </div>
    </section>
  );
}

function pick(values: BannerValues, schema: BannerSchema): BannerValues {
  return Object.fromEntries(schema.fields.filter((f) => f.key in values).map((f) => [f.key, values[f.key]!]));
}
