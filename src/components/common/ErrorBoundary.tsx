import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { buttonClasses } from '@/components/common/Button';
import { captureError } from '@/services/monitoring/sentry';

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { hasError: boolean };

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    captureError(error);
    if (import.meta.env.DEV) {
      console.error(info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
          <p className="text-lg font-semibold text-ink">Something went wrong.</p>
          <p className="max-w-sm text-sm text-muted">
            Please refresh the page. If the problem continues, contact AYUM.
          </p>
          <button type="button" onClick={() => window.location.assign('/')} className={buttonClasses('primary', 'md')}>
            Back to AYUM
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
