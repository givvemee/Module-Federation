import { DESIGN_SYSTEM_VERSION } from '@mfe/design-system';

export function HomePage() {
  return (
    <section>
      <h2 style={{ marginTop: 0 }}>운영 어드민</h2>
      <p>왼쪽 메뉴에서 도메인을 선택하세요. 각 메뉴는 별도로 배포되는 리모트 앱입니다.</p>
      <p style={{ color: '#6b7280' }}>host design-system v{DESIGN_SYSTEM_VERSION}</p>
    </section>
  );
}
