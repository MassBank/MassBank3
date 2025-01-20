import react from '@vitejs/plugin-react';
import { defineConfig, splitVendorChunkPlugin, loadEnv } from 'vite';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

  return defineConfig({
    base: process.env.VITE_MB3_BASE_URL,
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
