# ADR-001: 번들러로 Rsbuild + Module Federation 2.0 플러그인을 쓴다

- 상태: 채택
- 날짜: 2026-10-27

## 맥락

기획서 1단계는 Rsbuild + `@module-federation/rsbuild-plugin`과 Vite + `@module-federation/vite` 중 하나를 고르는 것이다.
비교 기준은 타입 공유 지원, 개발 서버 안정성, 문서 성숙도였다.

## 선택지

1. **Rsbuild 2.2 + @module-federation/rsbuild-plugin 2.9** — Module Federation 팀이 직접 관리하는 플러그인. Rspack은 MF를 코어에 내장하고 있다.
2. **Vite 8.3 + @module-federation/vite 1.23** — 실무에서 Vite를 많이 써 봐서 익숙하다.

## 결정

Rsbuild + `@module-federation/rsbuild-plugin`을 쓴다.

## 근거

- **학습 가치**: Vite는 이미 실무에서 충분히 써 봤다. 이번 실험의 목적이 안 써 본 런타임 공유를 경험하는 것이므로, 번들러도 새로 써 보는 쪽을 고른다.
- **직접 확인한 것** (host + remote-content 연결 후):
  - 리모트를 `rsbuild build` 하면 `dist/@mf-types.zip`, `@mf-types.d.ts`가 추가 설정 없이 생성됐다. 타입 공유 실험의 출발점으로 쓸 수 있다.
  - `mf-manifest.json`이 기본으로 생성되고, 호스트는 `registerRemotes`로 이 주소를 런타임에 등록해 리모트를 불러온다.
  - dev 모드와 preview 모드 모두 호스트↔리모트 연결이 동작했다.
- **Vite 쪽은 직접 띄워 보지 않았다.** 기획서는 두 쪽을 모두 띄워 보는 것이었지만, 위 이유로 비교 없이 결정했다. 따라서 이 문서에 Vite와의 실측 비교는 없다.

## 결과

- 확인된 주의점 (자세한 내용은 [ai-log](../ai-log.md))
  - 프로덕션 빌드에서는 리모트의 `output.assetPrefix: 'auto'`를 명시해야 한다. 기본값이면 매니페스트 `publicPath`가 `/`가 되어 호스트 origin 기준으로 청크를 찾는다.
  - `workspace:*` 의존성은 `shared.requiredVersion`을 직접 지정해야 한다.
- 열린 문제: 동적 리모트(`remotes: {}` + `registerRemotes`) 구성에서 dev 모드일 때 `dynamic-remote-type-hints-plugin`이 `ws://127.0.0.1:16322` 연결에 실패한다. 타입 공유 실험에서 다룬다.
- 다시 볼 조건: 타입 공유나 개발 서버 안정성이 실험을 막을 정도로 문제가 되면 Vite로 같은 구성을 띄워 비교한다.
