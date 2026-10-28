# mfe-admin-lab

Module Federation 기반 마이크로 프론트엔드 운영 어드민 실험 레포입니다.
독립 배포·장애 격리·공유 의존성 문제를 직접 만들고 측정해 기록합니다.

## 구조

```
apps/
  host/                  # shell: 레이아웃, 라우팅, 리모트 로딩·에러 경계 (:4100)
  remote-content/        # 콘텐츠 관리 리모트 (:4101)
  remote-banner-editor/  # JSON 스키마 기반 배너 에디터 리모트 (:4102)
packages/
  design-system/         # @mfe/design-system — 런타임 공유(singleton) 대상
  schema/                # @mfe/schema — 빌드 타임 공유 대상
docs/
  adr/                   # 설계 결정 기록
  ai-log.md              # 에이전트 오류 기록
```

## 실행

```bash
pnpm install
pnpm typecheck
pnpm dev          # host :4100, remote-content :4101, remote-banner-editor :4102
```

요구 사항: Node 22+, pnpm 12

번들러는 Rsbuild + `@module-federation/rsbuild-plugin` ([ADR-001](docs/adr/001-bundler.md)).
호스트는 리모트 주소를 빌드에 넣지 않고 [apps/host/public/remotes.json](apps/host/public/remotes.json)에서 런타임에 읽습니다.

## 진행 상황

- [x] 1. 번들러 선택 → ADR-001
- [x] 2. 모노레포 뼈대 (pnpm workspace, Turborepo, design-system, schema)
- [x] 3. host ↔ remote-content 연결, singleton 공유, 런타임 매니페스트 (TanStack Query·Zustand는 아직)
- [x] 4. remote-banner-editor (JSON 스키마 → 폼·미리보기, 검증은 @mfe/schema)
- [ ] 5. 에러 경계와 리모트 로딩 실패 대체 UI
- [ ] 6. GitHub Actions 경로 필터 배포
- [ ] 7. 실험 수행과 측정값 기록
- [ ] 8. (선택) Sentry, Playwright
- [ ] 9. README 정리와 블로그 글

## 실험 결과

측정은 실측값만 기록합니다.

| 실험 | 결과 |
| --- | --- |
| 독립 배포 | - |
| 장애 격리 | - |
| 공유 의존성 충돌 | - |
| 빌드 시간 | - |
| 타입 공유 | - |
| 빌드 타임 vs 런타임 공유 | - |
