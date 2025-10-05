import React, { useState, useEffect, useCallback } from 'react';
import { 
  filterNameInput,
  getNormalizedMobile,
  getMobileValidationError,
  getEmailValidationError,
  validateName,
  validateFormField 
} from './utils/validations.js';

// Advanced Owner Feedback Form - Complete redesign
const AdvancedOwnerFeedbackForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [lang, setLang] = useState('hinglish');
  
  // Option mapping system - each option has a unique ID
  const optionMappings = {
    city: {
      'MUMBAI': { english: 'Mumbai', hindi: 'मुंबई', hinglish: 'Mumbai' },
      'DELHI': { english: 'Delhi', hindi: 'दिल्ली', hinglish: 'Delhi' },
      'BANGALORE': { english: 'Bangalore', hindi: 'बेंगलुरु', hinglish: 'Bangalore' },
      'PUNE': { english: 'Pune', hindi: 'पुणे', hinglish: 'Pune' },
      'HYDERABAD': { english: 'Hyderabad', hindi: 'हैदराबाद', hinglish: 'Hyderabad' },
      'CHENNAI': { english: 'Chennai', hindi: 'चेन्नई', hinglish: 'Chennai' },
      'KOLKATA': { english: 'Kolkata', hindi: 'कोलकाता', hinglish: 'Kolkata' },
      'OTHER': { english: 'Other', hindi: 'अन्य', hinglish: 'Other' }
    },
    propertyType: {
      'PG_HOSTEL': { english: 'PG/Hostel', hindi: 'पीजी/हॉस्टल', hinglish: 'PG/Hostel' },
      'APARTMENT': { english: 'Apartment/Flat', hindi: 'अपार्टमेंट/फ्लैट', hinglish: 'Apartment/Flat' },
      'INDEPENDENT_HOUSE': { english: 'Independent House', hindi: 'स्वतंत्र मकान', hinglish: 'Independent House' },
      'COMMERCIAL': { english: 'Commercial Property', hindi: 'व्यावसायिक संपत्ति', hinglish: 'Commercial Property' },
      'OTHER': { english: 'Other', hindi: 'अन्य', hinglish: 'Other' }
    },
    propertyCount: {
      '1_PROPERTY': { english: '1 Property', hindi: '1 संपत्ति', hinglish: '1 Property' },
      '2_5_PROPERTIES': { english: '2-5 Properties', hindi: '2-5 संपत्तियां', hinglish: '2-5 Properties' },
      '6_10_PROPERTIES': { english: '6-10 Properties', hindi: '6-10 संपत्तियां', hinglish: '6-10 Properties' },
      'MORE_THAN_10': { english: 'More than 10', hindi: '10 से अधिक', hinglish: 'More than 10' }
    },
    marketingSpend: {
      'UNDER_5K': { english: 'Under ₹5,000/month', hindi: '₹5,000/महीना से कम', hinglish: 'Under ₹5,000/month' },
      '5K_15K': { english: '₹5,000 - ₹15,000/month', hindi: '₹5,000 - ₹15,000/महीना', hinglish: '₹5,000 - ₹15,000/month' },
      '15K_30K': { english: '₹15,000 - ₹30,000/month', hindi: '₹15,000 - ₹30,000/महीना', hinglish: '₹15,000 - ₹30,000/month' },
      'ABOVE_30K': { english: 'Above ₹30,000/month', hindi: '₹30,000/महीना से ऊपर', hinglish: 'Above ₹30,000/month' }
    },
    biggestChallenge: {
      'FINDING_TENANTS': {
        english: '🔍 Finding reliable tenants',
        hindi: '🔍 भरोसेमंद किरायेदार ढूंढना',
        hinglish: '🔍 Reliable tenants dhundna'
      },
      'RENT_COLLECTION': {
        english: '💰 Rent collection delays',
        hindi: '💰 किराया वसूली में देरी',
        hinglish: '💰 Rent collection mein delay'
      },
      'TIME_CONSUMING': {
        english: '⏰ Time-consuming property management',
        hindi: '⏰ संपत्ति प्रबंधन में बहुत समय',
        hinglish: '⏰ Property management mein bahut time'
      },
      'MAINTENANCE_ISSUES': {
        english: '🤝 Dealing with maintenance issues',
        hindi: '🤝 रखरखाव की समस्याएं',
        hinglish: '🤝 Maintenance issues handle karna'
      },
      'LACK_ANALYTICS': {
        english: '📊 Lack of proper analytics/reports',
        hindi: '📊 उचित एनालिटिक्स/रिपोर्ट्स का अभाव',
        hinglish: '📊 Proper analytics/reports ka lack'
      },
      'OUTDATED_SYSTEMS': {
        english: '💻 Using outdated/manual systems',
        hindi: '💻 पुराने/मैन्युअल सिस्टम का उपयोग',
        hinglish: '💻 Outdated/manual systems use karna'
      },
      'POOR_COMMUNICATION': {
        english: '📞 Poor communication with tenants',
        hindi: '📞 किरायेदारों से खराब संवाद',
        hinglish: '📞 Tenants ke sath poor communication'
      },
      'MARKETING_CHALLENGES': {
        english: '🏠 Property marketing challenges',
        hindi: '🏠 संपत्ति मार्केटिंग चुनौतियां',
        hinglish: '🏠 Property marketing challenges'
      },
      'OTHER': {
        english: '📝 Other',
        hindi: '📝 अन्य',
        hinglish: '📝 Other'
      }
    },
    switchReasons: {
      'BETTER_COLLECTION': {
        english: '💰 Better rent collection rates',
        hindi: '💰 बेहतर किराया वसूली दरें',
        hinglish: '💰 Better rent collection rates'
      },
      'SAVE_TIME': {
        english: '⏱️ Save 5+ hours per week',
        hindi: '⏱️ प्रति सप्ताह 5+ घंटे बचाएं',
        hinglish: '⏱️ Per week 5+ ghante bachayenge'
      },
      'QUALITY_TENANTS': {
        english: '🎯 Find quality tenants faster',
        hindi: '🎯 गुणवत्तापूर्ण किरायेदार तेज़ी से खोजें',
        hinglish: '🎯 Quality tenants jaldi dhundenge'
      },
      'MOBILE_EXPERIENCE': {
        english: '📱 Mobile-first experience',
        hindi: '📱 मोबाइल-फर्स्ट अनुभव',
        hinglish: '📱 Mobile-first experience'
      },
      'REAL_ANALYTICS': {
        english: '📊 Real-time analytics & insights',
        hindi: '📊 रीयल-टाइम एनालिटिक्स और इनसाइट्स',
        hinglish: '📊 Real-time analytics aur insights'
      },
      'AUTOMATION': {
        english: '🤖 Automated processes',
        hindi: '🤖 स्वचालित प्रक्रियाएं',
        hinglish: '🤖 Automated processes'
      },
      'REDUCE_COSTS': {
        english: '💸 Reduce operational costs',
        hindi: '💸 परिचालन लागत कम करें',
        hinglish: '💸 Operational costs kam karenge'
      },
      'SECURITY_COMPLIANCE': {
        english: '🔒 Better security & compliance',
        hindi: '🔒 बेहतर सुरक्षा और अनुपालन',
        hinglish: '🔒 Better security aur compliance'
      },
      'OTHER': {
        english: '📝 Other',
        hindi: '📝 अन्य',
        hinglish: '📝 Other'
      }
    },
    topFeatures: {
      'PROPERTY_LISTING': {
        english: '🏠 Advanced Property Listing',
        hindi: '🏠 उन्नत संपत्ति लिस्टिंग',
        hinglish: '🏠 Advanced Property Listing'
      },
      'TENANT_SCREENING': {
        english: '👥 Tenant Screening & Verification',
        hindi: '👥 किरायेदार स्क्रीनिंग और सत्यापन',
        hinglish: '👥 Tenant Screening & Verification'
      },
      'AUTO_RENT_COLLECTION': {
        english: '💳 Automated Rent Collection',
        hindi: '💳 स्वचालित किराया वसूली',
        hinglish: '💳 Automated Rent Collection'
      },
      'MAINTENANCE_MGMT': {
        english: '🔧 Maintenance Management',
        hindi: '🔧 रखरखाव प्रबंधन',
        hinglish: '🔧 Maintenance Management'
      },
      'FINANCIAL_REPORTS': {
        english: '📊 Financial Reports & Analytics',
        hindi: '📊 वित्तीय रिपोर्ट्स और एनालिटिक्स',
        hinglish: '📊 Financial Reports & Analytics'
      },
      'MOBILE_APP': {
        english: '📱 Mobile App for Owners',
        hindi: '📱 मालिकों के लिए मोबाइल ऐप',
        hinglish: '📱 Owners ke liye Mobile App'
      },
      'COMMUNICATION': {
        english: '💬 In-app Communication',
        hindi: '💬 इन-ऐप कम्युनिकेशन',
        hinglish: '💬 In-app Communication'
      },
      'LEASE_MANAGEMENT': {
        english: '📄 Digital Lease Management',
        hindi: '📄 डिजिटल लीज प्रबंधन',
        hinglish: '📄 Digital Lease Management'
      },
      'SMART_NOTIFICATIONS': {
        english: '🔔 Smart Notifications',
        hindi: '🔔 स्मार्ट नोटिफिकेशन',
        hinglish: '🔔 Smart Notifications'
      },
      'MARKETING_LEADS': {
        english: '🎯 Marketing & Lead Generation',
        hindi: '🎯 मार्केटिंग और लीड जेनरेशन',
        hinglish: '🎯 Marketing & Lead Generation'
      },
      'OTHER': {
        english: '📝 Other',
        hindi: '📝 अन्य',
        hinglish: '📝 Other'
      }
    },
    successMetrics: {
      'WILLING_TO_PAY_YES': {
        english: '💳 Yes, I would pay for a comprehensive platform',
        hindi: '💳 हाँ, मैं एक व्यापक प्लेटफॉर्म के लिए भुगतान करूंगा',
        hinglish: '💳 Haan, main comprehensive platform ke liye payment karunga'
      },
      'WILLING_TO_PAY_NO': {
        english: '💸 No, I prefer free solutions only',
        hindi: '💸 नहीं, मैं केवल मुफ्त समाधान पसंद करता हूं',
        hinglish: '💸 Nahi, main sirf free solutions prefer karta hun'
      },
      'WILLING_TO_PAY_MAYBE': {
        english: '🤔 Maybe, depends on the ROI and features',
        hindi: '🤔 हो सकता है, ROI और सुविधाओं पर निर्भर करता है',
        hinglish: '🤔 Ho sakta hai, ROI aur features par depend karta hai'
      },
      'URGENCY_IMMEDIATE': {
        english: '⏰ Immediate (within 1 month)',
        hindi: '⏰ तत्काल (1 महीने में)',
        hinglish: '⏰ Immediate (1 month me)'
      },
      'URGENCY_PLANNING': {
        english: '📅 Planning (2-6 months)',
        hindi: '📅 योजना बना रहे हैं (2-6 महीने)',
        hinglish: '📅 Planning kar rahe hain (2-6 months)'
      },
      'URGENCY_EXPLORING': {
        english: '👀 Just exploring solutions',
        hindi: '👀 सिर्फ समाधान देख रहे हैं',
        hinglish: '👀 Sirf solutions explore kar rahe hain'
      }
    },
    referralSource: {
      'FRIEND_REFERRAL': {
        english: '👥 Shared by a friend',
        hindi: '👥 दोस्त द्वारा शेयर किया गया',
        hinglish: '👥 Friend ne share kiya'
      },
      'GROUP_REFERRAL': {
        english: '👥 Found in a group/community',
        hindi: '👥 किसी ग्रुप/कम्युनिटी में मिला',
        hinglish: '👥 Kisi group/community me mila'
      }
    }
  };
  const [form, setForm] = useState({
    // Profile
    name: '',
    email: '',
    phone: '',
    city: '',
    propertyType: '',
    propertyCount: '',
    referralSource: '',
    friendName: '',
    groupName: '',
    
    // Challenges
    biggestChallenge: '',
    otherChallenge: '',
    
    // Platform Value
    switchReasons: [],
    otherSwitchReason: '',
    
    // Features
    topFeatures: [],
    otherFeature: '',
    
    // Success Metrics
    readyToPay: '',
    marketingSpend: '',
    recommendation: 5,
    timing: '',
    
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
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection effect
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);



  // Helper functions for ID-based option mapping system
  const getOptionText = (optionId, category) => {
    if (!optionId || !optionMappings[category] || !optionMappings[category][optionId]) {
      return optionId; // Return as-is if not found
    }
    return optionMappings[category][optionId][lang] || optionId;
  };

  // Helper function to get English text for database storage
  const getEnglishText = (optionId, category) => {
    if (!optionId || !optionMappings[category] || !optionMappings[category][optionId]) {
      return optionId; // Return as-is if not found
    }
    return optionMappings[category][optionId]['english'] || optionId;
  };

  const getOptionsList = (category) => {
    if (!optionMappings[category]) return [];
    return Object.keys(optionMappings[category]).map(id => ({
      id,
      text: optionMappings[category][id][lang]
    }));
  };

  // Language change handler - ID-based system
  const handleLanguageChange = (newLanguage) => {
    console.log('Owner form: Language changing from', lang, 'to', newLanguage);
    console.log('Current form state:', form);
    
    // With ID-based system, no conversion needed!
    // Form state already contains IDs, just change display language
    setLang(newLanguage);
    
    console.log('Language changed to', newLanguage, 'form state unchanged:', form);
  };

  // Language configurations
  const languages = {
    english: {
      title: '🏢 Platform Feedback - Property Owner',
      subtitle: 'Help us build the perfect PG & Room rental platform for you',
      steps: ['👤 Profile', '⚡ Challenges', '💎 Value', '🚀 Features', '📊 Success', '📤 Referral'],
      
      // Step 1: Profile
      profile: {
        title: 'Quick Profile Setup',
        subtitle: 'Tell us about yourself (30 seconds)',
        name: 'Full Name *',
        email: 'Email Address *',
        phone: 'Phone Number *',
        city: 'City/Area *',
        propertyType: 'Property Type *',
        propertyTypeOptions: [
          'Select your business type',
          '🏠 PG Only',
          '🏢 Rooms/Flats Only', 
          '🏠🏢 Both PG & Rooms'
        ],
        propertyCount: 'Total Properties Owned *',
        propertyCountOptions: ['Select count', '1-2', '3-5', '6-10', '10+']
      },
      
      // Step 2: Challenges  
      challenges: {
        title: 'What\'s Your BIGGEST Challenge Right Now?',
        subtitle: 'Select the one that bothers you most',
        options: [
          '🔍 Finding reliable tenants',
          '💰 Rent collection delays',
          '⏰ Too much time on property management',
          '🤝 Dealing with maintenance issues',
          '📊 Lack of proper analytics/reports',
          '💻 Using outdated/manual systems',
          '📞 Poor communication with tenants',
          '🏠 Property marketing challenges',
          '📝 Other challenge'
        ]
      },
      
      // Step 3: Platform Value
      platform: {
        title: 'Why Would You Switch to Our Platform?',
        subtitle: 'Select all that apply (be honest!)',
        options: [
          '💰 Better rent collection rates',
          '⏱️ Save 5+ hours per week',
          '🎯 Find quality tenants faster',
          '📱 Mobile-first experience',
          '📊 Real-time analytics & insights',
          '🤖 Automated processes',
          '💸 Reduce operational costs',
          '🔒 Better security & compliance',
          '📝 Other reason'
        ]
      },
      
      // Step 4: Features
      features: {
        title: 'Top Features You Need Most (4-8)',
        subtitle: 'Select 4-8 features that are most important for you',
        options: [
          '🏠 Advanced Property Listing',
          '👥 Tenant Screening & Verification',
          '💳 Automated Rent Collection',
          '🔧 Maintenance Management',
          '📊 Financial Reports & Analytics',
          '📱 Mobile App for Owners',
          '💬 In-app Communication',
          '📄 Digital Lease Management',
          '🔔 Smart Notifications',
          '🎯 Marketing & Lead Generation',
          '📝 Other feature'
        ]
      },
      
      // Step 5: Success
      success: {
        title: 'Investment & Success Metrics',
        subtitle: 'Help us understand your expectations',
        readyToPay: 'Monthly Budget for Platform *',
        readyToPayOptions: [
          'Select budget range',
          '₹500-1000 per property',
          '₹1000-2000 per property', 
          '₹2000-5000 per property',
          '₹5000+ per property'
        ],
        marketingSpend: 'Current Marketing Spend *',
        marketingSpendOptions: [
          'Select current spend',
          '₹0 - No marketing',
          '₹1000-5000/month',
          '₹5000-15000/month',
          '₹15000+/month'
        ],
        recommendation: 'Recommendation Score',
        timing: 'When would you start? *',
        timingOptions: [
          'Select timeline',
          '🚀 Immediately',
          '📅 Within 1 month',
          '⏳ 2-3 months',
          '🤔 Still researching'
        ]
      },
      
      // Step 6: Referral
      referral: {
        title: 'How Did You Get This Form?',
        subtitle: 'Help us understand how our property owners find us',
        referralType: 'How did you receive this form? *',
        referralOptions: [
          'Select source',
          '👥 Shared by a friend',
          '👥 Found in a group/community'
        ],
        friendName: 'Friend\'s Name',
        groupName: 'Group/Community Name'
      },
      
      navigation: {
        next: 'Next Step →',
        previous: '← Previous',
        submit: 'Submit Feedback 🚀'
      }
    },
    hindi: {
      title: '🏢 प्लेटफॉर्म फीडबैक - संपत्ति मालिक',
      subtitle: 'आपके लिए सबसे बेहतरीन PG और रूम रेंटल प्लेटफॉर्म बनाने में हमारी मदद करें',
      steps: ['👤 प्रोफाइल', '⚡ चुनौतियां', '💎 मूल्य', '🚀 फीचर्स', '📊 सफलता', '📤 रेफरल'],
      
      // Step 1: Profile
      profile: {
        title: 'त्वरित प्रोफाइल सेटअप',
        subtitle: 'अपने बारे में बताएं (30 सेकंड)',
        name: 'पूरा नाम *',
        email: 'ईमेल पता *',
        phone: 'फोन नंबर *',
        city: 'शहर/क्षेत्र *',
        propertyType: 'प्रॉपर्टी टाइप *',
        propertyTypeOptions: [
          'अपना व्यवसाय प्रकार चुनें',
          '🏠 केवल PG',
          '🏢 केवल कमरे/फ्लैट', 
          '🏠🏢 PG और कमरे दोनों'
        ],
        propertyCount: 'कुल संपत्तियों की संख्या *',
        propertyCountOptions: ['संख्या चुनें', '1-2', '3-5', '6-10', '10+']
      },
      
      // Step 2: Challenges  
      challenges: {
        title: 'अभी आपकी सबसे बड़ी समस्या क्या है?',
        subtitle: 'वह चुनें जो आपको सबसे ज्यादा परेशान करती है',
        options: [
          '🔍 भरोसेमंद किरायेदार ढूंढना',
          '💰 किराया वसूली में देरी',
          '⏰ संपत्ति प्रबंधन में बहुत समय',
          '🤝 रखरखाव की समस्याएं',
          '📊 उचित एनालिटिक्स/रिपोर्ट्स का अभाव',
          '💻 पुराने/मैन्युअल सिस्टम का उपयोग',
          '📞 किरायेदारों से खराब संवाद',
          '🏠 संपत्ति मार्केटिंग चुनौतियां',
          '📝 अन्य चुनौती'
        ]
      },
      
      // Step 3: Platform Value
      platform: {
        title: 'आप हमारे प्लेटफॉर्म पर क्यों स्विच करेंगे?',
        subtitle: 'सभी लागू विकल्प चुनें (ईमानदार रहें!)',
        options: [
          '💰 बेहतर किराया वसूली दरें',
          '⏱️ प्रति सप्ताह 5+ घंटे बचाएं',
          '🎯 गुणवत्तापूर्ण किरायेदार तेज़ी से खोजें',
          '📱 मोबाइल-फर्स्ट अनुभव',
          '📊 रीयल-टाइम एनालिटिक्स और इनसाइट्स',
          '🤖 स्वचालित प्रक्रियाएं',
          '💸 परिचालन लागत कम करें',
          '🔒 बेहतर सुरक्षा और अनुपालन',
          '📝 अन्य कारण'
        ]
      },
      
      // Step 4: Features
      features: {
        title: 'आपको सबसे ज्यादा जरूरी फीचर्स (4-8)',
        subtitle: '4-8 फीचर्स चुनें जो आपके लिए सबसे महत्वपूर्ण हैं',
        options: [
          '🏠 उन्नत संपत्ति लिस्टिंग',
          '👥 किरायेदार स्क्रीनिंग और सत्यापन',
          '💳 स्वचालित किराया वसूली',
          '🔧 रखरखाव प्रबंधन',
          '📊 वित्तीय रिपोर्ट्स और एनालिटिक्स',
          '📱 मालिकों के लिए मोबाइल ऐप',
          '💬 इन-ऐप कम्युनिकेशन',
          '📄 डिजिटल लीज प्रबंधन',
          '🔔 स्मार्ट नोटिफिकेशन',
          '🎯 मार्केटिंग और लीड जेनरेशन',
          '📝 अन्य फीचर'
        ]
      },
      
      // Step 5: Success
      success: {
        title: 'निवेश और सफलता मेट्रिक्स',
        subtitle: 'अपनी अपेक्षाओं को समझने में हमारी मदद करें',
        readyToPay: 'प्लेटफॉर्म के लिए मासिक बजट *',
        readyToPayOptions: [
          'बजट रेंज चुनें',
          '₹500-1000 प्रति संपत्ति',
          '₹1000-2000 प्रति संपत्ति', 
          '₹2000-5000 प्रति संपत्ति',
          '₹5000+ प्रति संपत्ति'
        ],
        marketingSpend: 'वर्तमान मार्केटिंग खर्च *',
        marketingSpendOptions: [
          'वर्तमान खर्च चुनें',
          '₹0 - कोई मार्केटिंग नहीं',
          '₹1000-5000/महीना',
          '₹5000-15000/महीना',
          '₹15000+/महीना'
        ],
        recommendation: 'सिफारिश स्कोर',
        timing: 'आप कब शुरू करेंगे? *',
        timingOptions: [
          'समयसीमा चुनें',
          '🚀 तुरंत',
          '📅 1 महीने के भीतर',
          '⏳ 2-3 महीने',
          '🤔 अभी भी रिसर्च कर रहे हैं'
        ]
      },
      
      // Step 6: Referral
      referral: {
        title: 'यह फॉर्म आपको कैसे मिला?',
        subtitle: 'हमें समझने में मदद करें कि हमारे संपत्ति मालिक हमें कैसे खोजते हैं',
        referralType: 'यह फॉर्म आपको कैसे मिला? *',
        referralOptions: [
          'सोर्स चुनें',
          '👥 दोस्त द्वारा शेयर किया गया',
          '👥 किसी ग्रुप/कम्युनिटी में मिला'
        ],
        friendName: 'दोस्त का नाम',
        groupName: 'ग्रुप/कम्युनिटी का नाम'
      },
      
      navigation: {
        next: 'अगला चरण →',
        previous: '← पिछला',
        submit: 'फीडबैक जमा करें 🚀'
      }
    },
    hinglish: {
      title: '🏢 Platform Feedback - Property Owner',
      subtitle: 'Aapke liye perfect PG aur Room rental platform banane mein humari madad kariye',
      steps: ['👤 Profile', '⚡ Challenges', '💎 Value', '🚀 Features', '📊 Success', '📤 Referral'],
      
      // Step 1: Profile
      profile: {
        title: 'Quick Profile Setup',
        subtitle: 'Apne baare mein batayiye (30 seconds)',
        name: 'Full Name *',
        email: 'Email Address *',
        phone: 'Phone Number *',
        city: 'City/Area *',
        propertyType: 'Property Type *',
        propertyTypeOptions: [
          'Apna business type select kariye',
          '🏠 Sirf PG',
          '🏢 Sirf Rooms/Flats', 
          '🏠🏢 PG aur Rooms dono'
        ],
        propertyCount: 'Total Properties ki Sankhya *',
        propertyCountOptions: ['Count select kariye', '1-2', '3-5', '6-10', '10+']
      },
      
      // Step 2: Challenges  
      challenges: {
        title: 'Abhi Aapki Sabse Badi Challenge Kya Hai?',
        subtitle: 'Woh select kariye jo aapko sabse zyada disturb karta hai',
        options: [
          '🔍 Reliable tenants dhundna',
          '💰 Rent collection mein delay',
          '⏰ Property management mein bahut time',
          '🤝 Maintenance issues handle karna',
          '📊 Proper analytics/reports ka lack',
          '💻 Outdated/manual systems use karna',
          '📞 Tenants ke sath poor communication',
          '🏠 Property marketing challenges',
          '📝 Other challenge'
        ]
      },
      
      // Step 3: Platform Value
      platform: {
        title: 'Aap Humare Platform Par Kyu Switch Karenge?',
        subtitle: 'Jo bhi apply karta hai select kariye (honest rahiye!)',
        options: [
          '💰 Better rent collection rates',
          '⏱️ Per week 5+ ghante bachayenge',
          '🎯 Quality tenants jaldi dhundenge',
          '📱 Mobile-first experience',
          '📊 Real-time analytics aur insights',
          '🤖 Automated processes',
          '💸 Operational costs kam karenge',
          '🔒 Better security aur compliance',
          '📝 Other reason'
        ]
      },
      
      // Step 4: Features
      features: {
        title: 'Aapko Sabse Zyada Zaruri Features (4-8)',
        subtitle: '4-8 features select kariye jo aapke liye sabse important hain',
        options: [
          '🏠 Advanced Property Listing',
          '👥 Tenant Screening & Verification',
          '💳 Automated Rent Collection',
          '🔧 Maintenance Management',
          '📊 Financial Reports & Analytics',
          '📱 Owners ke liye Mobile App',
          '💬 In-app Communication',
          '📄 Digital Lease Management',
          '🔔 Smart Notifications',
          '🎯 Marketing & Lead Generation',
          '📝 Other feature'
        ]
      },
      
      // Step 5: Success
      success: {
        title: 'Investment Aur Success Metrics',
        subtitle: 'Aapki expectations samjhne mein humari madad kariye',
        readyToPay: 'Platform ke liye Monthly Budget *',
        readyToPayOptions: [
          'Budget range select kariye',
          '₹500-1000 per property',
          '₹1000-2000 per property', 
          '₹2000-5000 per property',
          '₹5000+ per property'
        ],
        marketingSpend: 'Current Marketing Spend *',
        marketingSpendOptions: [
          'Current spend select kariye',
          '₹0 - Koi marketing nahi',
          '₹1000-5000/month',
          '₹5000-15000/month',
          '₹15000+/month'
        ],
        recommendation: 'Recommendation Score',
        timing: 'Kab start karenge? *',
        timingOptions: [
          'Timeline select kariye',
          '🚀 Turant',
          '📅 1 month ke andar',
          '⏳ 2-3 months',
          '🤔 Abhi bhi research kar rahe hain'
        ]
      },
      
      // Step 6: Referral
      referral: {
        title: 'Ye Form Aapko Kaise Mila?',
        subtitle: 'Humein samjhane me help kare ki hamare property owners humein kaise dhoondhtey hain',
        referralType: 'Ye form aapko kaise mila? *',
        referralOptions: [
          'Source select kare',
          '👥 Friend ne share kiya',
          '👥 Kisi group/community me mila'
        ],
        friendName: 'Friend ka naam',
        groupName: 'Group/Community ka naam'
      },
      
      navigation: {
        next: 'Next Step →',
        previous: '← Previous',
        submit: 'Submit Feedback 🚀'
      }
    }
  };

  const currentLang = languages[lang];

  // Device Submission Tracking Functions for Owner
  const checkPreviousOwnerSubmission = () => {
    try {
      const ownerSubmission = localStorage.getItem('ownerFeedbackSubmitted');
      if (ownerSubmission) {
        const submissionData = JSON.parse(ownerSubmission);
        const submissionTime = new Date(submissionData.timestamp);
        const now = new Date();
        
        // Check if submission is within last 30 days
        const daysDiff = (now - submissionTime) / (1000 * 60 * 60 * 24);
        
        if (daysDiff < 30) {
          setAlreadySubmitted(true);
          setSubmissionInfo(submissionData);
          return true;
        } else {
          // Clear old submission (older than 30 days)
          localStorage.removeItem('ownerFeedbackSubmitted');
        }
      }
      return false;
    } catch (error) {
      console.error('Error checking previous owner submission:', error);
      return false;
    }
  };

  const markOwnerAsSubmitted = (formData) => {
    try {
      const submissionRecord = {
        submitted: true,
        timestamp: new Date().toISOString(),
        type: 'owner',
        name: formData.name,
        email: formData.email,
        deviceInfo: {
          userAgent: navigator.userAgent,
          screen: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language
        }
      };
      
      localStorage.setItem('ownerFeedbackSubmitted', JSON.stringify(submissionRecord));
      localStorage.removeItem('ownerFeedbackForm');
      localStorage.removeItem('ownerFeedbackStep');
      localStorage.removeItem('ownerFeedbackLastSaved');
    } catch (error) {
      console.error('Error marking owner submission:', error);
    }
  };

  // Validation function
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
        if (!form.propertyType) newErrors.propertyType = 'Property type is required';
        if (!form.propertyCount) newErrors.propertyCount = 'Property count is required';
        break;
      case 2:
        if (!form.biggestChallenge) newErrors.biggestChallenge = 'Please select your biggest challenge';
        // Validate other challenge if "Other" is selected
        if (form.biggestChallenge === 'OTHER' && !form.otherChallenge.trim()) {
          newErrors.otherChallenge = 'Please specify your other challenge';
        }
        break;
      case 3:
        if (form.switchReasons.length === 0) newErrors.switchReasons = 'Please select at least one reason';
        // Validate other switch reason if "Other" is selected
        if (form.switchReasons.includes('OTHER') && !form.otherSwitchReason.trim()) {
          newErrors.otherSwitchReason = 'Please specify your other switch reason';
        }
        break;
      case 4:
        if (form.topFeatures.length < 4) newErrors.topFeatures = 'Please select at least 4 features';
        if (form.topFeatures.length > 8) newErrors.topFeatures = 'Please select maximum 8 features';
        // Validate other feature if "Other" is selected
        if (form.topFeatures.includes('OTHER') && !form.otherFeature.trim()) {
          newErrors.otherFeature = 'Please specify your other feature requirement';
        }
        break;
      case 5:
        if (!form.readyToPay) newErrors.readyToPay = 'Please select your budget';
        if (!form.marketingSpend) newErrors.marketingSpend = 'Please select your current spend';
        if (!form.timing) newErrors.timing = 'Please select your timeline';
        break;
      case 6:
        if (!form.referralSource) newErrors.referralSource = 'Please select how you found this form';
        if (form.referralSource === 'FRIEND_REFERRAL' && !form.friendName.trim()) {
          newErrors.friendName = 'Please enter your friend\'s name';
        }
        if (form.referralSource === 'GROUP_REFERRAL' && !form.groupName.trim()) {
          newErrors.groupName = 'Please enter the group/community name';
        }
        break;
      default:
        // No validation for unknown steps
        break;
    }
    
    return newErrors;
  };

  // Check if current step is complete (no validation errors)
  const isCurrentStepComplete = () => {
    const stepErrors = validateStep(currentStep);
    return Object.keys(stepErrors).length === 0;
  };

  // Advanced form change handler with real-time validation
  const handleChange = (field, value) => {
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
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Handle array changes (checkboxes)
  const handleArrayChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  // Handle next step with loading
  const handleNext = async () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setStepLoading(true);
    // Smooth transition with loading
    setTimeout(() => {
      setErrors({});
      if (currentStep < 6) {
        setCurrentStep(currentStep + 1);
        saveOwnerToLocalStorage(); // Save progress
      }
      setStepLoading(false);
    }, 300);
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  // Professional form submission with loading states
  const handleSubmit = async () => {
    const stepErrors = validateStep(6);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    // Start loading
    setLoading(true);
    setSubmitStatus('');

    try {
      // Calculate form completion time
      const completionTime = (Date.now() - form.formStartTime) / 1000; // in seconds
      
      // Convert IDs to English text for database storage
      const submissionData = {
        ...form,
        // Convert option IDs to English text
        city: form.city === 'OTHER' ? form.otherCity : getEnglishText(form.city, 'city'),
        propertyType: getEnglishText(form.propertyType, 'propertyType'),
        propertyCount: getEnglishText(form.propertyCount, 'propertyCount'),
        biggestChallenge: form.biggestChallenge ? getEnglishText(form.biggestChallenge, 'biggestChallenge') : '',
        switchReasons: form.switchReasons.map(id => getEnglishText(id, 'switchReasons')),
        topFeatures: form.topFeatures.map(id => getEnglishText(id, 'topFeatures')),
        readyToPay: getEnglishText(form.readyToPay, 'successMetrics'),
        marketingSpend: getEnglishText(form.marketingSpend, 'marketingSpend'),
        timing: getEnglishText(form.timing, 'successMetrics'),
        referralSource: getEnglishText(form.referralSource, 'referralSource'),
        // Add metadata
        completionTime,
        language: lang,
        submittedAt: new Date().toISOString()
      };

      const response = await fetch('https://feedbackform-aab9.onrender.com/api/owner-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });
      
      if (response.ok) {
        // Mark as submitted before showing success
        markOwnerAsSubmitted(submissionData);
        
        setSubmitStatus('success');
        showNotification('success', 
          lang === 'hindi' ? 'फीडबैक सफलतापूर्वक सबमिट हो गया! 🎉' : 
          lang === 'hinglish' ? 'Feedback successfully submit ho gaya! 🎉' :
          'Feedback successfully submitted! 🎉'
        );
        
        // Redirect to thank you page after success
        setTimeout(() => {
          const params = new URLSearchParams({
            name: submissionData.name,
            type: 'owner',
            lang: lang
          });
          window.location.href = `/thank-you?${params.toString()}`;
        }, 2000);
        
        // Reset form after success animation with delay (fallback)
        setTimeout(() => {
          setForm({
            name: '', email: '', phone: '', city: '', propertyType: '', propertyCount: '',
            biggestChallenge: '', otherChallenge: '', switchReasons: [], otherSwitchReason: '', 
            topFeatures: [], otherFeature: '', readyToPay: '', marketingSpend: '', 
            recommendation: 5, timing: '', formStartTime: Date.now()
          });
          setCurrentStep(1);
          setSubmitStatus('');
          clearOwnerLocalStorage(); // Clear saved data after success
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
      console.error('Owner form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show notification system
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 4000);
  };

  // Data Persistence Functions for Owner Form
  const saveOwnerToLocalStorage = useCallback(() => {
    try {
      localStorage.setItem('ownerFeedbackForm', JSON.stringify(form));
      localStorage.setItem('ownerFeedbackStep', currentStep.toString());
      localStorage.setItem('ownerFeedbackLastSaved', new Date().toISOString());
    } catch (error) {
      console.error('Failed to save owner form to localStorage:', error);
    }
  }, [form, currentStep]);

  const loadOwnerFromLocalStorage = useCallback(() => {
    try {
      const savedForm = localStorage.getItem('ownerFeedbackForm');
      const savedStep = localStorage.getItem('ownerFeedbackStep');
      const lastSaved = localStorage.getItem('ownerFeedbackLastSaved');
      
      if (savedForm && savedStep && lastSaved) {
        const saveTime = new Date(lastSaved);
        const now = new Date();
        const hoursDiff = (now.getTime() - saveTime.getTime()) / (1000 * 3600);
        
        // Only restore if saved within last 24 hours
        if (hoursDiff < 24) {
          setForm(JSON.parse(savedForm));
          setCurrentStep(parseInt(savedStep));
          showNotification('success', 
            lang === 'hindi' ? 'आपका पिछला डेटा restore हो गया! 📂' : 
            lang === 'hinglish' ? 'Aapka previous data restore ho gaya! 📂' :
            'Previous data restored! 📂'
          );
        } else {
          clearOwnerLocalStorage(); // Clear old data
        }
      }
    } catch (error) {
      console.error('Failed to load owner form from localStorage:', error);
    }
  }, [lang]);

  const clearOwnerLocalStorage = () => {
    localStorage.removeItem('ownerFeedbackForm');
    localStorage.removeItem('ownerFeedbackStep');
    localStorage.removeItem('ownerFeedbackLastSaved');
  };

  // Load data on component mount
  useEffect(() => {
    // Check if already submitted first
    const wasSubmitted = checkPreviousOwnerSubmission();
    if (!wasSubmitted) {
      loadOwnerFromLocalStorage();
    }
  }, [loadOwnerFromLocalStorage]);

  // Auto-save on form changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (form.name || form.email || form.phone) { // Only save if there's meaningful data
        saveOwnerToLocalStorage();
      }
    }, 1000); // 1 second debounce
    
    return () => clearTimeout(timer);
  }, [form, currentStep, saveOwnerToLocalStorage]);

  // Progress calculation
  const progress = (currentStep / 6) * 100;

  // If already submitted, redirect to thank you page
  if (alreadySubmitted && submissionInfo) {
    const params = new URLSearchParams({
      name: submissionInfo.name,
      type: 'owner',
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
      padding: '20px 0',
      position: 'relative'
    }}>
      {/* Language Selector */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: isMobile ? '4px' : '8px',
        zIndex: 1000
      }}>
        {['english', 'hindi', 'hinglish'].map(language => (
          <button
            key={language}
            onClick={() => handleLanguageChange(language)}
            style={{
              padding: isMobile ? '6px 12px' : '8px 16px',
              borderRadius: '25px',
              border: 'none',
              background: lang === language ? '#fff' : 'rgba(255,255,255,0.2)',
              color: lang === language ? '#667eea' : '#fff',
              cursor: 'pointer',
              fontSize: isMobile ? '12px' : '14px',
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
          padding: isMobile ? '16px' : '32px'
        }}>
          
          {/* Step 1: Profile */}
          {currentStep === 1 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: isMobile ? '20px' : '32px' }}>
                <h2 style={{
                  fontSize: isMobile ? '20px' : '24px',
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

              <div style={{ display: 'grid', gap: '24px' }}>
                {/* Row 1: Name + Email */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: !isMobile ? '1fr 1fr' : '1fr', 
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
                        padding: isMobile ? '16px 20px' : '12px 16px',
                        border: errors.name ? '2px solid #ef4444' : '1px solid #d1d5db',
                        borderRadius: isMobile ? '12px' : '8px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        background: '#fff',
                        boxSizing: 'border-box',
                        height: isMobile ? '52px' : '48px'
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
                        padding: isMobile ? '16px 20px' : '12px 16px',
                        border: errors.email ? '2px solid #ef4444' : '1px solid #d1d5db',
                        borderRadius: isMobile ? '12px' : '8px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        background: '#fff',
                        boxSizing: 'border-box',
                        height: isMobile ? '52px' : '48px'
                      }}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 2: Phone + City */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: !isMobile ? '1fr 1.5fr' : '1fr', 
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
                      {currentLang.profile.phone}
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      style={{
                        width: '100%',
                        padding: isMobile ? '16px 20px' : '12px 16px',
                        border: errors.phone ? '2px solid #ef4444' : '1px solid #d1d5db',
                        borderRadius: isMobile ? '12px' : '8px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        background: '#fff',
                        boxSizing: 'border-box',
                        height: isMobile ? '52px' : '48px'
                      }}
                      placeholder="Enter your phone number"
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
                      {currentLang.profile.city}
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      style={{
                        width: '100%',
                        padding: isMobile ? '16px 20px' : '12px 16px',
                        border: errors.city ? '2px solid #ef4444' : '1px solid #d1d5db',
                        borderRadius: isMobile ? '12px' : '8px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        background: '#fff',
                        boxSizing: 'border-box',
                        height: isMobile ? '52px' : '48px'
                      }}
                      placeholder="Enter your city"
                    />
                    {errors.city && (
                      <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                        {errors.city}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 3: Property Type + Count */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: !isMobile ? '1fr 1fr' : '1fr', 
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
                      {currentLang.profile.propertyType}
                    </label>
                    <select
                      value={form.propertyType}
                      onChange={(e) => handleChange('propertyType', e.target.value)}
                      style={{
                        width: '100%',
                        padding: isMobile ? '16px 20px' : '12px 16px',
                        border: errors.propertyType ? '2px solid #ef4444' : '1px solid #d1d5db',
                        borderRadius: isMobile ? '12px' : '8px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        background: '#fff',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                        height: isMobile ? '52px' : '48px'
                      }}
                    >
                      {currentLang.profile.propertyTypeOptions.map((option, idx) => (
                        <option key={idx} value={idx === 0 ? '' : option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.propertyType && (
                      <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                        {errors.propertyType}
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
                      {currentLang.profile.propertyCount}
                    </label>
                    <select
                      value={form.propertyCount}
                      onChange={(e) => handleChange('propertyCount', e.target.value)}
                      style={{
                        width: '100%',
                        padding: isMobile ? '16px 20px' : '12px 16px',
                        border: errors.propertyCount ? '2px solid #ef4444' : '1px solid #d1d5db',
                        borderRadius: isMobile ? '12px' : '8px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        background: '#fff',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                        height: isMobile ? '52px' : '48px'
                      }}
                    >
                      {currentLang.profile.propertyCountOptions.map((option, idx) => (
                        <option key={idx} value={idx === 0 ? '' : option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.propertyCount && (
                      <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                        {errors.propertyCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Challenges */}
          {currentStep === 2 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                  color: '#1e293b'
                }}>
                  {currentLang.challenges.title}
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#64748b',
                  margin: 0
                }}>
                  {currentLang.challenges.subtitle}
                </p>
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                {getOptionsList('biggestChallenge').map((option) => (
                  <label
                    key={option.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: isMobile ? '20px 24px' : '16px 20px',
                      border: form.biggestChallenge === option.id 
                        ? '2px solid #667eea' 
                        : '1px solid #e5e7eb',
                      borderRadius: isMobile ? '16px' : '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: form.biggestChallenge === option.id 
                        ? 'rgba(102, 126, 234, 0.05)' 
                        : '#fff',
                      minHeight: isMobile ? '56px' : '48px'
                    }}
                  >
                    <input
                      type="radio"
                      name="biggestChallenge"
                      value={option.id}
                      checked={form.biggestChallenge === option.id}
                      onChange={(e) => handleChange('biggestChallenge', e.target.value)}
                      style={{
                        marginRight: isMobile ? '16px' : '12px',
                        width: isMobile ? '20px' : '16px',
                        height: isMobile ? '20px' : '16px',
                        accentColor: '#667eea',
                        transform: isMobile ? 'scale(1.1)' : 'scale(1)'
                      }}
                    />
                    <span style={{
                      fontSize: isMobile ? '17px' : '15px',
                      color: '#374151',
                      lineHeight: '1.4'
                    }}>
                      {option.text}
                    </span>
                  </label>
                ))}
                
                {/* Other Challenge Input */}
                {form.biggestChallenge === 'OTHER' && (
                  <div style={{ marginTop: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      {
                        lang === 'hindi' ? 'अन्य चुनौती की जानकारी दें:' :
                        lang === 'hinglish' ? 'Other challenge ki details bataye:' :
                        'Please specify your other challenge:'
                      }
                    </label>
                    <textarea
                      value={form.otherChallenge}
                      onChange={(e) => handleChange('otherChallenge', e.target.value)}
                      placeholder={
                        lang === 'hindi' ? 'आपकी अन्य चुनौती के बारे में बताएं...' :
                        lang === 'hinglish' ? 'Aapki other challenge ke baare me bataye...' :
                        'Describe your other challenge in property management...'
                      }
                      style={{
                        width: '70%',
                        maxWidth: '500px',
                        margin: '0 auto',
                        display: 'block',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: errors.otherChallenge ? '2px solid #ef4444' : '1px solid #d1d5db',
                        fontSize: '16px',
                        minHeight: '80px',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    />
                    {errors.otherChallenge && (
                      <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                        {errors.otherChallenge}
                      </div>
                    )}
                  </div>
                )}
                
                {errors.biggestChallenge && (
                  <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>
                    {errors.biggestChallenge}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Platform Value */}
          {currentStep === 3 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                  color: '#1e293b'
                }}>
                  {currentLang.platform.title}
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#64748b',
                  margin: 0
                }}>
                  {currentLang.platform.subtitle}
                </p>
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                {getOptionsList('switchReasons').map((option) => (
                  <label
                    key={option.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px 20px',
                      border: form.switchReasons.includes(option.id) 
                        ? '2px solid #667eea' 
                        : '1px solid #e5e7eb',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: form.switchReasons.includes(option.id) 
                        ? 'rgba(102, 126, 234, 0.05)' 
                        : '#fff'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.switchReasons.includes(option.id)}
                      onChange={() => handleArrayChange('switchReasons', option.id)}
                      style={{
                        marginRight: '12px',
                        width: '16px',
                        height: '16px',
                        accentColor: '#667eea'
                      }}
                    />
                    <span style={{
                      fontSize: '15px',
                      color: '#374151',
                      lineHeight: '1.4'
                    }}>
                      {option.text}
                    </span>
                  </label>
                ))}
                
                {/* Other Switch Reason Input */}
                {form.switchReasons.includes('OTHER') && (
                  <div style={{ marginTop: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      {
                        lang === 'hindi' ? 'अन्य कारण की जानकारी दें:' :
                        lang === 'hinglish' ? 'Other reason ki details bataye:' :
                        'Please specify your other switch reason:'
                      }
                    </label>
                    <textarea
                      value={form.otherSwitchReason}
                      onChange={(e) => handleChange('otherSwitchReason', e.target.value)}
                      placeholder={
                        lang === 'hindi' ? 'आपके अन्य कारण के बारे में बताएं...' :
                        lang === 'hinglish' ? 'Aapke other reason ke baare me bataye...' :
                        'Describe your other reason for switching platforms...'
                      }
                      style={{
                        width: '70%',
                        maxWidth: '500px',
                        margin: '0 auto',
                        display: 'block',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: errors.otherSwitchReason ? '2px solid #ef4444' : '1px solid #d1d5db',
                        fontSize: '16px',
                        minHeight: '80px',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    />
                    {errors.otherSwitchReason && (
                      <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                        {errors.otherSwitchReason}
                      </div>
                    )}
                  </div>
                )}
                
                {errors.switchReasons && (
                  <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>
                    {errors.switchReasons}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Features */}
          {currentStep === 4 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
                
                {form.topFeatures.length > 0 && (
                  <div style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    background: form.topFeatures.length >= 4 && form.topFeatures.length <= 8 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(102, 126, 234, 0.1)',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: form.topFeatures.length >= 4 && form.topFeatures.length <= 8 ? '#22c55e' : '#667eea'
                  }}>
                    Selected: {form.topFeatures.length}/8 {form.topFeatures.length >= 4 ? '✓' : `(Need ${4 - form.topFeatures.length} more)`}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                {getOptionsList('topFeatures').map((option) => (
                  <label
                    key={option.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px 20px',
                      border: form.topFeatures.includes(option.id) 
                        ? '2px solid #667eea' 
                        : '1px solid #e5e7eb',
                      borderRadius: '12px',
                      cursor: form.topFeatures.length < 8 || form.topFeatures.includes(option.id) 
                        ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s ease',
                      background: form.topFeatures.includes(option.id) 
                        ? 'rgba(102, 126, 234, 0.05)' 
                        : '#fff',
                      opacity: form.topFeatures.length >= 8 && !form.topFeatures.includes(option.id) 
                        ? 0.5 : 1
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.topFeatures.includes(option.id)}
                      disabled={form.topFeatures.length >= 8 && !form.topFeatures.includes(option.id)}
                      onChange={() => handleArrayChange('topFeatures', option.id)}
                      style={{
                        marginRight: '12px',
                        width: '16px',
                        height: '16px',
                        accentColor: '#667eea'
                      }}
                    />
                    <span style={{
                      fontSize: '15px',
                      color: '#374151',
                      lineHeight: '1.4'
                    }}>
                      {option.text}
                    </span>
                  </label>
                ))}
                
                {/* Other Feature Input */}
                {form.topFeatures.includes('OTHER') && (
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
                
                {errors.topFeatures && (
                  <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>
                    {errors.topFeatures}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Success Metrics */}
          {currentStep === 5 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
                {/* Budget Selection */}
                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px',
                    textAlign: 'left'
                  }}>
                    {currentLang.success.readyToPay}
                  </label>
                  <select
                    value={form.readyToPay}
                    onChange={(e) => handleChange('readyToPay', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: errors.readyToPay ? '2px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      background: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    {currentLang.success.readyToPayOptions.map((option, idx) => (
                      <option key={idx} value={idx === 0 ? '' : option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.readyToPay && (
                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                      {errors.readyToPay}
                    </div>
                  )}
                </div>

                {/* Current Marketing Spend */}
                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px',
                    textAlign: 'left'
                  }}>
                    {currentLang.success.marketingSpend}
                  </label>
                  <select
                    value={form.marketingSpend}
                    onChange={(e) => handleChange('marketingSpend', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: errors.marketingSpend ? '2px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      background: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    {currentLang.success.marketingSpendOptions.map((option, idx) => (
                      <option key={idx} value={idx === 0 ? '' : option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.marketingSpend && (
                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                      {errors.marketingSpend}
                    </div>
                  )}
                </div>

                {/* Recommendation Score */}
                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px',
                    textAlign: 'left'
                  }}>
                    {currentLang.success.recommendation} (1-10): {form.recommendation}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={form.recommendation}
                    onChange={(e) => handleChange('recommendation', parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: '#e2e8f0',
                      outline: 'none',
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#64748b',
                    marginTop: '4px'
                  }}>
                    <span>1 (Never)</span>
                    <span>10 (Definitely)</span>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px',
                    textAlign: 'left'
                  }}>
                    {currentLang.success.timing}
                  </label>
                  <select
                    value={form.timing}
                    onChange={(e) => handleChange('timing', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: errors.timing ? '2px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      background: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    {currentLang.success.timingOptions.map((option, idx) => (
                      <option key={idx} value={idx === 0 ? '' : option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.timing && (
                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                      {errors.timing}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Referral */}
          {currentStep === 6 && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                  color: '#1e293b'
                }}>
                  {currentLang.referral.title}
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#64748b',
                  margin: 0
                }}>
                  {currentLang.referral.subtitle}
                </p>
              </div>

              <div style={{ display: 'grid', gap: '24px' }}>
                {/* Referral Type */}
                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '12px',
                    textAlign: 'left'
                  }}>
                    {currentLang.referral.referralType}
                  </label>
                  <select
                    value={form.referralSource}
                    onChange={(e) => handleChange('referralSource', e.target.value)}
                    style={{
                      width: '100%',
                      padding: isMobile ? '16px 20px' : '12px 16px',
                      border: errors.referralSource ? '2px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: isMobile ? '12px' : '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      background: '#fff',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236B7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'%3e%3c/path%3e%3c/svg%3e")',
                      backgroundPosition: isMobile ? 'right 16px center' : 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px',
                      paddingRight: isMobile ? '48px' : '40px',
                      appearance: 'none',
                      boxSizing: 'border-box',
                      height: isMobile ? '52px' : '48px'
                    }}
                  >
                    <option value="">{currentLang?.referral?.referralOptions?.[0] || 'Select source'}</option>
                    <option value="FRIEND_REFERRAL">
                      {optionMappings?.referralSource?.FRIEND_REFERRAL?.[lang] || '👥 Shared by a friend'}
                    </option>
                    <option value="GROUP_REFERRAL">
                      {optionMappings?.referralSource?.GROUP_REFERRAL?.[lang] || '👥 Found in a group/community'}
                    </option>
                  </select>
                  {errors.referralSource && (
                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                      {errors.referralSource}
                    </div>
                  )}
                </div>

                {/* Name Input - Show when any option is selected */}
                {(form.referralSource === 'FRIEND_REFERRAL' || form.referralSource === 'GROUP_REFERRAL') && (
                  <div>
                    <label style={{ 
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px',
                      textAlign: 'left'
                    }}>
                      {form.referralSource === 'FRIEND_REFERRAL'
                        ? (currentLang?.referral?.friendName || "Friend's Name")
                        : (currentLang?.referral?.groupName || "Group/Community Name")} *
                    </label>
                    <input
                      type="text"
                      value={form.referralSource === 'FRIEND_REFERRAL' ? form.friendName : form.groupName}
                      onChange={(e) => {
                        if (form.referralSource === 'FRIEND_REFERRAL') {
                          handleChange('friendName', e.target.value);
                        } else {
                          handleChange('groupName', e.target.value);
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: isMobile ? '20px 24px' : '16px 20px',
                        border: (errors.friendName || errors.groupName) ? '2px solid #ef4444' : '1px solid #d1d5db',
                        borderRadius: isMobile ? '15px' : '12px',
                        fontSize: isMobile ? '18px' : '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        background: '#fff',
                        boxSizing: 'border-box',
                        height: isMobile ? '60px' : '56px',
                        letterSpacing: '0.5px'
                      }}
                      placeholder={
                        form.referralSource === 'FRIEND_REFERRAL'
                          ? "Enter your friend's full name (e.g., Priya Gupta)"
                          : "Enter group/community name (e.g., Mumbai Property Owners Association)"
                      }
                    />
                    {(errors.friendName || errors.groupName) && (
                      <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                        {errors.friendName || errors.groupName}
                      </div>
                    )}
                  </div>
                )}
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
            onClick={handlePrevious}
            style={{
              padding: isMobile ? '16px 32px' : '12px 24px',
              border: '1px solid #d1d5db',
              borderRadius: isMobile ? '12px' : '8px',
              background: '#fff',
              color: '#374151',
              cursor: currentStep > 1 ? 'pointer' : 'not-allowed',
              fontSize: isMobile ? '18px' : '16px',
              fontWeight: '500',
              opacity: currentStep > 1 ? 1 : 0.5,
              transition: 'all 0.2s ease',
              minHeight: isMobile ? '48px' : '40px'
            }}
            disabled={currentStep === 1}
          >
            {currentLang.navigation.previous}
          </button>
          
          <button
            onClick={currentStep === 6 ? handleSubmit : handleNext}
            disabled={loading || stepLoading || !isCurrentStepComplete()}
            style={{
              padding: isMobile ? '16px 32px' : '12px 24px',
              border: 'none',
              borderRadius: isMobile ? '12px' : '8px',
              background: (loading || stepLoading || !isCurrentStepComplete()) 
                ? '#ccc' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              cursor: (loading || stepLoading || !isCurrentStepComplete()) ? 'not-allowed' : 'pointer',
              fontSize: isMobile ? '18px' : '16px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: (loading || stepLoading || !isCurrentStepComplete()) 
                ? 'none' 
                : '0 4px 12px rgba(102, 126, 234, 0.3)',
              opacity: (loading || stepLoading || !isCurrentStepComplete()) ? 0.6 : 1,
              minHeight: isMobile ? '48px' : '40px'
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
              currentStep === 6 ? currentLang.navigation.submit : currentLang.navigation.next
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
                  {lang === 'hindi' ? 'आपका मालिक फीडबैक सफलतापूर्वक सबमिट हो गया है।' : 
                   lang === 'hinglish' ? 'Aapka owner feedback successfully submit ho gaya hai.' : 
                   'Your owner feedback has been successfully submitted.'}
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

export default AdvancedOwnerFeedbackForm;