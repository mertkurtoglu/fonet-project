import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card border-danger">
                <div className="card-header bg-danger text-white">
                  <h4 className="mb-0">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Bir Hata Oluştu
                  </h4>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    Uygulama beklenmeyen bir hatayla karşılaştı. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
                  </p>
                  
                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <details className="mt-3">
                      <summary>Hata Detayları (Geliştirici Modu)</summary>
                      <pre className="mt-2 p-2 bg-light border rounded">
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                  
                  <div className="mt-3">
                    <button 
                      className="btn btn-primary me-2"
                      onClick={() => window.location.reload()}
                    >
                      Sayfayı Yenile
                    </button>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => window.history.back()}
                    >
                      Geri Dön
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
