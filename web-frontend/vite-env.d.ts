/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MB3_API_URL: string;
  readonly VITE_MB3_FRONTEND_URL: string;
  readonly VITE_MB3_BASE_URL: string;
}

// eslint-disable-next-line no-unused-vars
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
