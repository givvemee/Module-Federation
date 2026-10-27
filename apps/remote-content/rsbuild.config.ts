import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  server: {
    port: 4101,
    strictPort: true,
    cors: { origin: ['http://localhost:4100'] },
  },
  output: {
    // 기본값('/')이면 매니페스트 publicPath가 '/'가 되어 호스트 origin 기준으로 청크를 찾는다.
    assetPrefix: 'auto',
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'remote_content',
      exposes: {
        './ContentPage': './src/ContentPage.tsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        // workspace:* 는 semver가 아니라서 requiredVersion을 직접 지정한다.
        '@mfe/design-system': { singleton: true, requiredVersion: '^0.1.0' },
      },
    }),
  ],
});
