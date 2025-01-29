/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MB3_API_URL: string;
  readonly VITE_MB3_FRONTEND_URL: string;
  readonly VITE_MB3_BASE_URL: string;
  readonly VITE_MB3_VERSION: string;
  readonly VITE_EXPORT_SERVICE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
