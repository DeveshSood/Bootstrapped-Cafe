import React from 'react';
import ErrorPage from '../../pages/ErrorPage';

/**
 * ErrorBoundary — Catches unhandled React render errors and shows
 * a themed error page instead of a white screen.
 *
 * Must be a class component (React doesn't support error boundaries with hooks).
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          statusCode={500}
          title="Something broke"
          message="An unexpected error occurred while loading this page. Please try refreshing, or head back to the home page."
          error={this.state.error}
          showDetails={import.meta.env.DEV}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
