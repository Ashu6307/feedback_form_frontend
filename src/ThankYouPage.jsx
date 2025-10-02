import React, { useEffect, useState } from 'react';

const ThankYouPage = () => {
  const [submissionData, setSubmissionData] = useState(null);
  const [lang, setLang] = useState('hinglish');

  // Language configurations
  const languages = {
    english: {
      title: 'Thank You',
      subtitle: 'Your feedback has been successfully submitted!',
      confirmationTitle: 'Submission Confirmed',
      reviewMessage: 'We\'ll review your feedback within 24 hours',
      appreciationMessage: 'Thank you for helping us build a better platform!',
      valueMessage: 'Your input is valuable to us.',
      formType: {
        user: 'Room Seeker Feedback',
        owner: 'Property Owner Feedback'
      },
      submittedAt: 'Submitted'
    },
    hindi: {
      title: 'धन्यवाद',
      subtitle: 'आपका फीडबैक सफलतापूर्वक सबमिट हो गया है!',
      confirmationTitle: 'सबमिशन कन्फर्म',
      reviewMessage: 'हम 24 घंटे के भीतर आपके फीडबैक की समीक्षा करेंगे',
      appreciationMessage: 'बेहतर प्लेटफॉर्म बनाने में हमारी मदद के लिए धन्यवाद!',
      valueMessage: 'आपका इनपुट हमारे लिए बहुत महत्वपूर्ण है।',
      formType: {
        user: 'रूम सीकर फीडबैक',
        owner: 'प्रॉपर्टी ओनर फीडबैक'
      },
      submittedAt: 'सबमिट किया गया'
    },
    hinglish: {
      title: 'Thank You',
      subtitle: 'Aapka feedback successfully submit ho gaya hai!',
      confirmationTitle: 'Submission Confirm',
      reviewMessage: 'Hum 24 ghante ke andar aapke feedback ko review karenge',
      appreciationMessage: 'Better platform banane mein humari madad ke liye thank you!',
      valueMessage: 'Aapka input humare liye bahut valuable hai.',
      formType: {
        user: 'Room Seeker Feedback',
        owner: 'Property Owner Feedback'
      },
      submittedAt: 'Submit kiya gaya'
    }
  };

  const currentLang = languages[lang];

  useEffect(() => {
    // Get submission data from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const type = urlParams.get('type') || 'user';
    const language = urlParams.get('lang') || 'hinglish';
    
    setLang(language);
    
    // Set submission data
    setSubmissionData({
      name: name || 'User',
      type: type,
      timestamp: new Date().toLocaleString()
    });

    // Prevent back navigation
    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', handleBackButton);
    
    // Clean up localStorage
    localStorage.removeItem('userFeedbackForm');
    localStorage.removeItem('userFeedbackStep');
    localStorage.removeItem('userFeedbackLastSaved');
    localStorage.removeItem('ownerFeedbackForm');
    localStorage.removeItem('ownerFeedbackStep');
    localStorage.removeItem('ownerFeedbackLastSaved');

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  const handleBackButton = (event) => {
    // Prevent back navigation
    window.history.pushState(null, null, window.location.href);
  };

  if (!submissionData) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          color: 'white',
          fontSize: '18px'
        }}>
          Loading...
        </div>
      </div>
    );
  }

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
      {/* Language Selector */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '8px',
        zIndex: 1000
      }}>
        {['english', 'hindi', 'hinglish'].map(language => (
          <button
            key={language}
            onClick={() => setLang(language)}
            style={{
              padding: '8px 16px',
              borderRadius: '25px',
              border: 'none',
              background: lang === language ? '#fff' : 'rgba(255,255,255,0.2)',
              color: lang === language ? '#667eea' : '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
          >
            {language === 'english' ? 'EN' : language === 'hindi' ? 'हिं' : 'HI'}
          </button>
        ))}
      </div>

      {/* Main Success Card */}
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        padding: '60px 40px',
        textAlign: 'center',
        animation: 'slideUp 0.6s ease-out'
      }}>
        {/* Success Animation */}
        <div style={{
          fontSize: '80px',
          marginBottom: '24px',
          animation: 'bounce 1s ease-in-out'
        }}>
          🎉
        </div>

        {/* Main Title */}
        <h1 style={{
          fontSize: window.innerWidth <= 768 ? '32px' : '40px',
          fontWeight: '700',
          margin: '0 0 16px 0',
          color: '#1e293b',
          letterSpacing: '-0.5px'
        }}>
          {currentLang.title} {submissionData.name}!
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '18px',
          color: '#64748b',
          margin: '0 0 40px 0',
          lineHeight: '1.6'
        }}>
          {currentLang.subtitle}
        </p>

        {/* Success Checkmark */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
          marginBottom: '32px',
          animation: 'scaleUp 0.5s ease-out 0.3s both'
        }}>
          <span style={{
            fontSize: '28px',
            color: 'white'
          }}>
            ✓
          </span>
        </div>

        {/* Confirmation Section */}
        <div style={{
          background: '#f8faff',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          textAlign: 'left'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 16px 0',
            textAlign: 'center'
          }}>
            ✅ {currentLang.confirmationTitle}
          </h3>
          
          <div style={{
            display: 'grid',
            gap: '8px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#64748b', fontSize: '14px' }}>Form Type:</span>
              <span style={{ color: '#1e293b', fontWeight: '500', fontSize: '14px' }}>
                {currentLang.formType[submissionData.type]}
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#64748b', fontSize: '14px' }}>{currentLang.submittedAt}:</span>
              <span style={{ color: '#1e293b', fontWeight: '500', fontSize: '14px' }}>
                {submissionData.timestamp}
              </span>
            </div>
          </div>
        </div>

        {/* Review Message */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '32px'
        }}>
          <p style={{
            fontSize: '16px',
            color: '#667eea',
            margin: '0 0 12px 0',
            fontWeight: '500'
          }}>
            📧 {currentLang.reviewMessage}
          </p>
        </div>

        {/* Appreciation Message */}
        <div style={{
          borderTop: '1px solid #e2e8f0',
          paddingTop: '24px'
        }}>
          <p style={{
            fontSize: '16px',
            color: '#1e293b',
            margin: '0 0 8px 0',
            fontWeight: '500'
          }}>
            {currentLang.appreciationMessage}
          </p>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>
            {currentLang.valueMessage}
          </p>
        </div>

        {/* Decorative Elements */}
        <div style={{
          marginTop: '32px',
          display: 'flex',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#667eea',
            animation: 'pulse 2s ease-in-out infinite'
          }} />
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#764ba2',
            animation: 'pulse 2s ease-in-out infinite 0.2s'
          }} />
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#667eea',
            animation: 'pulse 2s ease-in-out infinite 0.4s'
          }} />
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(40px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes scaleUp {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.8);
          }
        }

        /* Disable text selection for cleaner look */
        * {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
    </div>
  );
};

export default ThankYouPage;