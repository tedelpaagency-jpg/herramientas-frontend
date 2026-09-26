/// <reference types="vite/client" />

declare module '*.css';
declare module 'react-quill/dist/quill.snow.css';

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly NEXT_PUBLIC_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
