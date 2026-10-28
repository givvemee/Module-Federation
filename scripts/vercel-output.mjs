// apps/<app>/dist를 Vercel Build Output API v3 형식(apps/<app>/.vercel/output)으로 바꾼다.
// CI에서 turbo로 빌드한 결과를 `vercel deploy --prebuilt`로 그대로 올리기 위한 단계.
// https://vercel.com/docs/build-output-api/v3
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const APPS = {
  host: { kind: 'host' },
  'remote-content': { kind: 'remote' },
  'remote-banner-editor': { kind: 'remote' },
};

const app = process.argv[2];
if (!APPS[app]) {
  console.error(`사용법: node scripts/vercel-output.mjs <${Object.keys(APPS).join('|')}>`);
  process.exit(1);
}

const appDir = join('apps', app);
const dist = join(appDir, 'dist');
const output = join(appDir, '.vercel', 'output');
if (!existsSync(dist)) {
  console.error(`${dist}가 없습니다. 먼저 빌드하세요.`);
  process.exit(1);
}

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
cpSync(dist, join(output, 'static'), { recursive: true });

const routes = [
  // 매니페스트는 배포 즉시 반영돼야 하므로 캐시하지 않는다.
  { src: '/(mf-manifest\\.json|mf-stats\\.json|remotes\\.json)', headers: { 'cache-control': 'no-cache' }, continue: true },
  // 파일명에 해시가 붙는 청크는 오래 캐시한다.
  { src: '/static/(.*)', headers: { 'cache-control': 'public, max-age=31536000, immutable' }, continue: true },
];

if (APPS[app].kind === 'host') {
  // 운영용 리모트 주소로 교체한다. 로컬 개발은 public/remotes.json(localhost)을 쓴다.
  cpSync(join(appDir, 'remotes.production.json'), join(output, 'static', 'remotes.json'));
  routes.push({ handle: 'filesystem' }, { src: '/(.*)', dest: '/index.html' });
} else {
  const hostOrigin = process.env.HOST_ORIGIN;
  if (!hostOrigin) {
    console.error('리모트 배포에는 HOST_ORIGIN 환경 변수가 필요합니다 (예: https://mfe-admin-host.vercel.app)');
    process.exit(1);
  }
  routes.push({
    src: '/(.*)',
    headers: { 'access-control-allow-origin': hostOrigin, vary: 'Origin' },
    continue: true,
  });
}

writeFileSync(join(output, 'config.json'), `${JSON.stringify({ version: 3, routes }, null, 2)}\n`);
console.log(`${output} 생성 완료 (${APPS[app].kind})`);
