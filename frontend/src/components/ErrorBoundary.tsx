import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Renders a readable message instead of an empty document when a descendant
 * throws during render. Without this, any runtime error unmounts the tree and
 * leaves a blank white page with no clue as to the cause — which is especially
 * opaque on mobile, where there is no easy console to check.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, { message: string | null }> {
  state = { message: null as string | null };

  static getDerivedStateFromError(error: unknown) {
    return { message: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[apna] render error", error, info.componentStack);
  }

  render() {
    if (this.state.message === null) return this.props.children;
    return (
      <div role="alert" className="app-error">
        <h1>Something went wrong</h1>
        <p>The page failed to load. Reloading may fix it.</p>
        <pre>{this.state.message}</pre>
        <button type="button" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </div>
    );
  }
}
