import { loadRemote } from '@module-federation/enhanced/runtime';
import { lazy, Suspense, type ComponentType } from 'react';
import { RemoteErrorBoundary } from './RemoteErrorBoundary';

const cache = new Map<string, ComponentType>();

function getRemoteComponent(id: string) {
  let component = cache.get(id);
  if (!component) {
    component = lazy(async () => {
      const mod = await loadRemote<{ default: ComponentType }>(id);
      if (!mod) throw new Error(`리모트 모듈이 비어 있습니다: ${id}`);
      return mod;
    });
    cache.set(id, component);
  }
  return component;
}

/** id 예: "remote_content/ContentPage" */
export function RemoteModule({ id }: { id: string }) {
  const Component = getRemoteComponent(id);
  return (
    // key가 없으면 라우트가 바뀌어도 같은 경계 인스턴스가 재사용되어, 한 리모트의 에러 상태가 다른 리모트 화면까지 가린다.
    <RemoteErrorBoundary key={id} name={id}>
      <Suspense fallback={<p>불러오는 중…</p>}>
        <Component />
      </Suspense>
    </RemoteErrorBoundary>
  );
}
