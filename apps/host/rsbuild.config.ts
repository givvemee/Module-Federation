import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  server: {
    port: 4100,
    strictPort: true,
    historyApiFallback: true,
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'host',
      // 리모트 주소는 빌드에 넣지 않고 public/remotes.json에서 런타임에 등록한다.
      remotes: {},
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        // workspace:* 는 semver가 아니라서 requiredVersion을 직접 지정한다.
        '@mfe/design-system': { singleton: true, requiredVersion: '^0.1.0' },
      },
    }),
  ],
});
