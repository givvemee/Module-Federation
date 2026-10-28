# Module Federation 실험 레포 기획서

Oct 27, 2026 · @Vivi

업무에서 직접 다뤄 보지 못한 Module Federation 기반 마이크로 프론트엔드를 작은 운영 어드민으로 만들고 측정하는 포트폴리오용 실험입니다. 이 문서는 에이전트 세션에 그대로 넘겨 작업을 시작할 수 있게 쓴 기획서이며, 구현이 기획과 다른지 검증하는 기준 문서입니다.

## 배경과 목표

목표는 도메인별로 독립 개발·배포되는 웹 애플리케이션을 Module Federation으로 직접 만들고, 독립 배포·장애 격리·공유 의존성 문제를 측정해 기록으로 남기는 것입니다.

**왜 만드는가**

- 서비스와 조직이 커지면 하나의 레포·빌드 구조가 개발과 배포의 병목이 되고, 이를 도메인 단위로 나누는 방법으로 마이크로 프론트엔드가 쓰입니다.
- 실무에서는 빌드 타임 공유(공통 npm 패키지, 모노레포)까지 경험했고, 런타임 공유(Module Federation)는 아직 직접 다뤄 보지 않았습니다. 직접 만들고 측정해 두 방식의 장단점을 내 말로 설명할 수 있게 하는 것이 목적입니다.
- 결과물은 포트폴리오(공개 레포, 데모, 블로그 글)로 씁니다.

**이미 가진 관련 경험 (설계의 출발점)**

- 멀티레포가 함께 쓰는 디자인 시스템·스키마를 공통 npm 패키지로 분리·배포하는 구조 전환
- 도메인 레포를 Turborepo 모노레포로 묶는 경계 설계
- 두 경험 모두 "빌드 타임 공유"입니다. 이번 실험은 이를 "런타임 공유(Module Federation)"로 확장하고, 두 방식의 차이를 내 말로 설명할 수 있게 하는 데 초점을 둡니다.

**완료 기준**

- [ ] 호스트 1개와 리모트 2개가 각각 따로 배포되고, 리모트 하나만 고쳐 배포해도 호스트 재배포 없이 반영된다
- [ ] 리모트 하나가 죽어도 호스트와 다른 리모트는 동작한다
- [ ] 아래 실험 항목의 측정값과 관찰 결과가 README에 기록돼 있다
- [ ] 설계 결정과 그 이유가 문서(ADR)로 남아 있다
- [ ] 블로그 글 1편 공개 (blog.vivi.page)

## 설계와 실험 항목

주제는 여러 도메인이 함께 쓰는 운영 어드민으로 잡고, 리모트 하나는 스키마 기반 에디터로 만들어 "스키마로 UI를 정의하는 빌더" 패턴도 함께 다룹니다.

**앱 구성**

| 앱 | 역할 | 노출(expose)하는 것 |
| --- | --- | --- |
| host (shell) | 레이아웃, 내비게이션, 라우팅, 가짜 로그인·권한, 리모트 로딩과 에러 경계 | 없음 (리모트를 소비) |
| remote-content | 콘텐츠 목록·상세 관리 (테이블, 필터, 상태 변경) | 콘텐츠 관리 페이지 컴포넌트 |
| remote-banner-editor | JSON 스키마로 배너 UI를 정의하면 폼과 미리보기가 자동으로 그려지는 에디터 | 에디터 페이지 컴포넌트 |
| packages/design-system | Button, Input, Table 등 공통 컴포넌트 | 런타임 공유(singleton) 대상 |
| packages/schema | 배너 스키마 타입과 검증 함수 | 빌드 타임 공유 대상 |

```
mfe-admin-lab/
  apps/
    host/
    remote-content/
    remote-banner-editor/
  packages/
    design-system/
    schema/
  docs/adr/
  pnpm-workspace.yaml
  turbo.json
```

**기술 선택**

- React + TypeScript, 상태는 TanStack Query·Zustand
- 레포: pnpm workspace + Turborepo 모노레포. 배포 단위는 앱별로 나눔
- 번들러: 첫 단계에서 Rsbuild + Module Federation 2.0 플러그인과 Vite + @module-federation/vite 중 하나를 골라, 고른 이유를 ADR로 남김 (타입 공유 지원, 개발 서버 안정성, 문서 성숙도 비교)
- 리모트 주소는 런타임 매니페스트(JSON)에서 읽어, 호스트를 다시 빌드하지 않고도 리모트를 교체할 수 있게 함
- 배포: GitHub Actions에서 경로 필터로 바뀐 앱만 빌드하고, 앱마다 별도 정적 호스팅(Vercel 또는 Cloudflare Pages)에 배포
- 선택: Sentry 무료 플랜으로 리모트별 에러 수집과 release 태깅, Playwright E2E

**측정할 실험**

| 실험 | 하는 것 | 기록할 것 |
| --- | --- | --- |
| 독립 배포 | remote-banner-editor만 수정·배포 | 호스트 재배포 없이 반영되는지, 파이프라인 시간 |
| 장애 격리 | 리모트 하나에서 에러를 던지거나 주소를 끊기 | 호스트와 다른 리모트가 살아 있는지, 에러 경계·대체 UI 동작 |
| 공유 의존성 충돌 | 리모트 하나의 design-system 또는 React 버전을 일부러 다르게 설정 | singleton·requiredVersion 경고, 실제 깨지는 지점, 대응 전략 |
| 빌드 시간 | 전체를 한 번에 빌드할 때와 바뀐 앱만 빌드할 때 비교 | 실측 시간 (추정치 금지) |
| 타입 공유 | 리모트가 노출한 컴포넌트의 타입을 호스트에서 쓰기 | 타입 자동 생성이 되는지, 안 되면 우회 방법 |
| 빌드 타임 vs 런타임 공유 | packages/schema는 npm식 빌드 타임 공유, design-system은 런타임 공유로 두고 버전 올리기 | 반영까지 필요한 단계 수와 리스크 비교 (공통 npm 패키지 경험과 연결되는 핵심 실험) |

## 작업 순서와 산출물

주말 2번(약 4일) 안에 끝내는 것을 목표로 하고, 단계마다 README에 결과를 바로 기록합니다.

**작업 순서**

1. 번들러 선택: Rsbuild와 Vite 플러그인으로 호스트 + 리모트 1개를 각각 간단히 띄워 보고 하나를 고름 → ADR-001
2. 모노레포 뼈대: pnpm workspace, Turborepo, packages/design-system, packages/schema
3. host와 remote-content 연결, React·design-system singleton 공유, 런타임 매니페스트로 리모트 주소 로딩
4. remote-banner-editor: JSON 스키마 → 폼·미리보기 자동 생성, 스키마 검증은 packages/schema 사용
5. 에러 경계와 리모트 로딩 실패 대체 UI
6. GitHub Actions: 경로 필터로 바뀐 앱만 빌드·배포, 앱별 별도 호스팅
7. 실험 항목 수행과 측정값 기록
8. (선택) Sentry 연동, Playwright E2E
9. README 정리와 블로그 글 작성

**산출물**

- 공개 GitHub 레포 (github.com/givvemee/mfe-admin-lab 등)
- README: 구조도, 실행 방법, 실험별 측정 결과, 배포된 데모 주소
- docs/adr/: 번들러 선택, 공유 의존성 전략, 런타임 vs 빌드 타임 공유 기준
- 블로그 글: "멀티레포 공통 패키지에서 Module Federation까지, 런타임으로 나눠 보며 배운 것" 같은 흐름으로, 실무 경험과 실험 결과를 잇는 글

## 에이전트 작업 규칙

이 실험은 AI 활용 역량을 보여주는 근거로도 쓰이므로, 작업 방식도 기록으로 남깁니다.

- 구현은 Claude Code에 맡기되, 커밋 전 변경 사항은 사람이 직접 검토
- 이 기획서를 기준 문서로 삼아 구현이 기획과 다른지 검증
- 에이전트가 틀린 곳(잘못된 설정, 존재하지 않는 옵션, 버전 불일치 등)을 발견하면 docs/ai-log.md에 한 줄씩 기록
- 측정값은 실측만 기록하고, 실패한 시도와 그 이유도 남김
- Module Federation 설정 옵션은 공식 문서를 확인하고 쓸 것 (버전마다 바뀜)
