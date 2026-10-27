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
    <RemoteErrorBoundary name={id}>
      <Suspense fallback={<p>불러오는 중…</p>}>
        <Component />
      </Suspense>
    </RemoteErrorBoundary>
  );
}
