import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('Component error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2 style={{ color: '#F2B12D', marginBottom: 12 }}>Something went wrong</h2>
          <p style={{ color: '#666', marginBottom: 20 }}>{this.state.error?.message}</p>
          <button onClick={() => window.history.back()}
            style={{ background: '#F2B12D', color: '#111', border: 'none', padding: '10px 24px', cursor: 'pointer', fontWeight: 'bold' }}>
            Go Back
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
