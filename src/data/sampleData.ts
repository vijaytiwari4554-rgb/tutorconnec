import { TutorProfile, CoachingProfile, CollegeProfile, BlogPost, SubscriptionPlan } from '../types';

export const CITIES = [
  'Mumbai', 'Delhi NCR', 'Bengaluru', 'Pune', 'Hyderabad', 
  'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'
];

export const CLASSES_BOARDS = {
  classes: [
    'Playgroup', 'Nursery', 'LKG', 'UKG',
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11', 'Class 12'
  ],
  boards: ['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE']
};

export const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 
  'English Literature', 'Grammar', 'History & Civics', 
  'Geography', 'Economics', 'Computer Science'
];

export const COMPETITIVE_EXAMS = [
  'UPSC Civil Services', 'JEE Main & Advanced', 'NEET UG', 'CAT (IIM)', 
  'GATE', 'NDA / CDS', 'MPSC / State PSC', 'CA Foundation', 'GRE / GMAT'
];

export const SKILL_COURSES = [
  'Coding (Python, Java)', 'AI & Machine Learning', 'Graphic Design & Canva',
  'Digital Marketing', 'Excel & Tally Prime', 'Video Editing (Premiere/CapCut)'
];

export const LANGUAGES = [
  'English', 'Hindi', 'Marathi', 'Gujarati', 'French', 'German', 'Japanese', 'Spanish'
];

export const HOBBIES = [
  'Music (Keyboard/Guitar/Singing)', 'Dance (Kathak/Western)', 'Yoga & Fitness', 
  'Chess Masterclass', 'Karate & Self Defense', 'Drawing & Painting', 'Abacus & Vedic Maths'
];

export const SAMPLE_TUTORS: TutorProfile[] = [
  {
    userId: 'tutor-1',
    name: 'Dr. Aarav Mehta',
    title: 'Senior Physics & JEE Prep Specialist',
    qualification: 'Ph.D. in Physics from IIT Bombay',
    experience: 12,
    subjects: ['Physics', 'Mathematics'],
    boards: ['CBSE', 'IB', 'ICSE'],
    classes: ['Class 11', 'Class 12'],
    fees: 1200,
    teachingModes: ['online', 'home'],
    languages: ['English', 'Hindi'],
    availability: {
      'Monday': '5 PM - 9 PM',
      'Wednesday': '5 PM - 9 PM',
      'Friday': '5 PM - 9 PM',
      'Saturday': '10 AM - 4 PM'
    },
    about: 'Passionate Physics educator with 12+ years of experience in coaching IIT-JEE aspirants. Former professor at elite institutes, specializing in conceptual clarity, visual problem solving, and rigorous preparation methodologies that helped over 400+ students secure sub-1000 ranks.',
    isFeatured: true,
    rating: 4.9,
    reviewCount: 34,
    whatsappNumber: '+919876543210',
    demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    userId: 'tutor-2',
    name: 'Anjali Sharma',
    title: 'Elementary & Middle School Math Wizard',
    qualification: 'M.Sc. in Mathematics, B.Ed (Delhi University)',
    experience: 7,
    subjects: ['Mathematics', 'Vedic Maths', 'Abacus'],
    boards: ['CBSE', 'ICSE', 'State Board'],
    classes: ['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
    fees: 600,
    teachingModes: ['online', 'center'],
    languages: ['English', 'Hindi', 'Punjabi'],
    availability: {
      'Tuesday': '3 PM - 7 PM',
      'Thursday': '3 PM - 7 PM',
      'Saturday': '9 AM - 1 PM'
    },
    about: 'Fostering a genuine love for mathematics by making logic interesting. I integrate Vedic Maths techniques to help students calculate 5x faster, overcome math phobia, and excel in board exams.',
    isFeatured: true,
    rating: 4.8,
    reviewCount: 28,
    whatsappNumber: '+919876543211'
  },
  {
    userId: 'tutor-3',
    name: 'Prof. Rajesh Kulkarni',
    title: 'UPSC Civil Services History & GS Expert',
    qualification: 'Retired IAS Officer, MA in History',
    experience: 20,
    subjects: ['History & Civics', 'Geography', 'UPSC Civil Services'],
    boards: ['State Board', 'CBSE'],
    classes: ['Class 11', 'Class 12'],
    fees: 1500,
    teachingModes: ['online'],
    languages: ['English', 'Marathi', 'Hindi'],
    availability: {
      'Saturday': '9 AM - 12 PM',
      'Sunday': '10 AM - 2 PM'
    },
    about: 'Leveraging decades of real administrative experience to train civil services aspirants. My sessions cover Answer Writing Strategies, General Studies Paper I & II, and personal mentoring for mock interviews.',
    isFeatured: false,
    rating: 5.0,
    reviewCount: 42,
    whatsappNumber: '+919876543212'
  },
  {
    userId: 'tutor-4',
    name: 'Neha Deshmukh',
    title: 'Full Stack Coding & AI Instructor for Kids',
    qualification: 'B.Tech in Computer Science from VJTI Mumbai',
    experience: 5,
    subjects: ['Coding (Python, Java)', 'AI & Machine Learning', 'Computer Science'],
    boards: ['IB', 'IGCSE', 'CBSE'],
    classes: ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    fees: 900,
    teachingModes: ['online', 'home'],
    languages: ['English', 'Marathi'],
    availability: {
      'Monday': '6 PM - 8 PM',
      'Tuesday': '6 PM - 8 PM',
      'Thursday': '6 PM - 8 PM',
      'Sunday': '2 PM - 6 PM'
    },
    about: 'I teach children how to build real products, websites, and games instead of just memorizing syntax. From Python games to training simple AI models, code is the ultimate creative outlet.',
    isFeatured: true,
    rating: 4.7,
    reviewCount: 19,
    whatsappNumber: '+919876543213'
  },
  {
    userId: 'tutor-5',
    name: 'Vikram Aditya',
    title: 'Foreign Languages Guru (French & German)',
    qualification: 'C2 Level Certified, MA in French Literature',
    experience: 8,
    subjects: ['French', 'German'],
    boards: ['CBSE', 'ICSE', 'IB', 'IGCSE'],
    classes: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    fees: 800,
    teachingModes: ['online', 'center'],
    languages: ['English', 'French', 'German', 'Hindi'],
    availability: {
      'Wednesday': '4 PM - 7 PM',
      'Friday': '4 PM - 7 PM',
      'Saturday': '11 AM - 5 PM'
    },
    about: 'Learn languages interactively! Using songs, short films, and situational conversations, I help students clear international exams (DELF/Goethe Certifications) and school curriculums with perfect pronunciation.',
    isFeatured: false,
    rating: 4.6,
    reviewCount: 15,
    whatsappNumber: '+919876543214'
  }
];

export const SAMPLE_COACHING: CoachingProfile[] = [
  {
    userId: 'coaching-1',
    instituteName: 'Apex IIT & Medical Academy',
    description: 'India\'s premier coaching center for JEE Main, JEE Advanced, and NEET. Offering structured offline modules, daily test series, and personalized doubt sessions led by stellar IITian faculties.',
    courses: [
      { name: 'JEE 2-Year Integrated Classroom Program', duration: '24 Months', fees: 280000 },
      { name: 'NEET Dropper Batch', duration: '12 Months', fees: 150000 },
      { name: 'NTSE & Foundation (Class 9-10)', duration: '10 Months', fees: 65000 }
    ],
    teachers: ['Dr. V. K. Bansal (Chemistry)', 'Prof. S. N. Sen (Physics)', 'Rajiv Verma, M.Sc. (Math)'],
    gallery: [
      'https://images.unsplash.com/photo-1541829019-25f256097c2d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop'
    ],
    address: 'Plot 42, Sector 17, Kothrud, Pune, MH',
    contact: '+91 20 2543 9988',
    rating: 4.8,
    reviewCount: 112
  },
  {
    userId: 'coaching-2',
    instituteName: 'Chanakya IAS Study Circle',
    description: 'Nurturing future administrators. Chanakya IAS has produced over 500+ civil servants since 2012. Specializing in integrated GS programs, essay structuring, and interactive interview simulations.',
    courses: [
      { name: 'UPSC Civil Services GS + CSAT Comprehensive', duration: '15 Months', fees: 175000 },
      { name: 'State PCS Fast-Track Mains Batch', duration: '6 Months', fees: 75000 }
    ],
    teachers: ['Retired Ambassador S. K. Nair', 'Pooja Hegde, MA (Pol Science)', 'Amit Rawat, IAS Mentor'],
    gallery: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop'
    ],
    address: 'B-12, Commercial Area, Mukherjee Nagar, Delhi',
    contact: '+91 11 4356 7788',
    rating: 4.9,
    reviewCount: 189
  }
];

export const SAMPLE_COLLEGES: CollegeProfile[] = [
  {
    userId: 'college-1',
    collegeName: 'Imperial College of Science & Engineering (ICSE)',
    description: 'Ranked among top private technical universities. Equipped with state-of-the-art incubation labs, deep corporate ties with global firms, and a beautiful green campus.',
    courses: [
      { name: 'B.Tech in Computer Science & Engineering', duration: '4 Years', feePerYear: 220000 },
      { name: 'B.Tech in Artificial Intelligence & Data Science', duration: '4 Years', feePerYear: 250000 },
      { name: 'M.Tech in Cybersecurity', duration: '2 Years', feePerYear: 150000 }
    ],
    departments: ['Computer Science', 'Data Science', 'Electronics', 'Mechanical Eng.'],
    gallery: [
      'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop'
    ],
    placementStats: '96% Placement in 2025. Highest package ₹44 LPA (Microsoft), Average Package ₹7.8 LPA.',
    rating: 4.6,
    reviewCount: 95
  }
];

export const SAMPLE_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Cracking JEE Advanced 2027: A Year-Wise Structured Strategy',
    slug: 'cracking-jee-advanced-strategy',
    content: 'JEE Advanced requires a unique approach compared to JEE Mains. While Mains tests speed and basic precision, Advanced evaluates deep concept integration. To start, split your preparation into active phases. Master core calculus, electromagnetism, and organic reaction mechanisms first. Build a solid routine of attempting high-difficulty multi-concept questions daily, and evaluate your progression with Weekly Mock Tests. Remember, conceptual purity beats mechanical repetition every single time.',
    category: 'Competitive Exams',
    author: 'Dr. Aarav Mehta',
    date: 'July 1, 2026',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
    views: 1240
  },
  {
    id: 'blog-2',
    title: 'Why Vedic Maths is the Ultimate Secret Weapon for Board Exams',
    slug: 'why-vedic-maths-secret-weapon',
    content: 'Speed is the biggest differentiator in board exam papers. Students who understand Vedic techniques like Nikhilam Sutra and Ekadhikena Purvena can do large three-digit multiplications and divisions within 3 seconds. This leaves ample time to review difficult questions, eliminate silly errors, and construct comprehensive proofs, boosting confidence and grades.',
    category: 'School Education',
    author: 'Anjali Sharma',
    date: 'June 28, 2026',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop',
    views: 890
  },
  {
    id: 'blog-3',
    title: 'Introduction to Generative AI: Guide for High School Coding Enthusiasts',
    slug: 'generative-ai-guide-high-school',
    content: 'Generative AI is transforming our relationship with computing. High schoolers can start by building simple API wrappers with Python, exploring basic neural network architectures, and training custom linear regressions using scikit-learn. Hands-on projects are the only way to genuinely grasp intelligence systems rather than treating them as magical black boxes.',
    category: 'Skill Courses',
    author: 'Neha Deshmukh',
    date: 'June 15, 2026',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1507513583067-862200e3663e?w=800&auto=format&fit=crop',
    views: 2150
  }
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'sub-tutor-standard',
    name: 'Tutor Bronze',
    price: 499,
    billing: 'monthly',
    role: 'tutor',
    features: ['Access up to 15 Student Leads', 'Basic Profile Search Visibility', 'Standard Verified Badge upon document verification', 'WhatsApp Connect support'],
    badgeColor: 'from-amber-600 to-amber-700 text-white'
  },
  {
    id: 'sub-tutor-premium',
    name: 'Tutor Premium Elite',
    price: 1299,
    billing: 'monthly',
    role: 'tutor',
    features: ['Unlimited Direct Student Leads', 'Priority Featured placement in Search results', 'Gold Verification Badge & Priority Docs audit', 'Interactive Video Demo embedding', 'Direct AI Recommendations engine matches'],
    badgeColor: 'from-yellow-400 to-amber-500 text-slate-900 font-bold'
  },
  {
    id: 'sub-coaching-pro',
    name: 'Institute Premium',
    price: 2999,
    billing: 'monthly',
    role: 'coaching',
    features: ['List up to 10 Courses & Batches', 'Direct Batch Admissions Portal link', 'Dedicated Photo/Video Gallery', 'Direct review moderation', 'Featured banner display space in local city searches'],
    badgeColor: 'from-indigo-600 to-purple-700 text-white font-bold'
  },
  {
    id: 'sub-college-ultra',
    name: 'College Placement Partner',
    price: 9999,
    billing: 'yearly',
    role: 'college',
    features: ['Full Placement & Admissions Brochure panel', 'Publish official placement statistics & recruitments', 'Campus Placement Partner banner', 'Unlimited Department directories', 'Direct admission query capture'],
    badgeColor: 'from-emerald-600 to-teal-700 text-white font-bold'
  }
];
