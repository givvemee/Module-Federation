import { registerRemotes } from '@module-federation/enhanced/runtime';

export type RemoteManifest = Record<string, string>;

/** 런타임 매니페스트를 읽어 리모트를 등록한다. 호스트 재빌드 없이 리모트 주소를 바꿀 수 있다. */
export async function registerRemotesFromManifest(url = '/remotes.json'): Promise<RemoteManifest> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`리모트 매니페스트를 불러오지 못했습니다: ${res.status}`);
  const manifest = (await res.json()) as RemoteManifest;
  registerRemotes(Object.entries(manifest).map(([name, entry]) => ({ name, entry })));
  return manifest;
}
