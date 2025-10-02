import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log to console for development
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // In production, you might want to log this to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { lang = 'hinglish' } = this.props;
      
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontFamily: 'Inter, system-ui, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            maxWidth: '500px',
            width: '100%'
          }}>
            {/* Error Icon */}
            <div style={{ 
              fontSize: '80px', 
              marginBottom: '20px',
              animation: 'pulse 2s infinite'
            }}>
              🚫
            </div>

            {/* Error Title */}
            <h1 style={{ 
              color: '#e53e3e', 
              marginBottom: '16px',
              fontSize: '24px',
              fontWeight: '600'
            }}>
              {lang === 'hindi' ? 'कुछ गलत हुआ!' : 
               lang === 'hinglish' ? 'Kuch Galat Hua!' : 
               'Something Went Wrong!'}
            </h1>

            {/* Error Message */}
            <p style={{ 
              color: '#666', 
              marginBottom: '24px',
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              {lang === 'hindi' ? 
                'फॉर्म में कोई तकनीकी समस्या आई है। हम इसे ठीक करने की कोशिश कर रहे हैं।' : 
               lang === 'hinglish' ? 
                'Form me koi technical problem aa gayi hai. Hum isko theek karne ki koshish kar rahe hain.' : 
                'A technical problem occurred with the form. We are working to fix this issue.'}
            </p>

            {/* Retry Count Info */}
            {this.state.retryCount > 0 && (
              <p style={{ 
                color: '#718096', 
                fontSize: '14px',
                marginBottom: '20px'
              }}>
                {lang === 'hindi' ? `पुनः प्रयास: ${this.state.retryCount}` : 
                 lang === 'hinglish' ? `Retry attempts: ${this.state.retryCount}` : 
                 `Retry attempts: ${this.state.retryCount}`}
              </p>
            )}

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={this.handleRetry}
                style={{
                  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                {lang === 'hindi' ? '🔄 दोबारा कोशिश करें' : 
                 lang === 'hinglish' ? '🔄 Dobara Try Karein' : 
                 '🔄 Try Again'}
              </button>

              <button
                onClick={this.handleReload}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                {lang === 'hindi' ? '↻ पेज रीलोड करें' : 
                 lang === 'hinglish' ? '↻ Page Reload Karein' : 
                 '↻ Reload Page'}
              </button>
            </div>

            {/* Error Details (Development Mode) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ 
                marginTop: '24px', 
                textAlign: 'left',
                background: '#f7fafc',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '14px'
              }}>
                <summary style={{ 
                  cursor: 'pointer', 
                  fontWeight: '500',
                  color: '#e53e3e',
                  marginBottom: '8px'
                }}>
                  🐛 Technical Details (Dev Mode)
                </summary>
                <pre style={{ 
                  fontSize: '12px', 
                  overflow: 'auto',
                  background: 'white',
                  padding: '12px',
                  borderRadius: '4px',
                  border: '1px solid #e2e8f0'
                }}>
                  <strong>Error:</strong> {this.state.error.toString()}
                  {'\n\n'}
                  <strong>Stack Trace:</strong> {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            {/* Support Message */}
            <div style={{ 
              marginTop: '24px',
              padding: '16px',
              background: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#4a5568'
            }}>
              <p>
                {lang === 'hindi' ? 
                  '📧 अगर समस्या बनी रहे तो कृपया हमसे संपर्क करें।' : 
                 lang === 'hinglish' ? 
                  '📧 Agar problem bani rahe to please hamse contact karein.' : 
                  '📧 If the problem persists, please contact our support team.'}
              </p>
            </div>

            <style>{`
              @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
              }
            `}</style>
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;