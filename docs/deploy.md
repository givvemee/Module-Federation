# Vercel 배포 연결하기

GitHub Actions에서 빌드하고, 앱마다 별도 Vercel 프로젝트에 `vercel deploy --prebuilt --prod`로 배포합니다.
처음 한 번만 아래 순서로 연결하면, 이후에는 main에 push할 때 바뀐 앱만 배포됩니다.

## 0. GitHub에 push

레포를 GitHub에 올립니다. push하면 Deploy 워크플로가 한 번 돌지만, 아직 시크릿이 없어서 실패합니다. 정상입니다.

## 1. Vercel 프로젝트 3개 만들기 (Git 연동 없이)

```bash
npm i -g vercel
vercel login
vercel project add mfe-admin-host
vercel project add mfe-admin-remote-content
vercel project add mfe-admin-remote-banner-editor
```

대시보드의 "Import Git Repository"로 만들지 않습니다. Git을 연결하면 Vercel도 push마다 따로 빌드해서 Actions 배포와 겹칩니다.

## 2. 필요한 값 모으기

| 값 | 찾는 곳 |
| --- | --- |
| `VERCEL_TOKEN` | Account Settings → Tokens에서 새로 발급 |
| `VERCEL_ORG_ID` | 팀: Team Settings → General → Team ID / 개인 계정: Account Settings → General → Vercel ID |
| 프로젝트 ID 3개 | 각 프로젝트 → Settings → General → Project ID |
| 운영 도메인 3개 | 각 프로젝트 → Settings → Domains (예: `mfe-admin-host.vercel.app`) |

## 3. 도메인 맞추기

프로젝트 이름이 이미 쓰이고 있으면 도메인이 `mfe-admin-*.vercel.app`과 달라집니다. 그 경우 실제 도메인으로 바꿉니다.

- [apps/host/remotes.production.json](../apps/host/remotes.production.json)의 리모트 주소 2개
- 4단계의 `HOST_ORIGIN`

## 4. GitHub에 시크릿·변수 등록

레포 → Settings → Secrets and variables → Actions

| 종류 | 이름 | 값 |
| --- | --- | --- |
| Secret | `VERCEL_TOKEN` | 2단계에서 발급한 토큰 |
| Secret | `VERCEL_ORG_ID` | 팀 ID 또는 개인 계정 ID |
| Secret | `VERCEL_PROJECT_ID_HOST` | mfe-admin-host의 Project ID |
| Secret | `VERCEL_PROJECT_ID_REMOTE_CONTENT` | mfe-admin-remote-content의 Project ID |
| Secret | `VERCEL_PROJECT_ID_REMOTE_BANNER_EDITOR` | mfe-admin-remote-banner-editor의 Project ID |
| Variable | `HOST_ORIGIN` | 호스트 도메인, 끝에 `/` 없이 (예: `https://mfe-admin-host.vercel.app`) |

## 5. 첫 배포

Actions → Deploy → Run workflow. 입력칸을 비우면 세 앱을 모두 배포합니다.
특정 앱만 배포하려면 `["remote-content"]`처럼 JSON 배열로 넣습니다.

## 6. 확인

- 호스트 도메인의 `/content`, `/banner`에서 두 리모트가 뜨는지 봅니다.
- 리모트가 안 뜨면 브라우저 콘솔에 CORS 에러가 있는지 봅니다. 대부분 `HOST_ORIGIN`이 실제 호스트 도메인과 달라서 생깁니다.

## 배포 구조 참고

- [ci.yml](../.github/workflows/ci.yml): PR마다 전체 typecheck·build
- [deploy.yml](../.github/workflows/deploy.yml): main push 시 경로 필터로 바뀐 앱만 matrix 배포. 수동 실행도 가능
- [scripts/vercel-output.mjs](../scripts/vercel-output.mjs): `dist`를 [Build Output API v3](https://vercel.com/docs/build-output-api/v3)로 변환
  - `mf-manifest.json`, `remotes.json`은 `no-cache`, 해시가 붙은 `/static/*`는 1년 immutable
  - 리모트에는 `HOST_ORIGIN`만 허용하는 CORS 헤더, 호스트에는 SPA fallback
  - 호스트의 `remotes.json`을 `remotes.production.json`으로 교체

| 앱 | Vercel 프로젝트 | 함께 재배포되는 변경 |
| --- | --- | --- |
| host | `mfe-admin-host` | design-system, pnpm-lock.yaml |
| remote-content | `mfe-admin-remote-content` | design-system, pnpm-lock.yaml |
| remote-banner-editor | `mfe-admin-remote-banner-editor` | design-system, schema, pnpm-lock.yaml |
