import react from '@vitejs/plugin-react';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';

export default () => {
  return defineConfig({
    css: {
      modules: { localsConvention: 'camelCase' },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
    build: {
      sourcemap: true,
    },
    plugins: [react(), splitVendorChunkPlugin()],
  });
};
