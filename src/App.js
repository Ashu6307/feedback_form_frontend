import './App.css';
import { useState, useEffect } from 'react';
import AdvancedOwnerFeedbackForm from './AdvancedOwnerFeedbackForm';
import AdvancedUserFeedbackForm from './AdvancedUserFeedbackForm';
import ModernAdminDashboard from './ModernAdminDashboard';
import ThankYouPage from './ThankYouPage';
import HomePage from './HomePage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [page, setPage] = useState('home');
  const [lang, setLang] = useState('hinglish');
  
  // Simple URL-based routing
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/thank-you') {
      setPage('thank-you');
    } else if (path === '/user') {
      setPage('user');
    } else if (path === '/owner') {
      setPage('owner');
    } else if (path === '/admin-dashboard-secure-access') {
      // Admin access only through secure URL
      setPage('admin');
    } else {
      setPage('home'); // default to home page
    }
  }, []);
  
  // Handle navigation
  const handleNavigation = (newPage) => {
    setPage(newPage);
    let urlPath;
    if (newPage === 'home') {
      urlPath = '/';
    } else if (newPage === 'admin') {
      urlPath = '/admin-dashboard-secure-access';
    } else {
      urlPath = `/${newPage}`;
    }
    window.history.pushState({}, '', urlPath);
  };
  
  return (
    <ErrorBoundary lang={lang}>
      <div className="App">
        {/* Show navigation only on feedback forms and admin page, hide on home and thank you */}
        {(page === 'user' || page === 'owner') && (
          <nav style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: 1000,
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '25px',
            padding: '10px 20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <button 
              onClick={()=>handleNavigation('home')}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              🏠 Home
            </button>
          </nav>
        )}
        
        {/* Admin navigation - only visible on admin page */}
        {page === 'admin' && (
          <nav style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: 1000,
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '25px',
            padding: '10px 20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '2px solid rgba(220,38,38,0.2)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '15px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                🔒 ADMIN PANEL
              </span>
              <button 
                onClick={()=>handleNavigation('home')}
                style={{
                  background: 'rgba(220,38,38,0.1)',
                  color: '#dc2626',
                  border: '1px solid rgba(220,38,38,0.3)',
                  padding: '6px 12px',
                  borderRadius: '15px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Exit Admin
              </button>
            </div>
          </nav>
        )}
        
        {page === 'home' && <HomePage onNavigate={handleNavigation} lang={lang} setLang={setLang} />}
        {page === 'owner' && <AdvancedOwnerFeedbackForm />}
        {page === 'user' && <AdvancedUserFeedbackForm />}
        {page === 'admin' && <ModernAdminDashboard />}
        {page === 'thank-you' && <ThankYouPage />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
