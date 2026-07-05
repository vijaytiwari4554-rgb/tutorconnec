export type UserRole = 'student' | 'parent' | 'tutor' | 'coaching' | 'college' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  city?: string;
  area?: string;
  pincode?: string;
  photoUrl?: string;
  isVerified?: boolean;
  rating?: number;
  reviewCount?: number;
  referralCode?: string;
  joinedAt: string;
}

export interface TutorProfile {
  userId: string;
  name: string;
  title: string;
  qualification: string;
  experience: number; // in years
  subjects: string[];
  boards: string[]; // CBSE, ICSE, State Board, IB, IGCSE
  classes: string[]; // Class 1-12, college courses, competitive exams
  fees: number; // Hourly fee in INR
  teachingModes: ('online' | 'home' | 'center')[];
  languages: string[];
  availability: { [day: string]: string }; // e.g., 'Monday': '4 PM - 8 PM'
  about: string;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  whatsappNumber?: string;
  demoVideoUrl?: string;
  city?: string;
  area?: string;
  pincode?: string;
  documents?: {
    degree?: string;
    idProof?: string;
    verified?: boolean;
  };
}

export interface CoachingProfile {
  userId: string;
  instituteName: string;
  description: string;
  courses: { name: string; duration: string; fees: number; mode?: string }[];
  teachers: string[];
  gallery: string[];
  address: string;
  contact: string;
  rating?: number;
  reviewCount?: number;
  city?: string;
  area?: string;
}

export interface CollegeProfile {
  userId: string;
  collegeName: string;
  description: string;
  courses: { name: string; duration: string; feePerYear: number }[];
  departments: string[];
  gallery: string[];
  placementStats: string;
  rating?: number;
  reviewCount?: number;
  city?: string;
  affiliation?: string;
}

export interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  tutorId: string;
  tutorName: string;
  type: 'demo' | 'tuition';
  mode: 'online' | 'home' | 'center';
  subject: string;
  dateTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid';
  amount: number;
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  targetId: string; // tutor, coaching, college
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  coverImage: string;
  views: number;
  likes?: number;
  createdAt?: string;
  summary?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billing: 'monthly' | 'yearly' | 'one-time';
  role: 'tutor' | 'coaching' | 'college';
  features: string[];
  badgeColor: string;
}
