import * as Sentry from '@sentry/react';

/** No-op unless VITE_SENTRY_DSN is set, so V1 works fully without a Sentry account. */
export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    // Never send private artwork or address data — only what Sentry captures by default
    // (stack traces, breadcrumbs of clicks/navigation).
    sendDefaultPii: false,
  });
}

export function captureError(error: unknown): void {
  if (import.meta.env.DEV) {
    console.error(error);
  }
  Sentry.captureException(error);
}
