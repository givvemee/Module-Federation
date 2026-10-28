import type { BannerRole, BannerSchema, BannerValues } from '@mfe/schema';

/** role이 지정된 필드 값으로 배너를 그린다. */
export function BannerPreview({ schema, values }: { schema: BannerSchema; values: BannerValues }) {
  const byRole = (role: BannerRole) => {
    const field = schema.fields.find((f) => f.role === role);
    return field ? values[field.key] : undefined;
  };
  const str = (role: BannerRole) => {
    const v = byRole(role);
    return typeof v === 'string' && v ? v : undefined;
  };

  const align = str('align') === 'center' ? 'center' : 'left';
  const showCta = byRole('showCta') !== false && Boolean(str('ctaLabel'));

  return (
    <div
      data-testid="banner-preview"
      style={{
        padding: 32,
        borderRadius: 12,
        background: str('backgroundColor') ?? '#e5e7eb',
        color: str('textColor') ?? '#111827',
        textAlign: align,
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        gap: 8,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 24 }}>{str('title') ?? '제목 없음'}</h3>
      {str('subtitle') && <p style={{ margin: 0, opacity: 0.85 }}>{str('subtitle')}</p>}
      {showCta && (
        <a
          href={str('ctaUrl') ?? '#'}
          target="_blank"
          rel="noreferrer"
          style={{ marginTop: 8, padding: '8px 16px', borderRadius: 6, background: 'rgba(255,255,255,0.9)', color: '#111827', textDecoration: 'none' }}
        >
          {str('ctaLabel')}
        </a>
      )}
    </div>
  );
}
