import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-mark">§</div>
          <h1>Something went wrong</h1>
          <p>
            The interface hit an unexpected error. Your backend and data are
            unaffected — reloading the page usually fixes this.
          </p>
          {this.state.error && (
            <pre className="error-boundary-detail">
              {String(this.state.error.message || this.state.error)}
            </pre>
          )}
          <button className="run-btn" onClick={this.handleReload} type="button">
            reload app
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}