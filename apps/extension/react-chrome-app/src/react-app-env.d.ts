/// <reference types="react-scripts" />

interface ImportMetaEnv {
  readonly VITE_ENV: string;
  // thêm các biến môi trường khác ở đây nếu cần
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
