import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', region: 'Global' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'North India' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', region: 'West Bengal / Bangladesh' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', region: 'Andhra Pradesh / Telangana' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', region: 'Maharashtra' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', region: 'Tamil Nadu' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', region: 'Gujarat' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'Karnataka' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', region: 'Kerala' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', region: 'Punjab' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', region: 'Odisha' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳', region: 'Assam' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳', region: 'North India' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', flag: '🇮🇳', region: 'Bihar / Jharkhand' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', flag: '🇮🇳', region: 'Classical' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', flag: '🇮🇳', region: 'Goa' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'کٲشُر', flag: '🇮🇳', region: 'Jammu & Kashmir' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', flag: '🇮🇳', region: 'Sindh region' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇮🇳', region: 'Northeast India' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', flag: '🇮🇳', region: 'Manipur' },
  { code: 'bodo', name: 'Bodo', nativeName: 'बड़ो', flag: '🇮🇳', region: 'Assam' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', flag: '🇮🇳', region: 'Jammu' },
];

// UI translations for key phrases
export const TRANSLATIONS = {
  en: {
    selectLanguage: 'Select Your Language',
    selectSubtitle: 'Choose a language to get information in your preferred language',
    continueBtn: 'Continue',
    searchPlaceholder: 'Search language...',
    changeLanguage: 'Change Language',
    navHome: 'Home',
    navRecommend: 'Recommend',
    navHistory: 'History',
    welcomeBack: 'Welcome back',
    loginTitle: 'Login',
    username: 'Username',
    password: 'Password',
    loginBtn: 'Login',
    noAccount: "Don't have an account?",
    signUp: 'Sign Up',
    logout: 'Logout',
    allLanguages: 'All Languages',
  },
  hi: {
    selectLanguage: 'अपनी भाषा चुनें',
    selectSubtitle: 'अपनी पसंदीदा भाषा में जानकारी प्राप्त करने के लिए एक भाषा चुनें',
    continueBtn: 'जारी रखें',
    searchPlaceholder: 'भाषा खोजें...',
    changeLanguage: 'भाषा बदलें',
    navHome: 'होम',
    navRecommend: 'सिफारिश',
    navHistory: 'इतिहास',
    welcomeBack: 'वापसी पर स्वागत है',
    loginTitle: 'लॉगिन',
    username: 'उपयोगकर्ता नाम',
    password: 'पासवर्ड',
    loginBtn: 'लॉगिन करें',
    noAccount: 'खाता नहीं है?',
    signUp: 'साइन अप करें',
    logout: 'लॉग आउट',
    allLanguages: 'सभी भाषाएँ',
  },
  bn: {
    selectLanguage: 'আপনার ভাষা বেছে নিন',
    selectSubtitle: 'আপনার পছন্দের ভাষায় তথ্য পেতে একটি ভাষা বেছে নিন',
    continueBtn: 'এগিয়ে যান',
    searchPlaceholder: 'ভাষা খুঁজুন...',
    changeLanguage: 'ভাষা পরিবর্তন করুন',
    navHome: 'হোম',
    navRecommend: 'সুপারিশ',
    navHistory: 'ইতিহাস',
    welcomeBack: 'আবার স্বাগতম',
    loginTitle: 'লগইন',
    username: 'ব্যবহারকারীর নাম',
    password: 'পাসওয়ার্ড',
    loginBtn: 'লগইন করুন',
    noAccount: 'অ্যাকাউন্ট নেই?',
    signUp: 'সাইন আপ করুন',
    logout: 'লগ আউট',
    allLanguages: 'সব ভাষা',
  },
  te: {
    selectLanguage: 'మీ భాషను ఎంచుకోండి',
    selectSubtitle: 'మీకు ఇష్టమైన భాషలో సమాచారం పొందడానికి ఒక భాషను ఎంచుకోండి',
    continueBtn: 'కొనసాగించు',
    searchPlaceholder: 'భాష వెతకండి...',
    changeLanguage: 'భాష మార్చండి',
    navHome: 'హోమ్',
    navRecommend: 'సిఫార్సు',
    navHistory: 'చరిత్ర',
    welcomeBack: 'తిరిగి స్వాగతం',
    loginTitle: 'లాగిన్',
    username: 'వినియోగదారు పేరు',
    password: 'పాస్వర్డ్',
    loginBtn: 'లాగిన్ చేయండి',
    noAccount: 'ఖాతా లేదా?',
    signUp: 'సైన్ అప్',
    logout: 'లాగ్ అవుట్',
    allLanguages: 'అన్ని భాషలు',
  },
  mr: {
    selectLanguage: 'तुमची भाषा निवडा',
    selectSubtitle: 'तुमच्या आवडत्या भाषेत माहिती मिळविण्यासाठी भाषा निवडा',
    continueBtn: 'पुढे जा',
    searchPlaceholder: 'भाषा शोधा...',
    changeLanguage: 'भाषा बदला',
    navHome: 'मुखपृष्ठ',
    navRecommend: 'शिफारस',
    navHistory: 'इतिहास',
    welcomeBack: 'परत स्वागत आहे',
    loginTitle: 'लॉगिन',
    username: 'वापरकर्तानाव',
    password: 'पासवर्ड',
    loginBtn: 'लॉगिन करा',
    noAccount: 'खाते नाही?',
    signUp: 'साइन अप करा',
    logout: 'लॉग आउट',
    allLanguages: 'सर्व भाषा',
  },
  ta: {
    selectLanguage: 'உங்கள் மொழியை தேர்ந்தெடுங்கள்',
    selectSubtitle: 'உங்கள் விருப்பமான மொழியில் தகவல்களைப் பெற ஒரு மொழியைத் தேர்ந்தெடுங்கள்',
    continueBtn: 'தொடரவும்',
    searchPlaceholder: 'மொழி தேடுங்கள்...',
    changeLanguage: 'மொழி மாற்றுங்கள்',
    navHome: 'முகப்பு',
    navRecommend: 'பரிந்துரை',
    navHistory: 'வரலாறு',
    welcomeBack: 'மீண்டும் வரவேற்கிறோம்',
    loginTitle: 'உள்நுழைவு',
    username: 'பயனர் பெயர்',
    password: 'கடவுச்சொல்',
    loginBtn: 'உள்நுழைக',
    noAccount: 'கணக்கு இல்லையா?',
    signUp: 'பதிவு செய்க',
    logout: 'வெளியேறு',
    allLanguages: 'அனைத்து மொழிகள்',
  },
  gu: {
    selectLanguage: 'તમારી ભાષા પસંદ કરો',
    selectSubtitle: 'તમારી પસંદની ભાષામાં માહિતી મેળવવા ભાષા પસંદ કરો',
    continueBtn: 'આગળ વધો',
    searchPlaceholder: 'ભાષા શોધો...',
    changeLanguage: 'ભાષા બદલો',
    navHome: 'હોમ',
    navRecommend: 'ભલામણ',
    navHistory: 'ઇતિહાસ',
    welcomeBack: 'પાછા સ્વાગત છે',
    loginTitle: 'લૉગિન',
    username: 'વપરાશકર્તાનું નામ',
    password: 'પાસવર્ડ',
    loginBtn: 'લૉગિન કરો',
    noAccount: 'ખાતું નથી?',
    signUp: 'સાઇન અપ',
    logout: 'લૉગ આઉટ',
    allLanguages: 'બધી ભાષાઓ',
  },
  kn: {
    selectLanguage: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ',
    selectSubtitle: 'ನಿಮಗೆ ಇಷ್ಟವಾದ ಭಾಷೆಯಲ್ಲಿ ಮಾಹಿತಿ ಪಡೆಯಲು ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ',
    continueBtn: 'ಮುಂದುವರಿಯಿರಿ',
    searchPlaceholder: 'ಭಾಷೆ ಹುಡುಕಿ...',
    changeLanguage: 'ಭಾಷೆ ಬದಲಿಸಿ',
    navHome: 'ಮನೆ',
    navRecommend: 'ಶಿಫಾರಸು',
    navHistory: 'ಇತಿಹಾಸ',
    welcomeBack: 'ಮತ್ತೆ ಸ್ವಾಗತ',
    loginTitle: 'ಲಾಗಿನ್',
    username: 'ಬಳಕೆದಾರ ಹೆಸರು',
    password: 'ಪಾಸ್ವರ್ಡ್',
    loginBtn: 'ಲಾಗಿನ್ ಮಾಡಿ',
    noAccount: 'ಖಾತೆ ಇಲ್ಲವೇ?',
    signUp: 'ಸೈನ್ ಅಪ್',
    logout: 'ಲಾಗ್ ಔಟ್',
    allLanguages: 'ಎಲ್ಲಾ ಭಾಷೆಗಳು',
  },
  ml: {
    selectLanguage: 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക',
    selectSubtitle: 'നിങ്ങൾക്ക് ഇഷ്ടമുള്ള ഭാഷയിൽ വിവരങ്ങൾ നേടാൻ ഒരു ഭാഷ തിരഞ്ഞെടുക്കുക',
    continueBtn: 'തുടരുക',
    searchPlaceholder: 'ഭാഷ തിരയുക...',
    changeLanguage: 'ഭാഷ മാറ്റുക',
    navHome: 'ഹോം',
    navRecommend: 'ശുപാർശ',
    navHistory: 'ചരിത്രം',
    welcomeBack: 'തിരിച്ചു സ്വാഗതം',
    loginTitle: 'ലോഗിൻ',
    username: 'ഉപയോക്തൃ നാമം',
    password: 'പാസ്‌വേഡ്',
    loginBtn: 'ലോഗിൻ ചെയ്യുക',
    noAccount: 'അക്കൗണ്ട് ഇല്ലേ?',
    signUp: 'സൈൻ അപ്',
    logout: 'ലോഗ് ഔട്ട്',
    allLanguages: 'എല്ലാ ഭാഷകളും',
  },
  pa: {
    selectLanguage: 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ',
    selectSubtitle: 'ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਵਿੱਚ ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਇੱਕ ਭਾਸ਼ਾ ਚੁਣੋ',
    continueBtn: 'ਜਾਰੀ ਰੱਖੋ',
    searchPlaceholder: 'ਭਾਸ਼ਾ ਖੋਜੋ...',
    changeLanguage: 'ਭਾਸ਼ਾ ਬਦਲੋ',
    navHome: 'ਹੋਮ',
    navRecommend: 'ਸਿਫਾਰਿਸ਼',
    navHistory: 'ਇਤਿਹਾਸ',
    welcomeBack: 'ਵਾਪਸ ਜੀ ਆਇਆਂ',
    loginTitle: 'ਲਾਗਇਨ',
    username: 'ਉਪਭੋਗਤਾ ਨਾਮ',
    password: 'ਪਾਸਵਰਡ',
    loginBtn: 'ਲਾਗਇਨ ਕਰੋ',
    noAccount: 'ਖਾਤਾ ਨਹੀਂ?',
    signUp: 'ਸਾਈਨ ਅਪ',
    logout: 'ਲੌਗ ਆਊਟ',
    allLanguages: 'ਸਾਰੀਆਂ ਭਾਸ਼ਾਵਾਂ',
  },
};

// Get translation for a key, fallback to English
export const getTranslation = (lang, key) => {
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS['en'][key] ?? key;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('cv_language') || 'en';
  });
  const [languageSelected, setLanguageSelected] = useState(() => {
    return localStorage.getItem('cv_language_selected') === 'true';
  });

  const selectLanguage = (code) => {
    setLanguage(code);
    setLanguageSelected(true);
    localStorage.setItem('cv_language', code);
    localStorage.setItem('cv_language_selected', 'true');
  };

  const resetLanguageSelection = () => {
    setLanguageSelected(false);
    localStorage.removeItem('cv_language_selected');
  };

  const t = (key) => getTranslation(language, key);

  const currentLanguage = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{
      language,
      languageSelected,
      currentLanguage,
      selectLanguage,
      resetLanguageSelection,
      t,
      LANGUAGES,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
