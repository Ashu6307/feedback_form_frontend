import React, { useState, useEffect, useCallback } from 'react';
import {
  filterNameInput,
  getNormalizedMobile,
  getMobileValidationError,
  getEmailValidationError,
  validateName,
  validateFormField
} from './utils/validations.js';

// Advanced User Feedback Form - Complete redesign
const AdvancedUserFeedbackForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [lang, setLang] = useState('hinglish');
  
  // Option mapping system - each option has a unique ID
  const optionMappings = {
    currentSituation: {
      'LOOKING_ACTIVE': { 
        english: 'Looking for PG actively',
        hindi: 'सक्रिय रूप से पीजी की तलाश में',
        hinglish: 'Actively PG dhundh rahe hain'
      },
      'LOOKING_CASUAL': {
        english: 'Looking for PG but not urgently',
        hindi: 'पीजी की तलाश है लेकिन जल्दी नहीं',
        hinglish: 'PG dhundh rahe hain lekin urgent nahi'
      },
      'NEED_SWITCH': {
        english: 'Need to switch current PG',
        hindi: 'वर्तमान पीजी बदलना चाहते हैं',
        hinglish: 'Current PG change karna hai'
      },
      'HAPPY_CURRENT': {
        english: 'Happy with current PG',
        hindi: 'वर्तमान पीजी से खुश हैं',
        hinglish: 'Current PG se khush hain'
      },
      'OTHER': {
        english: 'Other',
        hindi: 'अन्य',
        hinglish: 'Other'
      }
    },
    painPoints: {
      'HIGH_RENT': {
        english: 'High rent prices',
        hindi: 'अधिक किराया',
        hinglish: 'Zyada rent'
      },
      'POOR_FACILITIES': {
        english: 'Poor facilities',
        hindi: 'खराब सुविधाएं',
        hinglish: 'Kharab facilities'
      },
      'BAD_FOOD': {
        english: 'Bad food quality',
        hindi: 'खराब खाना',
        hinglish: 'Kharab khana'
      },
      'SAFETY_CONCERNS': {
        english: 'Safety concerns',
        hindi: 'सुरक्षा की चिंता',
        hinglish: 'Safety ki problem'
      },
      'LIMITED_OPTIONS': {
        english: 'Limited options available',
        hindi: 'सीमित विकल्प',
        hinglish: 'Limited options'
      },
      'LOCATION_ISSUES': {
        english: 'Location problems',
        hindi: 'स्थान की समस्या',
        hinglish: 'Location ki problem'
      },
      'OTHER': {
        english: 'Other',
        hindi: 'अन्य',
        hinglish: 'Other'
      }
    },
    features: {
      'MEAL_PLANS': {
        english: 'Flexible meal plans',
        hindi: 'लचीली भोजन योजना',
        hinglish: 'Flexible meal plans'
      },
      'HOUSEKEEPING': {
        english: 'Daily housekeeping',
        hindi: 'दैनिक सफाई',
        hinglish: 'Daily safai'
      },
      'LAUNDRY': {
        english: 'Laundry service',
        hindi: 'कपड़े धोने की सेवा',
        hinglish: 'Laundry service'
      },
      'WIFI': {
        english: 'High-speed WiFi',
        hindi: 'तेज़ इंटरनेट',
        hinglish: 'Fast internet'
      },
      'SECURITY': {
        english: '24/7 Security',
        hindi: '24/7 सुरक्षा',
        hinglish: '24/7 security'
      },
      'AC_ROOMS': {
        english: 'AC rooms',
        hindi: 'एसी कमरे',
        hinglish: 'AC rooms'
      },
      'PARKING': {
        english: 'Parking facility',
        hindi: 'पार्किंग सुविधा',
        hinglish: 'Parking facility'
      },
      'COMMON_AREAS': {
        english: 'Common areas',
        hindi: 'सामान्य क्षेत्र',
        hinglish: 'Common areas'
      },
      'OTHER': {
        english: 'Other',
        hindi: 'अन्य',
        hinglish: 'Other'
      }
    }
  };

  // Form state stores option IDs instead of text values
  const [form, setForm] = useState({
    // Profile
    name: '',
    email: '',
    phone: '',
    city: '',
    otherCity: '',
    occupation: '',
    budget: '',
    
    // Current Situation - store ID
    currentSituation: '',
    otherCurrentSituation: '',
    
    // Pain Points - store IDs in array
    mainProblems: [],
    otherMainProblem: '',
    
    // Platform Features - store IDs in array
    importantFeatures: [],
    otherFeature: '',
    
    // Success Metrics
    willingToPay: '',
    recommendation: 5,
    urgency: '',
    
    // Analytics
    formStartTime: Date.now()
  });

  const [errors, setErrors] = useState({});
  
  // Enhanced UX States
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(''); // 'success', 'error', ''
  const [stepLoading, setStepLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [submissionInfo, setSubmissionInfo] = useState(null);

  // Language configurations
  const languages = {
    english: {
      title: '👤 Platform Feedback - PG/Room Seeker',
      subtitle: 'Help us create the perfect room hunting experience for you',
      steps: ['👤 Profile', '🏠 Current', '⚡ Problems', '💎 Features', '📊 Success'],
      
      // Step 1: Profile
      profile: {
        title: 'Quick Profile Setup',
        subtitle: 'Tell us about yourself (30 seconds)',
        name: 'Full Name *',
        email: 'Email Address *',
        phone: 'Phone Number *',
        city: 'Current City *',
        occupation: 'Occupation *',
        occupationOptions: [
          'Select your occupation',
          '🎓 Student',
          '💼 Working Professional',
          '🔧 Other'
        ],
        budget: 'Monthly Budget Range *',
        budgetOptions: [
          'Select budget range',
          '₹5,000-10,000',
          '₹10,000-15,000',
        ]
      },
      
      // Step 2: Current Situation
      currentSituation: {
        title: 'What\'s Your Current Housing Situation?',
        subtitle: 'Help us understand your needs better',
        options: [
          '🏠 Living with family, looking to move out',
          '🏢 Currently in PG, want to switch',
          '🏠 In shared flat/room, want to change',
          '🎒 New to city, need accommodation',
          '🔄 Relocating for job/studies',
          '⏰ Current place lease ending soon',
          '📝 Other'
        ]
      },
      
      // Step 3: Pain Points
      painPoints: {
        title: 'What Are Your BIGGEST Problems While Searching?',
        subtitle: 'Select all that frustrate you the most',
        options: [
          '🔍 Can\'t find verified/genuine listings',
          '💰 Hidden charges and broker fees',
          '⏰ Wasting time visiting fake properties',
          '📞 Dealing with unresponsive owners',
          '🏠 Properties don\'t match online descriptions',
          '📋 Complicated documentation process',
          '💸 Advance payment without guarantees',
          '🚫 Limited options in preferred areas',
          '📝 Other problem'
        ]
      },
      
      // Step 4: Platform Features
      features: {
        title: 'Most Important Features for Your Search',
        subtitle: 'Select minimum 4, maximum 8 must-have features',
        options: [
          '✅ Verified property photos & details',
          '🔍 Advanced filters (budget, location, amenities)',
          '📱 Virtual tours/video calls with owners',
          '💳 Secure online booking & payments',
          '⭐ Genuine reviews from previous tenants',
          '📍 Exact location & nearby facilities info',
          '🤝 Direct communication with owners',
          '📋 Zero brokerage guarantees',
          '⚡ Instant booking confirmation',
          '🛡️ Deposit protection & refund guarantees',
          '📝 Other'
        ]
      },
      
      // Step 5: Success
      success: {
        title: 'Platform Usage & Success',
        subtitle: 'Help us build the right service model',
        willingToPay: 'Would you pay for premium features? *',
        paymentOptions: [
          '💎 Yes - ₹99/month for premium search',
          '🎯 Yes - ₹299 one-time for booking guarantee',
          '🆓 Only if basic search is completely free',
          '❌ Would never pay for room search'
        ],
        recommendation: 'How likely to recommend our platform? (1-10)',
        urgency: 'How urgently do you need accommodation? *',
        urgencyOptions: [
          '🚨 Immediately (within 1 week)',
          '⏰ Soon (within 1 month)',
          '📅 Planning ahead (2-3 months)',
          '👀 Just exploring options'
        ]
      },
      
      navigation: {
        next: 'Next Step →',
        prev: '← Previous', 
        submit: '🚀 Submit Feedback'
      }
    },
    
    hindi: {
      title: '👤 प्लेटफॉर्म फीडबैक - पीजी/रूम खोजने वाले',
      subtitle: 'आपके लिए परफेक्ट रूम हंटिंग एक्सपीरियंस बनाने में हमारी मदद करें',
      steps: ['👤 प्रोफाइल', '🏠 वर्तमान', '⚡ समस्याएं', '💎 फीचर्स', '📊 सफलता'],
      
      profile: {
        title: 'त्वरित प्रोफाइल सेटअप',
        subtitle: 'अपने बारे में बताएं (30 सेकंड)',
        name: 'पूरा नाम *',
        email: 'ईमेल एड्रेस *',
        phone: 'फोन नंबर *',
        city: 'वर्तमान शहर *',
        occupation: 'पेशा *',
        occupationOptions: [
          'अपना पेशा चुनें',
          '🎓 छात्र',
          '💼 नौकरीपेशा',
          '🔧 अन्य'
        ],
        budget: 'मासिक बजट रेंज *',
        budgetOptions: [
          'बजट रेंज चुनें',
          '₹5,000-10,000',
          '₹10,000-15,000',
        ]
      },
      
      currentSituation: {
        title: 'आपकी वर्तमान हाउसिंग स्थिति क्या है?',
        subtitle: 'आपकी जरूरतों को बेहतर समझने में मदद करें',
        options: [
          '🏠 परिवार के साथ रह रहे हैं, बाहर जाना चाहते हैं',
          '🏢 अभी पीजी में हैं, बदलना चाहते हैं',
          '🏠 शेयर्ड फ्लैट/रूम में हैं, बदलना चाहते हैं',
          '🎒 शहर में नए हैं, रहने की जगह चाहिए',
          '🔄 नौकरी/पढ़ाई के लिए रिलोकेट कर रहे हैं',
          '⏰ मौजूदा जगह का लीज जल्दी खत्म हो रहा है',
          '📝 अन्य'
        ]
      },
      
      painPoints: {
        title: 'खोजते समय आपकी सबसे बड़ी समस्याएं क्या हैं?',
        subtitle: 'जो भी आपको सबसे ज्यादा परेशान करता है वो सब चुनें',
        options: [
          '🔍 वेरिफाइड/असली लिस्टिंग नहीं मिलती',
          '💰 छुपे हुए चार्जेस और ब्रोकर फीस',
          '⏰ फर्जी प्रॉपर्टीज देखने में समय बर्बाद',
          '📞 ओनर्स रिस्पॉन्स नहीं करते',
          '🏠 प्रॉपर्टी ऑनलाइन डिस्क्रिप्शन से मैच नहीं करती',
          '📋 कॉम्प्लिकेटेड डॉक्यूमेंटेशन प्रोसेस',
          '💸 गारंटी के बिना एडवांस पेमेंट',
          '🚫 पसंदीदा एरिया में सीमित ऑप्शन',
          '📝 अन्य समस्या'
        ]
      },
      
      features: {
        title: 'आपकी खोज के लिए सबसे महत्वपूर्ण फीचर्स',
        subtitle: 'कम से कम 4, अधिकतम 8 जरूरी फीचर्स चुनें',
        options: [
          '✅ वेरिफाइड प्रॉपर्टी फोटोज और डिटेल्स',
          '🔍 एडवांस्ड फिल्टर्स (बजट, लोकेशन, अमेनिटीज)',
          '📱 वर्चुअल टूर्स/ओनर्स के साथ वीडियो कॉल',
          '💳 सिक्योर ऑनलाइन बुकिंग और पेमेंट्स',
          '⭐ पिछले टेनेंट्स के सच्चे रिव्यूज',
          '📍 एक्जैक्ट लोकेशन और नजदीकी सुविधाओं की जानकारी',
          '🤝 ओनर्स के साथ डायरेक्ट कम्युनिकेशन',
          '📋 जीरो ब्रोकरेज गारंटी',
          '⚡ इंस्टेंट बुकिंग कन्फर्मेशन',
          '🛡️ डिपॉज़िट प्रोटेक्शन और रिफंड गारंटी',
          '📝 अन्य'
        ]
      },
      
      success: {
        title: 'प्लेटफॉर्म यूसेज और सफलता',
        subtitle: 'सही सर्विस मॉडल बनाने में मदद करें',
        willingToPay: 'क्या आप प्रीमियम फीचर्स के लिए पे करेंगे? *',
        paymentOptions: [
          '💎 हां - ₹99/महीना प्रीमियम सर्च के लिए',
          '🎯 हां - ₹299 वन-TIME बुकिंग गारंटी के लिए',
          '🆓 केवल अगर बेसिक सर्च बिल्कुल फ्री हो',
          '❌ रूम सर्च के लिए कभी पे नहीं करूंगा'
        ],
        recommendation: 'हमारे प्लेटफॉर्म को रिकमेंड करने की संभावना? (1-10)',
        urgency: 'आपको कितनी जल्दी एकोमोडेशन चाहिए? *',
        urgencyOptions: [
          '🚨 तुरंत (1 हफ्ते में)',
          '⏰ जल्दी (1 महीने में)',
          '📅 प्लानिंग कर रहे हैं (2-3 महीने)',
          '👀 सिर्फ ऑप्शन्स देख रहे हैं'
        ]
      },
      
      navigation: {
        next: 'अगला स्टेप →',
        prev: '← पिछला',
        submit: '🚀 फीडबैक सबमिट करें'
      }
    },
    
    hinglish: {
      title: '👤 Platform Feedback - PG/Room Seeker',
      subtitle: 'Perfect room hunting experience banane me hamare saath help kijiye',
      steps: ['👤 Profile', '🏠 Current', '⚡ Problems', '💎 Features', '📊 Success'],
      
      profile: {
        title: 'Quick Profile Setup',
        subtitle: 'Apne bare me batayiye (30 seconds)',
        name: 'Pura Naam *',
        email: 'Email Address *',
        phone: 'Phone Number *',
        city: 'Current City *',
        occupation: 'Occupation *',
        occupationOptions: [
          'Apna occupation select kare',
          '🎓 Student',
          '💼 Working Professional',
          '🔧 Other'
        ],
        budget: 'Monthly Budget Range *',
        budgetOptions: [
          'Budget range select kare',
          '₹5,000-10,000',
          '₹10,000-15,000',
        ]
      },
      
      currentSituation: {
        title: 'Aapki Current Housing Situation Kya Hai?',
        subtitle: 'Aapki needs better samajhne me help kare',
        options: [
          '🏠 Family ke saath reh rahe hain, bahar jana chahte hain',
          '🏢 Abhi PG me hain, switch karna chahte hain',
          '🏠 Shared flat/room me hain, change karna chahte hain',
          '🎒 City me naye hain, accommodation chahiye',
          '🔄 Job/studies ke liye relocate kar rahe hain',
          '⏰ Current place ka lease jaldi khatam ho raha hai',
          '📝 Other'
        ]
      },
      
      painPoints: {
        title: 'Searching Karte Time Aapki Biggest Problems Kya Hain?',
        subtitle: 'Jo bhi aapko sabse zyada frustrate karta hai wo sab select kare',
        options: [
          '🔍 Verified/genuine listings nahi milti',
          '💰 Hidden charges aur broker fees',
          '⏰ Fake properties dekhne me time waste',
          '📞 Owners respond nahi karte',
          '🏠 Properties online description se match nahi karti',
          '📋 Complicated documentation process',
          '💸 Guarantees ke bina advance payment',
          '🚫 Preferred areas me limited options',
          '📝 Koi aur problem'
        ]
      },
      
      features: {
        title: 'Aapki Search Ke Liye Sabse Important Features',
        subtitle: 'Minimum 4, maximum 8 must-have features select kare',
        options: [
          '✅ Verified property photos aur details',
          '🔍 Advanced filters (budget, location, amenities)',
          '📱 Virtual tours/owners ke saath video calls',
          '💳 Secure online booking aur payments',
          '⭐ Previous tenants ke genuine reviews',
          '📍 Exact location aur nearby facilities info',
          '🤝 Owners ke saath direct communication',
          '📋 Zero brokerage guarantees',
          '⚡ Instant booking confirmation',
          '🛡️ Deposit protection aur refund guarantees',
          '📝 Other'
        ]
      },
      
      success: {
        title: 'Platform Usage Aur Success',
        subtitle: 'Right service model banane me help kare',
        willingToPay: 'Kya aap premium features ke liye pay karenge? *',
        paymentOptions: [
          '💎 Haan - ₹99/month premium search ke liye',
          '🎯 Haan - ₹299 one-time booking guarantee ke liye',
          '🆓 Sirf agar basic search bilkul free ho',
          '❌ Room search ke liye kabhi pay nahi karunga'
        ],
        recommendation: 'Hamare platform ko recommend karne ki possibility? (1-10)',
        urgency: 'Kitni urgently accommodation chahiye? *',
        urgencyOptions: [
          '🚨 Turant (1 week me)',
          '⏰ Jaldi (1 month me)',
          '📅 Planning kar rahe hain (2-3 months)',
          '👀 Sirf options dekh rahe hain'
        ]
      },
      
      navigation: {
        next: 'Next Step →',
        prev: '← Previous',
        submit: '🚀 Feedback Submit Kare'
      }
    }
  };

  const currentLang = languages[lang];

  // Helper functions for option mapping system
  const getOptionText = (optionId, category) => {
    if (!optionId || !optionMappings[category] || !optionMappings[category][optionId]) {
      return optionId; // Return as-is if not found
    }
    return optionMappings[category][optionId][lang] || optionId;
  };

  const getOptionsList = (category) => {
    if (!optionMappings[category]) return [];
    return Object.keys(optionMappings[category]).map(id => ({
      id,
      text: optionMappings[category][id][lang]
    }));
  };

  // Language change handler with option conversion
  const handleLanguageChange = (newLanguage) => {
    console.log('Language changing from', lang, 'to', newLanguage);
    console.log('Current form state:', form);
    
    // With ID-based system, no conversion needed!
    // Form state already contains IDs, just change display language
    setLang(newLanguage);
    
    console.log('Language changed to', newLanguage, 'form state unchanged:', form);
  };

  // Device Submission Tracking Functions

  const markAsSubmitted = useCallback((formData) => {
    try {
      const submissionRecord = {
        submitted: true,
        timestamp: new Date().toISOString(),
        type: 'user',
        name: formData.name,
        email: formData.email,
        deviceInfo: {
          userAgent: navigator.userAgent,
          screen: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language
        }
      };
      
      localStorage.setItem('userFeedbackSubmitted', JSON.stringify(submissionRecord));
      localStorage.removeItem('userFeedbackForm');
      localStorage.removeItem('userFeedbackStep');
      localStorage.removeItem('userFeedbackLastSaved');
    } catch (error) {
      console.error('Error marking submission:', error);
    }
  }, []);

  // Form validation
  const validateStep = (step) => {
    const newErrors = {};
    
    switch(step) {
      case 1:
        // Name validation
        const nameValidation = validateFormField('Name', form.name, 'name');
        if (!nameValidation.isValid) {
          newErrors.name = nameValidation.errors[0];
        }
        
        // Email validation
        const emailValidation = validateFormField('Email', form.email, 'email');
        if (!emailValidation.isValid) {
          newErrors.email = emailValidation.errors[0];
        }
        
        // Phone validation
        const phoneValidation = validateFormField('Phone', form.phone, 'phone');
        if (!phoneValidation.isValid) {
          newErrors.phone = phoneValidation.errors[0];
        }
        
        // Other required fields
        if (!form.city.trim()) newErrors.city = 'City is required';
        if (!form.occupation) newErrors.occupation = 'Occupation is required';
        if (!form.budget) newErrors.budget = 'Budget range is required';
        break;
      case 2:
        if (!form.currentSituation) newErrors.currentSituation = 'Please select your current situation';
        // Validate other current situation if "Other" is selected
        if (form.currentSituation === 'OTHER' && !form.otherCurrentSituation.trim()) {
          newErrors.otherCurrentSituation = 'Please specify your current housing situation';
        }
        break;
      case 3:
        if (form.mainProblems.length === 0) newErrors.mainProblems = 'Please select at least one problem';
        // Validate other main problem if "Other" is selected
        if (form.mainProblems.includes('OTHER') && !form.otherMainProblem.trim()) {
          newErrors.otherMainProblem = 'Please specify your other problem';
        }
        break;
      case 4:
        if (form.importantFeatures.length < 4) newErrors.importantFeatures = 'Please select at least 4 features';
        if (form.importantFeatures.length > 8) newErrors.importantFeatures = 'Please select maximum 8 features';
        // Validate other feature field if "Other" is selected
        if (form.importantFeatures.includes('OTHER') && !form.otherFeature.trim()) {
          newErrors.otherFeature = 'Please specify your other feature requirement';
        }
        break;
      case 5:
        if (!form.willingToPay) newErrors.willingToPay = 'Please select payment option';
        if (!form.urgency) newErrors.urgency = 'Please select urgency option';
        break;
      default:
        // No validation for unknown steps
        break;
    }
    
    return newErrors;
  };

  // Professional form submission with loading states
  const handleSubmit = async () => {
    if (!validateStep(5)) return;
    
    // Start loading
    setLoading(true);
    setSubmitStatus('');
    
    // Convert IDs to readable text for submission
    const formData = {
      ...form,
      city: form.city === 'OTHER' ? form.otherCity : getOptionText(form.city, 'city'),
      // Convert option IDs to readable text
      currentSituation: form.currentSituation ? getOptionText(form.currentSituation, 'currentSituation') : '',
      mainProblems: form.mainProblems.map(id => getOptionText(id, 'painPoints')),
      importantFeatures: form.importantFeatures.map(id => getOptionText(id, 'features')),
      // Add metadata
      language: lang,
      completionTime: Date.now() - form.formStartTime,
      submittedAt: new Date().toISOString()
    };

    try {
      const response = await fetch('https://feedbackform-aab9.onrender.com/api/user-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        // Mark as submitted before showing success
        markAsSubmitted(formData);
        
        setSubmitStatus('success');
        showNotification('success', 
          lang === 'hindi' ? 'फीडबैक सफलतापूर्वक सबमिट हो गया! 🎉' : 
          lang === 'hinglish' ? 'Feedback successfully submit ho gaya! 🎉' :
          'Feedback successfully submitted! 🎉'
        );
        
        // Redirect to thank you page after success
        setTimeout(() => {
          const params = new URLSearchParams({
            name: formData.name,
            type: 'user',
            lang: lang
          });
          window.location.href = `/thank-you?${params.toString()}`;
        }, 2000);
        
        // Reset form after success animation with delay (fallback)
        setTimeout(() => {
          setForm({
            name: '', email: '', phone: '', city: '', occupation: '', budget: '',
            currentSituation: '', otherCurrentSituation: '', mainProblems: [], otherMainProblem: '',
            importantFeatures: [], otherFeature: '', willingToPay: '',
            recommendation: 5, urgency: '', formStartTime: Date.now()
          });
          setCurrentStep(1);
          setSubmitStatus('');
          clearLocalStorage(); // Clear saved data after success
        }, 3000);
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      setSubmitStatus('error');
      showNotification('error', 
        lang === 'hindi' ? 'फीडबैक सबमिट करने में त्रुटि हुई। कृपया दोबारा कोशिश करें। ❌' : 
        lang === 'hinglish' ? 'Feedback submit karne me error hui. Please try again. ❌' :
        'Error submitting feedback. Please try again. ❌'
      );
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show notification system
  const showNotification = useCallback((type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 4000);
  }, []);

  // Data Persistence Functions
  const saveToLocalStorage = useCallback(() => {
    try {
      localStorage.setItem('userFeedbackForm', JSON.stringify(form));
      localStorage.setItem('userFeedbackStep', currentStep.toString());
      localStorage.setItem('userFeedbackLastSaved', new Date().toISOString());
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [form, currentStep]);



  const clearLocalStorage = () => {
    localStorage.removeItem('userFeedbackForm');
    localStorage.removeItem('userFeedbackStep');
    localStorage.removeItem('userFeedbackLastSaved');
  };

  // Load data on component mount
  useEffect(() => {
    // Check submission directly without function call
    try {
      const userSubmission = localStorage.getItem('userFeedbackSubmitted');
      if (userSubmission) {
        const submissionData = JSON.parse(userSubmission);
        const submissionTime = new Date(submissionData.timestamp);
        const now = new Date();
        const daysDiff = (now - submissionTime) / (1000 * 60 * 60 * 24);
        
        if (daysDiff < 30) {
          setAlreadySubmitted(true);
          setSubmissionInfo(submissionData);
          return;
        } else {
          localStorage.removeItem('userFeedbackSubmitted');
        }
      }
      
      // Load saved form data
      const savedForm = localStorage.getItem('userFeedbackForm');
      const savedStep = localStorage.getItem('userFeedbackStep');
      const lastSaved = localStorage.getItem('userFeedbackLastSaved');
      
      if (savedForm && savedStep && lastSaved) {
        const saveTime = new Date(lastSaved);
        const now = new Date();
        const hoursDiff = (now.getTime() - saveTime.getTime()) / (1000 * 3600);
        
        if (hoursDiff < 24) {
          setForm(JSON.parse(savedForm));
          setCurrentStep(parseInt(savedStep));
        }
      }
    } catch (error) {
      console.error('Error in initialization:', error);
    }
  }, []); // Run only once on mount

  // Auto-save on form changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (form.name || form.email || form.phone) { // Only save if there's meaningful data
        try {
          localStorage.setItem('userFeedbackForm', JSON.stringify(form));
          localStorage.setItem('userFeedbackStep', currentStep.toString());
          localStorage.setItem('userFeedbackLastSaved', new Date().toISOString());
        } catch (error) {
          console.error('Failed to save to localStorage:', error);
        }
      }
    }, 1000); // 1 second debounce
    
    return () => clearTimeout(timer);
  }, [form, currentStep]); // Direct implementation, no function dependency

  // Advanced form change handler with real-time validation
  const handleChange = useCallback((field, value) => {
    let processedValue = value;
    let errorMessage = '';
    
    // Apply advanced input processing based on field type
    switch (field) {
      case 'name':
        processedValue = filterNameInput(value);
        const nameValidation = validateName(processedValue);
        if (!nameValidation.isValid && processedValue.length > 0) {
          errorMessage = nameValidation.error;
        }
        break;
        
      case 'phone':
        processedValue = getNormalizedMobile(value);
        const phoneError = getMobileValidationError(processedValue, false);
        if (phoneError && processedValue.length > 0) {
          errorMessage = phoneError;
        }
        break;
        
      case 'email':
        processedValue = value.trim().toLowerCase();
        const emailError = getEmailValidationError(processedValue, false);
        if (emailError && processedValue.length > 0) {
          errorMessage = emailError;
        }
        break;
        
      default:
        // processedValue is already set to value at initialization
        break;
    }
    
    // Update form value
    setForm(prev => ({ ...prev, [field]: processedValue }));
    
    // Update or clear error
    if (errorMessage) {
      setErrors(prev => ({ ...prev, [field]: errorMessage }));
    } else if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Handle multiple selections
  const handleMultiSelect = useCallback((field, option) => {
    const current = form[field];
    const updated = current.includes(option) 
      ? current.filter(item => item !== option)
      : [...current, option];
    
    handleChange(field, updated);
  }, [form, handleChange]);

  // Progress calculation
  const progress = (currentStep / 5) * 100;

  // If already submitted, redirect to thank you page
  if (alreadySubmitted && submissionInfo) {
    const params = new URLSearchParams({
      name: submissionInfo.name,
      type: 'user',
      lang: lang
    });
    window.location.href = `/thank-you?${params.toString()}`;
    return null;
  }

  return (
    <>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '20px 0'
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
            onClick={() => handleLanguageChange(language)}
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

      {/* Main Container */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '32px',
          textAlign: 'center',
          color: '#fff'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px'
          }}>
            {currentLang.title}
          </h1>
          <p style={{
            fontSize: '16px',
            opacity: 0.9,
            margin: 0,
            fontWeight: '400'
          }}>
            {currentLang.subtitle}
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{
          background: '#f8faff',
          padding: '0'
        }}>
          <div style={{
            height: '4px',
            background: `linear-gradient(to right, #667eea ${progress}%, #e2e8f0 ${progress}%)`,
            transition: 'all 0.3s ease'
          }} />
          
          {/* Step Indicators */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '20px 32px',
            background: '#f8faff'
          }}>
            {currentLang.steps.map((step, index) => (
              <div 
                key={index}
                style={{
                  textAlign: 'center',
                  opacity: index + 1 <= currentStep ? 1 : 0.4,
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: index + 1 <= currentStep ? '#667eea' : '#e2e8f0',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  margin: '0 auto 8px'
                }}>
                  {index + 1}
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#64748b',
                  maxWidth: '80px'
                }}>
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div style={{ 
          padding: window.innerWidth <= 768 ? '16px' : '32px'
        }}>
          
          {/* Step 1: Profile */}
          {currentStep === 1 && (
            <div>
              <div style={{ marginBottom: window.innerWidth <= 768 ? '20px' : '32px' }}>
                <h2 style={{
                  fontSize: window.innerWidth <= 768 ? '20px' : '24px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                  color: '#1e293b'
                }}>
                  {currentLang.profile.title}
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#64748b',
                  margin: 0
                }}>
                  {currentLang.profile.subtitle}
                </p>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: window.innerWidth > 768 ? '1fr 1.5fr' : '1fr', 
                gap: '20px' 
              }}>
                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px',
                    textAlign: 'left'
                  }}>
                    {currentLang.profile.name}
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    style={{
                      width: '100%',
                      padding: window.innerWidth <= 768 ? '16px 20px' : '12px 16px',
                      border: errors.name ? '2px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: window.innerWidth <= 768 ? '12px' : '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      background: '#fff',
                      boxSizing: 'border-box',
                      height: window.innerWidth <= 768 ? '52px' : '48px'
                    }}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                      {errors.name}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px',
                    textAlign: 'left'
                  }}>
                    {currentLang.profile.email}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: window.innerWidth <= 768 ? '16px 20px' : '12px 16px',
                      border: errors.email ? '2px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: window.innerWidth <= 768 ? '12px' : '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      background: '#fff',
                      boxSizing: 'border-box',
                      height: window.innerWidth <= 768 ? '52px' : '48px'
                    }}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                      {errors.email}
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  
                  <div>
                    <label style={{ 
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px',
                      textAlign: 'left'
                    }}>
                      {currentLang.profile.city}
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      style={{
                        width: '100%',
                        padding: window.innerWidth <= 768 ? '16px 20px' : '12px 16px',
                        border: errors.city ? '2px solid #ef4444' : '1px solid #d1d5db',
                        borderRadius: window.innerWidth <= 768 ? '12px' : '8px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        background: '#fff',
                        boxSizing: 'border-box',
                        height: window.innerWidth <= 768 ? '52px' : '48px'
                      }}
                      placeholder="Enter your current city"
                    />
                    {errors.city && (
                      <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                        {errors.city}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px',
                    textAlign: 'left'
                  }}>
                    {currentLang.profile.phone}
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    style={{
                      width: '100%',
                      padding: window.innerWidth <= 768 ? '16px 20px' : '12px 16px',
                      border: errors.phone ? '2px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: window.innerWidth <= 768 ? '12px' : '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      background: '#fff',
                      boxSizing: 'border-box',
                      height: window.innerWidth <= 768 ? '52px' : '48px'
                    }}
                    placeholder="Phone"
                  />
                  {errors.phone && (
                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                      {errors.phone}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px',
                    textAlign: 'left'
                  }}>
                    {currentLang.profile.occupation}
                  </label>
                  <select
                    value={form.occupation}
                    onChange={(e) => handleChange('occupation', e.target.value)}
                    style={{
                      width: '100%',
                      padding: window.innerWidth <= 768 ? '16px 20px' : '12px 16px',
                      border: errors.occupation ? '2px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: window.innerWidth <= 768 ? '12px' : '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      background: '#fff',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236B7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'%3e%3c/path%3e%3c/svg%3e")',
                      backgroundPosition: window.innerWidth <= 768 ? 'right 16px center' : 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px',
                      paddingRight: window.innerWidth <= 768 ? '48px' : '40px',
                      appearance: 'none',
                      boxSizing: 'border-box',
                      height: window.innerWidth <= 768 ? '52px' : '48px'
                    }}
                  >
                    {currentLang.profile.occupationOptions.map((option, index) => (
                      <option key={index} value={index === 0 ? '' : option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.occupation && (
                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                      {errors.occupation}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px',
                    textAlign: 'left'
                  }}>
                    {currentLang.profile.budget}
                  </label>
                  <select
                    value={form.budget}
                    onChange={(e) => handleChange('budget', e.target.value)}
                    style={{
                      width: '100%',
                      padding: window.innerWidth <= 768 ? '16px 20px' : '12px 16px',
                      border: errors.budget ? '2px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: window.innerWidth <= 768 ? '12px' : '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      background: '#fff',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236B7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'%3e%3c/path%3e%3c/svg%3e")',
                      backgroundPosition: window.innerWidth <= 768 ? 'right 16px center' : 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px',
                      paddingRight: window.innerWidth <= 768 ? '48px' : '40px',
                      appearance: 'none',
                      boxSizing: 'border-box',
                      height: window.innerWidth <= 768 ? '52px' : '48px'
                    }}
                  >
                    {currentLang.profile.budgetOptions.map((option, index) => (
                      <option key={index} value={index === 0 ? '' : option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.budget && (
                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                      {errors.budget}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Current Situation */}
          {currentStep === 2 && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                  color: '#1e293b'
                }}>
                  {currentLang.currentSituation.title}
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#64748b',
                  margin: 0
                }}>
                  {currentLang.currentSituation.subtitle}
                </p>
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                {getOptionsList('currentSituation').map((option, index) => (
                  <label 
                    key={option.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px',
                      border: form.currentSituation === option.id ? '2px solid #667eea' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: form.currentSituation === option.id ? '#f0f4ff' : '#fff'
                    }}
                  >
                    <input
                      type="radio"
                      name="currentSituation"
                      value={option.id}
                      checked={form.currentSituation === option.id}
                      onChange={(e) => handleChange('currentSituation', e.target.value)}
                      style={{ marginRight: '12px' }}
                    />
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      {option.text}
                    </span>
                  </label>
                ))}
              </div>

              {/* Other Current Situation Input */}
              {form.currentSituation === 'OTHER' && (
                <div style={{ marginTop: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    {
                      lang === 'hindi' ? 'अपनी वर्तमान स्थिति बताएं:' :
                      lang === 'hinglish' ? 'Apni current situation bataye:' :
                      'Please specify your current housing situation:'
                    }
                  </label>
                  <textarea
                    value={form.otherCurrentSituation}
                    onChange={(e) => handleChange('otherCurrentSituation', e.target.value)}
                    placeholder={
                      lang === 'hindi' ? 'अपनी वर्तमान हाउसिंग स्थिति के बारे में बताएं...' :
                      lang === 'hinglish' ? 'Apni current housing situation ke baare me bataye...' :
                      'Describe your current housing situation...'
                    }
                    style={{
                      width: '70%',
                      maxWidth: '500px',
                      margin: '0 auto',
                      display: 'block',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: errors.otherCurrentSituation ? '2px solid #ef4444' : '1px solid #d1d5db',
                      fontSize: '16px',
                      minHeight: '80px',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                  {errors.otherCurrentSituation && (
                    <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                      {errors.otherCurrentSituation}
                    </div>
                  )}
                </div>
              )}
              
              {errors.currentSituation && (
                <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '16px', textAlign: 'center' }}>
                  {errors.currentSituation}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Pain Points */}
          {currentStep === 3 && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                  color: '#1e293b'
                }}>
                  {currentLang.painPoints.title}
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#64748b',
                  margin: 0
                }}>
                  {currentLang.painPoints.subtitle}
                </p>
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                {getOptionsList('painPoints').map((option, index) => (
                  <label 
                    key={option.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: window.innerWidth <= 768 ? '20px 24px' : '16px',
                      border: form.mainProblems.includes(option.id) ? '2px solid #667eea' : '1px solid #e2e8f0',
                      borderRadius: window.innerWidth <= 768 ? '16px' : '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: form.mainProblems.includes(option.id) ? '#f0f4ff' : '#fff',
                      minHeight: window.innerWidth <= 768 ? '56px' : '48px'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.mainProblems.includes(option.id)}
                      onChange={() => handleMultiSelect('mainProblems', option.id)}
                      style={{ 
                        marginRight: window.innerWidth <= 768 ? '16px' : '12px',
                        transform: window.innerWidth <= 768 ? 'scale(1.3)' : 'scale(1)'
                      }}
                    />
                    <span style={{
                      fontSize: window.innerWidth <= 768 ? '18px' : '16px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      {option.text}
                    </span>
                  </label>
                ))}
              </div>

              {/* Other Main Problem Input */}
              {form.mainProblems.includes('OTHER') && (
                <div style={{ marginTop: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    {
                      lang === 'hindi' ? 'अन्य समस्या की जानकारी दें:' :
                      lang === 'hinglish' ? 'Other problem ki details bataye:' :
                      'Please specify your other problem:'
                    }
                  </label>
                  <textarea
                    value={form.otherMainProblem}
                    onChange={(e) => handleChange('otherMainProblem', e.target.value)}
                    placeholder={
                      lang === 'hindi' ? 'आपकी अन्य समस्या के बारे में बताएं...' :
                      lang === 'hinglish' ? 'Aapki other problem ke baare me bataye...' :
                      'Describe your other problem while searching for rooms...'
                    }
                    style={{
                      width: '70%',
                      maxWidth: '500px',
                      margin: '0 auto',
                      display: 'block',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: errors.otherMainProblem ? '2px solid #ef4444' : '1px solid #d1d5db',
                      fontSize: '16px',
                      minHeight: '80px',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                  {errors.otherMainProblem && (
                    <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                      {errors.otherMainProblem}
                    </div>
                  )}
                </div>
              )}
              
              {errors.mainProblems && (
                <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '16px', textAlign: 'center' }}>
                  {errors.mainProblems}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Features */}
          {currentStep === 4 && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                  color: '#1e293b'
                }}>
                  {currentLang.features.title}
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#64748b',
                  margin: 0
                }}>
                  {currentLang.features.subtitle}
                </p>
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                {getOptionsList('features').map((option, index) => (
                  <label 
                    key={option.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px',
                      border: form.importantFeatures.includes(option.id) ? '2px solid #667eea' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: form.importantFeatures.includes(option.id) ? '#f0f4ff' : '#fff',
                      opacity: form.importantFeatures.length >= 8 && !form.importantFeatures.includes(option.id) ? 0.5 : 1
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.importantFeatures.includes(option.id)}
                      onChange={() => handleMultiSelect('importantFeatures', option.id)}
                      disabled={form.importantFeatures.length >= 8 && !form.importantFeatures.includes(option.id)}
                      style={{ marginRight: '12px' }}
                    />
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      {option.text}
                    </span>
                  </label>
                ))}
              </div>
              
              {/* Other Feature Input */}
              {form.importantFeatures.includes('OTHER') && (
                <div style={{ marginTop: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    {
                      lang === 'hindi' ? 'अन्य फीचर की जानकारी दें:' :
                      lang === 'hinglish' ? 'Other feature ki details bataye:' :
                      'Please specify your other feature requirement:'
                    }
                  </label>
                  <textarea
                    value={form.otherFeature}
                    onChange={(e) => handleChange('otherFeature', e.target.value)}
                    placeholder={
                      lang === 'hindi' ? 'यहाँ अपनी आवश्यकता लिखें...' :
                      lang === 'hinglish' ? 'Yaha apni requirement likhiye...' :
                      'Write your specific feature requirement here...'
                    }
                    style={{
                      width: '70%',
                      maxWidth: '500px',
                      margin: '0 auto',
                      display: 'block',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: errors.otherFeature ? '2px solid #ef4444' : '1px solid #d1d5db',
                      fontSize: '16px',
                      minHeight: '80px',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                  {errors.otherFeature && (
                    <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                      {errors.otherFeature}
                    </div>
                  )}
                </div>
              )}

              <div style={{
                textAlign: 'center',
                marginTop: '16px',
                fontSize: '14px',
                color: '#64748b'
              }}>
                Selected: {form.importantFeatures.length}/8 (Min: 4, Max: 8)
              </div>
              
              {errors.importantFeatures && (
                <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '8px', textAlign: 'center' }}>
                  {errors.importantFeatures}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Success */}
          {currentStep === 5 && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                  color: '#1e293b'
                }}>
                  {currentLang.success.title}
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#64748b',
                  margin: 0
                }}>
                  {currentLang.success.subtitle}
                </p>
              </div>

              <div style={{ display: 'grid', gap: '24px' }}>
                {/* Willing to Pay */}
                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '12px',
                    textAlign: 'left'
                  }}>
                    {currentLang.success.willingToPay}
                  </label>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {currentLang.success.paymentOptions.map((option, index) => (
                      <label 
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: window.innerWidth <= 768 ? '18px 20px' : '12px',
                          border: form.willingToPay === option ? '2px solid #667eea' : '1px solid #e2e8f0',
                          borderRadius: window.innerWidth <= 768 ? '12px' : '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          background: form.willingToPay === option ? '#f0f4ff' : '#fff',
                          minHeight: window.innerWidth <= 768 ? '52px' : '44px'
                        }}
                      >
                        <input
                          type="radio"
                          name="willingToPay"
                          value={option}
                          checked={form.willingToPay === option}
                          onChange={(e) => handleChange('willingToPay', e.target.value)}
                          style={{ 
                            marginRight: window.innerWidth <= 768 ? '12px' : '8px',
                            transform: window.innerWidth <= 768 ? 'scale(1.2)' : 'scale(1)'
                          }}
                        />
                        <span style={{ 
                          fontSize: window.innerWidth <= 768 ? '16px' : '14px', 
                          color: '#374151' 
                        }}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.willingToPay && (
                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                      {errors.willingToPay}
                    </div>
                  )}
                </div>

                {/* Recommendation Scale */}
                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '12px',
                    textAlign: 'left'
                  }}>
                    {currentLang.success.recommendation}
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>1</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={form.recommendation}
                      onChange={(e) => handleChange('recommendation', parseInt(e.target.value))}
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontSize: '12px', color: '#64748b' }}>10</span>
                    <div style={{
                      background: '#667eea',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      minWidth: '40px',
                      textAlign: 'center'
                    }}>
                      {form.recommendation}
                    </div>
                  </div>
                </div>

                {/* Urgency */}
                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '12px',
                    textAlign: 'left'
                  }}>
                    {currentLang.success.urgency}
                  </label>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {currentLang.success.urgencyOptions.map((option, index) => (
                      <label 
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px',
                          border: form.urgency === option ? '2px solid #667eea' : '1px solid #e2e8f0',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          background: form.urgency === option ? '#f0f4ff' : '#fff'
                        }}
                      >
                        <input
                          type="radio"
                          name="urgency"
                          value={option}
                          checked={form.urgency === option}
                          onChange={(e) => handleChange('urgency', e.target.value)}
                          style={{ marginRight: '8px' }}
                        />
                        <span style={{ fontSize: '14px', color: '#374151' }}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.urgency && (
                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                      {errors.urgency}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '24px 32px',
          borderTop: '1px solid #e2e8f0',
          background: '#f8faff'
        }}>
          <button
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
                setErrors({});
              }
            }}
            style={{
              padding: window.innerWidth <= 768 ? '16px 32px' : '12px 24px',
              border: '1px solid #d1d5db',
              borderRadius: window.innerWidth <= 768 ? '12px' : '8px',
              background: '#fff',
              color: '#374151',
              cursor: currentStep > 1 ? 'pointer' : 'not-allowed',
              fontSize: window.innerWidth <= 768 ? '18px' : '16px',
              fontWeight: '500',
              opacity: currentStep > 1 ? 1 : 0.5,
              transition: 'all 0.2s ease',
              minHeight: window.innerWidth <= 768 ? '48px' : '40px'
            }}
            disabled={currentStep === 1}
          >
            {currentLang.navigation.prev}
          </button>

          <button
            onClick={async () => {
              if (currentStep === 5) {
                handleSubmit();
              } else if (validateStep(currentStep)) {
                setStepLoading(true);
                // Smooth transition with loading
                setTimeout(() => {
                  setCurrentStep(currentStep + 1);
                  setErrors({});
                  setStepLoading(false);
                  saveToLocalStorage(); // Save progress
                }, 300);
              }
            }}
            disabled={loading || stepLoading || !validateStep(currentStep)}
            style={{
              padding: window.innerWidth <= 768 ? '16px 32px' : '12px 24px',
              border: 'none',
              borderRadius: window.innerWidth <= 768 ? '12px' : '8px',
              background: (loading || stepLoading || !validateStep(currentStep)) 
                ? '#ccc' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              cursor: (loading || stepLoading || !validateStep(currentStep)) ? 'not-allowed' : 'pointer',
              fontSize: window.innerWidth <= 768 ? '18px' : '16px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: (loading || stepLoading || !validateStep(currentStep)) 
                ? 'none' 
                : '0 4px 12px rgba(102, 126, 234, 0.3)',
              opacity: (loading || stepLoading || !validateStep(currentStep)) ? 0.6 : 1,
              minHeight: window.innerWidth <= 768 ? '48px' : '40px'
            }}
          >
            {loading ? (
              <>
                <span style={{ marginRight: '8px' }}>⏳</span>
                {lang === 'hindi' ? 'सबमिट हो रहा है...' : 
                 lang === 'hinglish' ? 'Submit ho raha hai...' : 
                 'Submitting...'}
              </>
            ) : stepLoading ? (
              <>
                <span style={{ marginRight: '8px' }}>⏳</span>
                {lang === 'hindi' ? 'लोड हो रहा है...' : 
                 lang === 'hinglish' ? 'Load ho raha hai...' : 
                 'Loading...'}
              </>
            ) : (
              currentStep === 5 ? currentLang.navigation.submit : currentLang.navigation.next
            )}
          </button>
        </div>
      </div>

      {/* Professional Notification System */}
      {notification.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: notification.type === 'success' ? 
            'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' : 
            'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 10000,
          fontSize: '16px',
          fontWeight: '500',
          maxWidth: '350px',
          animation: 'slideInRight 0.3s ease-out forwards',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px' 
          }}>
            <span style={{ fontSize: '20px' }}>
              {notification.type === 'success' ? '✅' : '❌'}
            </span>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Success/Error Overlay */}
      {submitStatus && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            maxWidth: '400px',
            width: '90%'
          }}>
            {submitStatus === 'success' ? (
              <>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎉</div>
                <h2 style={{ color: '#48bb78', marginBottom: '16px' }}>
                  {lang === 'hindi' ? 'सफलता!' : 'Success!'}
                </h2>
                <p style={{ color: '#666' }}>
                  {lang === 'hindi' ? 'आपका फीडबैक सफलतापूर्वक सबमिट हो गया है।' : 
                   lang === 'hinglish' ? 'Aapka feedback successfully submit ho gaya hai.' : 
                   'Your feedback has been successfully submitted.'}
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>❌</div>
                <h2 style={{ color: '#f56565', marginBottom: '16px' }}>
                  {lang === 'hindi' ? 'त्रुटि!' : 'Error!'}
                </h2>
                <p style={{ color: '#666' }}>
                  {lang === 'hindi' ? 'कुछ गलत हुआ है। कृपया दोबारा कोशिश करें।' : 
                   lang === 'hinglish' ? 'Kuch galat hua hai. Please try again.' : 
                   'Something went wrong. Please try again.'}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>

    <style>{`
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    `}</style>
    </>
  );
};

export default AdvancedUserFeedbackForm;