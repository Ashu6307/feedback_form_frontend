import React, { useState, useEffect } from 'react';

// Professional Home Page Component - Feedback System
const HomePage = ({ onNavigate, lang, setLang }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const content = {
    english: {
      title: "PG & Room Rental",
      subtitle: "Feedback System",
      description: "Help us improve your experience by sharing your valuable feedback",
      ownerTitle: "Property Owner",
      ownerDesc: "Share your experience as a property owner and help us build a better platform for landlords",
      userTitle: "Room Seeker",
      userDesc: "Tell us about your room searching journey and help us improve our services",
      ownerButton: "Owner Feedback",
      userButton: "User Feedback",
      features: [
        "🏠 Property Management Experience",
        "📱 Easy Feedback System",
        "⭐ Help Us Improve",
        "🔒 Secure & Anonymous"
      ],
      poweredBy: "Powered by PG & Room Rental Platform"
    },
    hindi: {
      title: "पीजी और रूम रेंटल",
      subtitle: "फीडबैक सिस्टम",
      description: "अपनी बहुमूल्य राय साझा करके हमारी सेवा को बेहतर बनाने में मदद करें",
      ownerTitle: "संपत्ति मालिक",
      ownerDesc: "संपत्ति मालिक के रूप में अपना अनुभव साझा करें और मकान मालिकों के लिए एक बेहतर प्लेटफॉर्म बनाने में मदद करें",
      userTitle: "रूम खोजने वाले",
      userDesc: "अपनी रूम खोजने की यात्रा के बारे में बताएं और हमारी सेवाओं को बेहतर बनाने में मदद करें",
      ownerButton: "मालिक फीडबैक",
      userButton: "यूज़र फीडबैक",
      features: [
        "🏠 संपत्ति प्रबंधन अनुभव",
        "📱 आसान फीडबैक सिस्टम",
        "⭐ हमें बेहतर बनाने में मदद करें",
        "🔒 सुरक्षित और गुमनाम"
      ],
      poweredBy: "पीजी और रूम रेंटल प्लेटफॉर्म द्वारा संचालित"
    },
    hinglish: {
      title: "PG & Room Rental",
      subtitle: "Feedback System",
      description: "Apni valuable feedback share karke humari service ko better banane me help kare",
      ownerTitle: "Property Owner",
      ownerDesc: "Property owner ke roop me apna experience share kare aur landlords ke liye better platform banane me help kare",
      userTitle: "Room Seeker",
      userDesc: "Apni room searching journey ke baare me bataye aur humari services ko improve karne me help kare",
      ownerButton: "Owner Feedback",
      userButton: "User Feedback",
      features: [
        "🏠 Property Management Experience",
        "📱 Easy Feedback System",
        "⭐ Help Us Improve Kare",
        "🔒 Secure & Anonymous"
      ],
      poweredBy: "Powered by PG & Room Rental Platform"
    }
  };

  const currentContent = content[lang] || content.hinglish;

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
        top: window.innerWidth <= 768 ? '15px' : '20px',
        right: window.innerWidth <= 768 ? '15px' : '20px',
        display: 'flex',
        gap: window.innerWidth <= 768 ? '3px' : '8px',
        zIndex: 1000
      }}>
        {['english', 'hindi', 'hinglish'].map(language => (
          <button
            key={language}
            onClick={() => setLang(language)}
            style={{
              padding: window.innerWidth <= 768 ? '6px 12px' : '8px 16px',
              borderRadius: '25px',
              border: 'none',
              background: lang === language ? '#fff' : 'rgba(255,255,255,0.2)',
              color: lang === language ? '#667eea' : '#fff',
              cursor: 'pointer',
              fontSize: window.innerWidth <= 768 ? '12px' : '14px',
              fontWeight: '500',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
          >
            {language === 'english' ? 'EN' : language === 'hindi' ? 'हिं' : 'HI'}
          </button>
        ))}
      </div>

      {/* Main Container */}
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        padding: window.innerWidth <= 768 ? '70px 20px 0' : '0 20px'
      }}>
        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          animation: animate ? 'slideUp 0.8s ease-out' : 'none'
        }}>
          {/* Brand Logo Area */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '15px',
              boxShadow: '0 8px 32px rgba(255,255,255,0.3)'
            }}>
              <span style={{ fontSize: '28px' }}>🏠</span>
            </div>
            <div>
              <h1 style={{
                fontSize: window.innerWidth <= 768 ? '28px' : '36px',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}>
                {currentContent.title}
              </h1>
              <p style={{
                fontSize: '18px',
                color: 'rgba(255,255,255,0.9)',
                margin: '0',
                fontWeight: '500'
              }}>
                {currentContent.subtitle}
              </p>
            </div>
          </div>

          <p style={{
            fontSize: window.innerWidth <= 768 ? '16px' : '18px',
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            {currentContent.description}
          </p>
        </div>

        {/* Main Selection Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr',
          gap: '30px',
          marginBottom: '50px'
        }}>
          {/* Owner Card */}
          <div 
            onClick={() => onNavigate('owner')}
            style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '20px',
              padding: '40px 30px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              animation: animate ? 'slideUp 1s ease-out 0.2s both' : 'none',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-10px)';
              e.target.style.boxShadow = '0 30px 60px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
            }}
          >
            {/* Gradient Overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              borderRadius: '20px 20px 0 0'
            }}></div>

            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 25px',
              boxShadow: '0 10px 30px rgba(102,126,234,0.3)'
            }}>
              <span style={{ fontSize: '36px', color: 'white' }}>🏢</span>
            </div>

            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#2d3748',
              marginBottom: '15px'
            }}>
              {currentContent.ownerTitle}
            </h3>

            <p style={{
              fontSize: '16px',
              color: '#4a5568',
              lineHeight: '1.6',
              marginBottom: '30px'
            }}>
              {currentContent.ownerDesc}
            </p>

            <button style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(102,126,234,0.3)',
              width: '100%'
            }}>
              {currentContent.ownerButton}
            </button>
          </div>

          {/* User Card */}
          <div 
            onClick={() => onNavigate('user')}
            style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '20px',
              padding: '40px 30px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              animation: animate ? 'slideUp 1s ease-out 0.4s both' : 'none',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-10px)';
              e.target.style.boxShadow = '0 30px 60px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
            }}
          >
            {/* Gradient Overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #764ba2, #667eea)',
              borderRadius: '20px 20px 0 0'
            }}></div>

            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 25px',
              boxShadow: '0 10px 30px rgba(118,75,162,0.3)'
            }}>
              <span style={{ fontSize: '36px', color: 'white' }}>👤</span>
            </div>

            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#2d3748',
              marginBottom: '15px'
            }}>
              {currentContent.userTitle}
            </h3>

            <p style={{
              fontSize: '16px',
              color: '#4a5568',
              lineHeight: '1.6',
              marginBottom: '30px'
            }}>
              {currentContent.userDesc}
            </p>

            <button style={{
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(118,75,162,0.3)',
              width: '100%'
            }}>
              {currentContent.userButton}
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '30px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          animation: animate ? 'slideUp 1s ease-out 0.6s both' : 'none',
          marginBottom: '30px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(2, 1fr)',
            gap: '20px'
          }}>
            {currentContent.features.map((feature, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                fontSize: '16px',
                fontWeight: '500'
              }}>
                <span style={{
                  marginRight: '12px',
                  fontSize: '18px'
                }}>
                  {feature.split(' ')[0]}
                </span>
                <span>{feature.substring(feature.indexOf(' ') + 1)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.8)',
          fontSize: '14px',
          animation: animate ? 'slideUp 1s ease-out 0.8s both' : 'none'
        }}>
          {currentContent.poweredBy}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          * {
            animation-duration: 0.6s !important;
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

export default HomePage;