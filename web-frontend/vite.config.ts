import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default () => {
  return defineConfig({
    base: '',
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: /^@ant-design\/icons$/,
          replacement: '@ant-design/icons/es',
        },
      ],
    },
    ssr: {
      noExternal: [
        'antd',
        '@ant-design/cssinjs',
        '@ant-design/icons',
        '@ant-design/icons-svg',
        '@ant-design/colors',
        /^rc-.*/, // All rc-* packages used by antd
        /^@rc-component\/.*/, // All @rc-component/* packages used by antd
      ],
    },
  });
};
