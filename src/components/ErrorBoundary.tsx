import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Rendered instead of the crashed subtree. */
  fallback: ReactNode;
  /** Optional label used in the console log, e.g. "PriceChart". */
  label?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Keeps one failing panel from taking down the whole page.
 * Without a boundary React unmounts the entire root on a render/effect throw,
 * which is how a single bad component turns a route into a blank page.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.label ? `: ${this.props.label}` : ''}]`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export default ErrorBoundary;
