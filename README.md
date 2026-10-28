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

## 배포

GitHub Actions에서 빌드하고, 앱마다 별도 Vercel 프로젝트에 `vercel deploy --prebuilt --prod`로 올립니다.

- [ci.yml](.github/workflows/ci.yml): PR마다 전체 typecheck와 build
- [deploy.yml](.github/workflows/deploy.yml): main에 push되면 경로 필터로 바뀐 앱만 matrix로 빌드·배포. 수동 실행(workflow_dispatch)으로 앱을 골라 배포할 수도 있음
- [scripts/vercel-output.mjs](scripts/vercel-output.mjs): `dist`를 [Build Output API v3](https://vercel.com/docs/build-output-api/v3) 형식으로 변환
  - `mf-manifest.json`, `remotes.json`은 `no-cache`, 해시가 붙은 `/static/*`는 1년 immutable
  - 리모트에는 `HOST_ORIGIN`만 허용하는 CORS 헤더를, 호스트에는 SPA fallback을 추가
  - 호스트의 `remotes.json`은 [remotes.production.json](apps/host/remotes.production.json)으로 교체

| 앱 | Vercel 프로젝트 | 의존 패키지 변경 시 재배포 |
| --- | --- | --- |
| host | `mfe-admin-host` | design-system |
| remote-content | `mfe-admin-remote-content` | design-system |
| remote-banner-editor | `mfe-admin-remote-banner-editor` | design-system, schema |

### 처음 연결하기

1. Vercel CLI로 Git 연동 없이 프로젝트 3개를 만듭니다. Git을 연결하면 Vercel이 push마다 따로 빌드해서 Actions와 중복됩니다.
   ```bash
   npm i -g vercel && vercel login
   vercel project add mfe-admin-host
   vercel project add mfe-admin-remote-content
   vercel project add mfe-admin-remote-banner-editor
   ```
2. 각 프로젝트의 Project ID(Settings → General)와 팀 ID(Team Settings → General)를 확인합니다.
3. 프로젝트 이름이 이미 쓰이고 있으면 운영 도메인이 `<이름>.vercel.app`과 다를 수 있습니다. 실제 도메인으로 [remotes.production.json](apps/host/remotes.production.json)을 고칩니다.
4. GitHub 레포 Settings → Secrets and variables → Actions에 등록합니다.
   - Secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID_HOST`, `VERCEL_PROJECT_ID_REMOTE_CONTENT`, `VERCEL_PROJECT_ID_REMOTE_BANNER_EDITOR`
   - Variables: `HOST_ORIGIN` (예: `https://mfe-admin-host.vercel.app`)
5. Actions → Deploy → Run workflow로 전체를 한 번 배포합니다.

## 진행 상황

- [x] 1. 번들러 선택 → ADR-001
- [x] 2. 모노레포 뼈대 (pnpm workspace, Turborepo, design-system, schema)
- [x] 3. host ↔ remote-content 연결, singleton 공유, 런타임 매니페스트 (TanStack Query·Zustand는 아직)
- [x] 4. remote-banner-editor (JSON 스키마 → 폼·미리보기, 검증은 @mfe/schema)
- [ ] 5. 에러 경계와 리모트 로딩 실패 대체 UI
- [ ] 6. GitHub Actions 경로 필터 배포 (워크플로 작성 완료, Vercel 연결·첫 배포 전)
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
