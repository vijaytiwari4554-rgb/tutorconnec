export type TranslationKey = 
  | 'heroTitle' | 'heroSubtitle' | 'searchPlaceholder' | 'findTutorBtn'
  | 'becomeTutorBtn' | 'subjectsTitle' | 'citiesTitle' | 'featuredTitle'
  | 'howItWorks' | 'studentReviews' | 'faqTitle' | 'faqSubtitle'
  | 'downloadApp' | 'footerDesc' | 'homeTuition' | 'onlineTuition'
  | 'verifiedBadge' | 'savedTutors' | 'dashboard' | 'profile'
  | 'messages' | 'notifications' | 'payments' | 'settings'
  | 'logout' | 'loginRegister' | 'experience' | 'hourlyFee'
  | 'languages' | 'teachingMode' | 'subjects' | 'bookDemo' | 'bookTuition';

export const TRANSLATIONS: Record<'en' | 'hi', Record<TranslationKey, string>> = {
  en: {
    heroTitle: "Find India's Best Verified Tutors & Institutes",
    heroSubtitle: "Direct connections for CBSE, ICSE, JEE, NEET, UPSC, Coding, languages, and hobby classes.",
    searchPlaceholder: "Search subjects, competitive exams, skill courses...",
    findTutorBtn: "Search Tutors",
    becomeTutorBtn: "Become a Tutor",
    subjectsTitle: "Explore Popular Subjects & Courses",
    citiesTitle: "Top Cities with Active Tutors",
    featuredTitle: "Featured Verified Tutors",
    howItWorks: "How TutorConnect Works",
    studentReviews: "What Parents & Students Say",
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Got questions? We have got answers to help you understand our platform better.",
    downloadApp: "Download TutorConnect India Mobile App",
    footerDesc: "India's elite education marketplace connecting students, parents, tutors, coaching institutes, and colleges since 2026.",
    homeTuition: "Home Tuition",
    onlineTuition: "Online Classes",
    verifiedBadge: "Verified",
    savedTutors: "Saved Tutors",
    dashboard: "Dashboard",
    profile: "Profile",
    messages: "Messages",
    notifications: "Notifications",
    payments: "Payments & Invoices",
    settings: "Settings",
    logout: "Log Out",
    loginRegister: "Login / Register",
    experience: "Experience",
    hourlyFee: "Hourly Fee",
    languages: "Languages",
    teachingMode: "Teaching Mode",
    subjects: "Subjects",
    bookDemo: "Book Free Demo",
    bookTuition: "Book Paid Classes"
  },
  hi: {
    heroTitle: "भारत के सर्वोत्तम सत्यापित शिक्षक और संस्थान खोजें",
    heroSubtitle: "सीबीएसई, आईसीएसई, जेईई, नीट, यूपीएससी, कोडिंग, भाषाएं और हॉबी क्लासेस के लिए सीधा संपर्क।",
    searchPlaceholder: "विषय, प्रतियोगी परीक्षा, कौशल पाठ्यक्रम खोजें...",
    findTutorBtn: "शिक्षक खोजें",
    becomeTutorBtn: "शिक्षक बनें",
    subjectsTitle: "लोकप्रिय विषय और पाठ्यक्रम देखें",
    citiesTitle: "सक्रिय शिक्षकों वाले शीर्ष शहर",
    featuredTitle: "विशेष सत्यापित शिक्षक",
    howItWorks: "ट्यूटरकनेक्ट कैसे काम करता है",
    studentReviews: "माता-पिता और छात्र क्या कहते हैं",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    faqSubtitle: "प्रश्न हैं? हमारी कार्यप्रणाली को बेहतर ढंग से समझने में मदद के लिए हमारे पास उत्तर हैं।",
    downloadApp: "ट्यूटरकनेक्ट इंडिया मोबाइल ऐप डाउनलोड करें",
    footerDesc: "भारत का अग्रणी शिक्षा मंच जो 2026 से छात्रों, अभिभावकों, शिक्षकों, कोचिंग संस्थानों और कॉलेजों को जोड़ रहा है।",
    homeTuition: "घर पर ट्यूशन",
    onlineTuition: "ऑनलाइन कक्षाएं",
    verifiedBadge: "सत्यापित",
    savedTutors: "सहेजे गए शिक्षक",
    dashboard: "डैशबोर्ड",
    profile: "प्रोफ़ाइल",
    messages: "संदेश",
    notifications: "सूचनाएं",
    payments: "भुगतान और इनवॉइस",
    settings: "सेटिंग्स",
    logout: "लॉग आउट",
    loginRegister: "लॉगिन / पंजीकरण",
    experience: "अनुभव",
    hourlyFee: "प्रति घंटा शुल्क",
    languages: "भाषाएं",
    teachingMode: "पढ़ाने का माध्यम",
    subjects: "विषय",
    bookDemo: "मुफ़्त डेमो बुक करें",
    bookTuition: "भुगतान कक्षाएं बुक करें"
  }
};
