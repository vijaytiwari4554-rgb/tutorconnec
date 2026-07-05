import { 
  UserProfile, TutorProfile, CoachingProfile, CollegeProfile, 
  Booking, Review, Message, BlogPost, SubscriptionPlan, UserRole 
} from '../types';
import { SAMPLE_TUTORS, SAMPLE_COACHING, SAMPLE_COLLEGES, SAMPLE_BLOGS } from '../data/sampleData';

// Custom event system to notify subscribers of state changes
const listeners = new Set<() => void>();
export function subscribeToDB(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function notify() {
  listeners.forEach(l => l());
}

// Helper to load/save from localStorage
function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`tutorconnect_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`tutorconnect_${key}`, JSON.stringify(value));
    notify();
  } catch (e) {
    console.error('LocalStorage write failed:', e);
  }
}

// Database Initialization
const INITIAL_USERS: UserProfile[] = [
  {
    id: 'student-1',
    name: 'Rahul Kumar',
    email: 'rahul@gmail.com',
    role: 'student',
    phone: '+919876543220',
    city: 'Mumbai',
    area: 'Andheri West',
    pincode: '400053',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop',
    joinedAt: new Date('2026-01-10').toISOString()
  },
  {
    id: 'parent-1',
    name: 'Sunita Sharma',
    email: 'sunita@gmail.com',
    role: 'parent',
    phone: '+919876543221',
    city: 'Delhi NCR',
    area: 'Connaught Place',
    pincode: '110001',
    joinedAt: new Date('2026-02-15').toISOString()
  },
  {
    id: 'tutor-1',
    name: 'Dr. Aarav Mehta',
    email: 'aarav@tutor.com',
    role: 'tutor',
    phone: '+919876543210',
    city: 'Mumbai',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop',
    isVerified: true,
    rating: 4.9,
    reviewCount: 34,
    joinedAt: new Date('2026-01-05').toISOString()
  },
  {
    id: 'coaching-1',
    name: 'Apex IIT & Medical Academy',
    email: 'apex@academy.com',
    role: 'coaching',
    phone: '+912025439988',
    city: 'Pune',
    isVerified: true,
    joinedAt: new Date('2026-03-01').toISOString()
  },
  {
    id: 'college-1',
    name: 'Imperial College',
    email: 'imperial@college.edu',
    role: 'college',
    phone: '+914422334455',
    city: 'Chennai',
    isVerified: true,
    joinedAt: new Date('2026-04-10').toISOString()
  },
  {
    id: 'admin-1',
    name: 'Super Admin',
    email: 'vijaytiwari4554@gmail.com', // Pre-configured verified Admin from instructions
    role: 'admin',
    joinedAt: new Date('2026-01-01').toISOString()
  }
];

// Seed standard bookings
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-1',
    studentId: 'student-1',
    studentName: 'Rahul Kumar',
    studentEmail: 'rahul@gmail.com',
    tutorId: 'tutor-1',
    tutorName: 'Dr. Aarav Mehta',
    type: 'demo',
    mode: 'online',
    subject: 'Physics',
    dateTime: '2026-07-10T17:00:00',
    status: 'pending',
    paymentStatus: 'pending',
    amount: 0,
    createdAt: new Date().toISOString()
  }
];

// Seed standard reviews
const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    authorId: 'student-1',
    authorName: 'Rahul Kumar',
    authorRole: 'student',
    targetId: 'tutor-1',
    rating: 5,
    comment: 'Dr. Aarav is hands-down the best Physics teacher in Mumbai! His kinematics explanations are pure art.',
    createdAt: '2026-06-25T14:30:00'
  }
];

// Seed standard messages
const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    senderId: 'student-1',
    senderName: 'Rahul Kumar',
    receiverId: 'tutor-1',
    content: 'Hello Dr. Aarav, can we schedule a demo session for JEE Mechanics?',
    timestamp: Date.now() - 3600000 * 2
  },
  {
    id: 'msg-2',
    senderId: 'tutor-1',
    senderName: 'Dr. Aarav Mehta',
    receiverId: 'student-1',
    content: 'Hello Rahul! Of course. I have slots open on Mondays and Wednesdays at 5 PM. Please request a booking on my profile page.',
    timestamp: Date.now() - 3600000
  }
];

export const dbService = {
  // --- AUTH SERVICES ---
  getUsers: (): UserProfile[] => getStorage('users', INITIAL_USERS),
  getCurrentUser: (): UserProfile | null => getStorage('current_user', null),
  
  login: (email: string, role: UserRole): UserProfile => {
    const users = dbService.getUsers();
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    
    if (!user) {
      // Auto-register on first email login to keep onboarding frictionless
      user = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' '),
        email: email.toLowerCase(),
        role: role,
        joinedAt: new Date().toISOString()
      };
      setStorage('users', [...users, user]);
    }
    
    setStorage('current_user', user);
    return user;
  },
  
  logout: () => {
    setStorage('current_user', null);
  },
  
  updateProfile: (updates: Partial<UserProfile> & { name: string }) => {
    const currentUser = dbService.getCurrentUser();
    if (!currentUser) return;
    
    const updated = { ...currentUser, ...updates };
    setStorage('current_user', updated);
    
    const allUsers = dbService.getUsers();
    const index = allUsers.findIndex(u => u.id === currentUser.id);
    if (index > -1) {
      allUsers[index] = updated;
      setStorage('users', allUsers);
    }
  },

  // --- TUTOR SERVICES ---
  getTutors: (): TutorProfile[] => getStorage('tutors', SAMPLE_TUTORS),
  
  updateTutorProfile: (profile: Partial<TutorProfile>) => {
    const currentUser = dbService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'tutor') return;
    
    const tutors = dbService.getTutors();
    const index = tutors.findIndex(t => t.userId === currentUser.id);
    
    const updatedProfile: TutorProfile = {
      userId: currentUser.id,
      name: currentUser.name,
      title: profile.title || 'Professional Educator',
      qualification: profile.qualification || '',
      experience: Number(profile.experience) || 0,
      subjects: profile.subjects || [],
      boards: profile.boards || [],
      classes: profile.classes || [],
      fees: Number(profile.fees) || 500,
      teachingModes: profile.teachingModes || ['online'],
      languages: profile.languages || ['English'],
      availability: profile.availability || { 'Monday': '4 PM - 8 PM' },
      about: profile.about || '',
      whatsappNumber: profile.whatsappNumber || '',
      demoVideoUrl: profile.demoVideoUrl || '',
      rating: tutors[index]?.rating || 5.0,
      reviewCount: tutors[index]?.reviewCount || 0,
      documents: tutors[index]?.documents || { verified: false }
    };
    
    if (index > -1) {
      tutors[index] = updatedProfile;
    } else {
      tutors.push(updatedProfile);
    }
    setStorage('tutors', tutors);
  },

  verifyTutor: (userId: string) => {
    const tutors = dbService.getTutors();
    const index = tutors.findIndex(t => t.userId === userId);
    if (index > -1) {
      tutors[index].documents = { ...tutors[index].documents, verified: true };
      setStorage('tutors', tutors);
    }
    
    const users = dbService.getUsers();
    const uIdx = users.findIndex(u => u.id === userId);
    if (uIdx > -1) {
      users[uIdx].isVerified = true;
      setStorage('users', users);
    }
  },

  toggleSaveTutor: (tutorId: string) => {
    const saved = getStorage<string[]>('saved_tutors', []);
    if (saved.includes(tutorId)) {
      setStorage('saved_tutors', saved.filter(id => id !== tutorId));
    } else {
      setStorage('saved_tutors', [...saved, tutorId]);
    }
  },

  getSavedTutors: (): string[] => getStorage<string[]>('saved_tutors', []),

  // --- COACHING SERVICES ---
  getCoaching: (): CoachingProfile[] => getStorage('coaching_institutes', SAMPLE_COACHING),
  
  updateCoachingProfile: (profile: Partial<CoachingProfile>) => {
    const currentUser = dbService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'coaching') return;
    
    const coaching = dbService.getCoaching();
    const index = coaching.findIndex(c => c.userId === currentUser.id);
    
    const updated: CoachingProfile = {
      userId: currentUser.id,
      instituteName: currentUser.name,
      description: profile.description || '',
      courses: profile.courses || [],
      teachers: profile.teachers || [],
      gallery: profile.gallery || [],
      address: profile.address || '',
      contact: profile.contact || '',
      rating: coaching[index]?.rating || 5.0,
      reviewCount: coaching[index]?.reviewCount || 0
    };
    
    if (index > -1) {
      coaching[index] = updated;
    } else {
      coaching.push(updated);
    }
    setStorage('coaching_institutes', coaching);
  },

  // --- COLLEGE SERVICES ---
  getColleges: (): CollegeProfile[] => getStorage('colleges', SAMPLE_COLLEGES),
  
  updateCollegeProfile: (profile: Partial<CollegeProfile>) => {
    const currentUser = dbService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'college') return;
    
    const colleges = dbService.getColleges();
    const index = colleges.findIndex(c => c.userId === currentUser.id);
    
    const updated: CollegeProfile = {
      userId: currentUser.id,
      collegeName: currentUser.name,
      description: profile.description || '',
      courses: profile.courses || [],
      departments: profile.departments || [],
      gallery: profile.gallery || [],
      placementStats: profile.placementStats || '',
      rating: colleges[index]?.rating || 5.0,
      reviewCount: colleges[index]?.reviewCount || 0
    };
    
    if (index > -1) {
      colleges[index] = updated;
    } else {
      colleges.push(updated);
    }
    setStorage('colleges', colleges);
  },

  // --- BOOKING SERVICES ---
  getBookings: (): Booking[] => getStorage('bookings', INITIAL_BOOKINGS),
  
  createBooking: (fields: Omit<Booking, 'id' | 'status' | 'paymentStatus' | 'createdAt'>) => {
    const bookings = dbService.getBookings();
    const newBooking: Booking = {
      ...fields,
      id: `book-${Date.now()}`,
      status: 'pending',
      paymentStatus: fields.amount === 0 ? 'paid' : 'pending',
      createdAt: new Date().toISOString()
    };
    setStorage('bookings', [newBooking, ...bookings]);
    
    // Auto-create a mock message to notify tutor
    dbService.sendMessage(
      fields.tutorId, 
      `Hi! I have requested a ${fields.type} booking for ${fields.subject} on ${fields.dateTime.replace('T', ' ')}. Mode: ${fields.mode}.`
    );
    
    return newBooking;
  },

  updateBookingStatus: (bookingId: string, status: Booking['status'], paymentStatus?: Booking['paymentStatus']) => {
    const bookings = dbService.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index > -1) {
      bookings[index].status = status;
      if (paymentStatus) {
        bookings[index].paymentStatus = paymentStatus;
      }
      setStorage('bookings', bookings);
    }
  },

  // --- REVIEW SERVICES ---
  getReviews: (targetId?: string): Review[] => {
    const reviews = getStorage('reviews', INITIAL_REVIEWS);
    if (targetId) {
      return reviews.filter(r => r.targetId === targetId);
    }
    return reviews;
  },

  addReview: (targetId: string, rating: number, comment: string) => {
    const user = dbService.getCurrentUser();
    if (!user) return;
    
    const reviews = dbService.getReviews();
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      targetId,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };
    
    setStorage('reviews', [newReview, ...reviews]);
    
    // Update target rating averages
    const tutors = dbService.getTutors();
    const tIdx = tutors.findIndex(t => t.userId === targetId);
    if (tIdx > -1) {
      const targetReviews = reviews.filter(r => r.targetId === targetId).concat(newReview);
      const avg = targetReviews.reduce((sum, r) => sum + r.rating, 0) / targetReviews.length;
      tutors[tIdx].rating = parseFloat(avg.toFixed(1));
      tutors[tIdx].reviewCount = targetReviews.length;
      setStorage('tutors', tutors);
    }
    
    const coachings = dbService.getCoaching();
    const cIdx = coachings.findIndex(c => c.userId === targetId);
    if (cIdx > -1) {
      const targetReviews = reviews.filter(r => r.targetId === targetId).concat(newReview);
      const avg = targetReviews.reduce((sum, r) => sum + r.rating, 0) / targetReviews.length;
      coachings[cIdx].rating = parseFloat(avg.toFixed(1));
      coachings[cIdx].reviewCount = targetReviews.length;
      setStorage('coaching_institutes', coachings);
    }
  },

  // --- MESSAGE SERVICES ---
  getMessages: (): Message[] => getStorage('messages', INITIAL_MESSAGES),
  
  sendMessage: (receiverId: string, content: string) => {
    const user = dbService.getCurrentUser();
    if (!user) return;
    
    const messages = dbService.getMessages();
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      receiverId,
      content,
      timestamp: Date.now()
    };
    
    setStorage('messages', [...messages, newMsg]);
  },

  // --- SUBSCRIPTION & PREMIUM SERVICES ---
  purchaseSubscription: (planId: string) => {
    const user = dbService.getCurrentUser();
    if (!user) return;
    
    // Store active premium plan
    setStorage(`sub_active_${user.id}`, planId);
    
    // If user is a tutor, toggle their Featured status to showcase premium mechanics
    if (user.role === 'tutor' && planId.includes('premium')) {
      const tutors = dbService.getTutors();
      const index = tutors.findIndex(t => t.userId === user.id);
      if (index > -1) {
        tutors[index].isFeatured = true;
        setStorage('tutors', tutors);
      }
    }
    
    notify();
  },

  getSubscription: (userId: string): string | null => {
    return getStorage(`sub_active_${userId}`, null);
  },

  // --- BLOGS ---
  getBlogs: (): BlogPost[] => getStorage('blogs', SAMPLE_BLOGS),
  addBlog: (blog: Omit<BlogPost, 'id' | 'views' | 'date'>) => {
    const blogs = dbService.getBlogs();
    const newBlog: BlogPost = {
      ...blog,
      id: `blog-${Date.now()}`,
      views: 0,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };
    setStorage('blogs', [newBlog, ...blogs]);
  },

  // --- LANGUAGE (Multi-language Support: English/Hindi) ---
  getLang: (): 'en' | 'hi' => getStorage<'en' | 'hi'>('language', 'en'),
  setLang: (lang: 'en' | 'hi') => setStorage('language', lang)
};
