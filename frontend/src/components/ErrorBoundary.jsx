import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4"
             style={{ background: '#05060f' }}>
          <div className="glass rounded-3xl p-10 max-w-md w-full text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="font-display font-extrabold text-2xl text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-pri px-6 py-2.5 rounded-xl text-sm"
            >
              Reload Page
            </button>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-out px-6 py-2.5 rounded-xl text-sm ml-3"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
