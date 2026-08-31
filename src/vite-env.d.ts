/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMBER: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_ANALYTICS_ID?: string;
  readonly VITE_INSTAGRAM_URL?: string;
  readonly VITE_SUPPORT_EMAIL?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_SENTRY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
