import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to indicate that an error has occurred
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Catch and store error and error info
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          {/* Check if errorInfo exists before rendering componentStack */}
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo?.componentStack && (
              <div>
                <strong>Stack Trace:</strong>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </div>
            )}
          </details>
        </div>
      );
    }

    // If no error has occurred, render the children
    return this.props.children;
  }
}

export default ErrorBoundary;
