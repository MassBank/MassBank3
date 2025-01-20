import react from '@vitejs/plugin-react';
import { defineConfig, splitVendorChunkPlugin, loadEnv } from 'vite';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

  const allowedHosts = [
    '.' + 'msbi.ipb-halle.de' + process.env.VITE_MB3_BASE_URL,
    // (process.env.VITE_MB3_FRONTEND_URL as string) +
    // process.env.VITE_MB3_BASE_URL) as string,
  ];

  console.log('allowedHosts:', allowedHosts);

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
    server: {
      allowedHosts,
    },
  });
};
