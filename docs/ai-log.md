# AI 작업 로그

에이전트가 틀린 곳(잘못된 설정, 존재하지 않는 옵션, 버전 불일치 등)을 발견하면 한 줄씩 기록합니다.

| 날짜 | 단계 | 에이전트가 틀린 내용 | 발견 방법 | 수정 |
| --- | --- | --- | --- | --- |
| 2026-10-27 | 1. 번들러 | MF 플러그인이 publicPath를 `auto`로 잡아 준다고 보고 리모트에 `assetPrefix`를 안 넣음. 프로덕션 매니페스트 `publicPath`가 `/`가 되어 호스트가 자기 origin에서 remoteEntry를 찾다가 실패(RUNTIME-001) | headless 브라우저 확인 | 리모트에 `output.assetPrefix: 'auto'` |
| 2026-10-27 | 1. 번들러 | `@mfe/design-system`을 `workspace:*`로 두고 shared에 버전 없이 넣음. requiredVersion이 `workspace:*`로 잡혀 singleton 경고 | 브라우저 콘솔 경고 | `requiredVersion: '^0.1.0'` 명시 |
| 2026-10-27 | 1. 번들러 | dev 포트를 3000/3001로 정하면서 사용 중인 포트를 확인하지 않음. 다른 프로젝트가 3000을 쓰고 있었고, Rsbuild가 조용히 다음 포트로 넘어감 | `lsof`로 포트 확인 | 4100/4101로 변경, `strictPort: true` |
| 2026-10-27 | 1. 번들러 | 검증용 preview 서버를 `pkill -f "rsbuild preview"`로 끄려 했으나 실제 명령은 `rsbuild.js preview`라 매칭이 안 됨. 이전 서버가 남아 장애 격리 확인 결과가 틀리게 나옴 | 리모트를 껐는데도 렌더되는 것을 보고 의심 | 포트 기준(`lsof -ti`)으로 종료 후 재검증 |
| 2026-10-27 | 2. 모노레포 | zsh에서 `pnpm add @mfe/design-system@workspace:*`를 따옴표 없이 실행해 glob 에러 | 명령 실패 | 따옴표로 감쌈 |
| 2026-10-27 | 4. 배너 에디터 | 호스트의 `RemoteErrorBoundary`에 key를 주지 않음. 두 라우트의 경계가 같은 인스턴스로 재사용되어, 배너 리모트 장애 후 콘텐츠 메뉴로 가도 에러 화면이 남음 (리모트 간 장애 격리 실패) | 배너 리모트를 끄고 메뉴 이동하는 브라우저 테스트 | `key={id}` 추가 |
| 2026-10-27 | 4. 배너 에디터 | 중복 role 검증 테스트에서 이미 role이 있는 필드에 role 키를 하나 더 넣음. JSON은 뒤 키가 이겨서 중복이 안 생겼고 테스트가 잘못 실패 | 테스트 실패 원인 확인 | 기존 role 값을 바꾸는 방식으로 수정 |
