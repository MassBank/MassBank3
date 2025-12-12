import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default () => {
  return defineConfig({
    base: '',
    plugins: [react()],
    ssr: {
      noExternal: [
        'antd',
        '@ant-design/cssinjs',
        '@ant-design/icons',
        /^rc-.*/, // All rc-* packages used by antd
        /^@rc-component\/.*/, // All @rc-component/* packages used by antd
      ],
    },
  });
};
