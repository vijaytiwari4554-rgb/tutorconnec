import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, MapPin, Sparkles, BookOpen, Award, Laptop, 
  SlidersHorizontal, RefreshCw, User, LogOut, Globe, 
  Calendar, TrendingUp, Video, ShieldCheck, ChevronRight, Check, CheckCircle2,
  ChevronDown, BookMarked, PhoneCall, HelpCircle, ThumbsUp, Layers, GraduationCap
} from 'lucide-react';

import { ToastProvider, useToast } from './components/Toast';
import AuthModal from './components/AuthModal';
import NearbyMap from './components/NearbyMap';
import Dashboards from './components/Dashboards';
import SearchFilters from './components/SearchFilters';
import TutorCard from './components/TutorCard';
import { CoachingCard, CollegeCard, BlogCard } from './components/SecondaryViews';

import { dbService, subscribeToDB } from './lib/db';
import { 
  CITIES, CLASSES_BOARDS, SUBJECTS, COMPETITIVE_EXAMS, 
  SKILL_COURSES, LANGUAGES 
} from './data/sampleData';
import { TRANSLATIONS } from './data/translations';
type Language = 'en' | 'hi';
const translations = TRANSLATIONS;
import { TutorProfile, CoachingProfile, CollegeProfile, BlogPost } from './types';

function TutorConnectMain() {
  const { toast } = useToast();
  
  // App states
  const [currentUser, setCurrentUser] = useState(dbService.getCurrentUser());
  const [language, setLanguage] = useState<Language>('en');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeSegment, setActiveSegment] = useState<'tutors' | 'coaching' | 'colleges' | 'blogs'>('tutors');
  
  // Filter state
  const [filters, setFilters] = useState({
    city: '',
    area: '',
    pincode: '',
    classLevel: '',
    board: '',
    subject: '',
    exam: '',
    skill: '',
    language: '',
    mode: '',
    minExperience: 0,
    verifiedOnly: false,
    searchQuery: ''
  });

  // Saved list tracking
  const [savedTutors, setSavedTutors] = useState<string[]>(dbService.getSavedTutors());

  // AI match state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    recommendedTutorIds: string[];
    aiAnalysis: string;
    justifications: Record<string, string>;
  } | null>(null);

  // Sync session and local storage updates
  useEffect(() => {
    const sync = () => {
      setCurrentUser(dbService.getCurrentUser());
      setSavedTutors(dbService.getSavedTutors());
    };
    sync();
    return subscribeToDB(sync);
  }, []);

  const resetFilters = () => {
    setFilters({
      city: '',
      area: '',
      pincode: '',
      classLevel: '',
      board: '',
      subject: '',
      exam: '',
      skill: '',
      language: '',
      mode: '',
      minExperience: 0,
      verifiedOnly: false,
      searchQuery: ''
    });
    setAiResult(null);
    setAiPrompt('');
    toast('Filters successfully reset to default settings.', 'info');
  };

  // 1. Core Matching Engine (Local filter)
  const allTutors = dbService.getTutors();
  const allCoaching = dbService.getCoaching();
  const allColleges = dbService.getColleges();
  const allBlogs = dbService.getBlogs();

  // Filter Tutors
  const matchedTutors = allTutors.filter((t) => {
    if (filters.city && t.city?.toLowerCase() !== filters.city.toLowerCase()) return false;
    if (filters.area && !t.about.toLowerCase().includes(filters.area.toLowerCase())) return false;
    if (filters.pincode && t.pincode && !t.pincode.includes(filters.pincode)) return false;
    if (filters.classLevel && !t.classes.some(c => c.toLowerCase() === filters.classLevel.toLowerCase())) return false;
    if (filters.board && !t.boards.some(b => b.toLowerCase() === filters.board.toLowerCase())) return false;
    if (filters.subject && !t.subjects.some(s => s.toLowerCase() === filters.subject.toLowerCase())) return false;
    if (filters.language && !t.languages.some(l => l.toLowerCase() === filters.language.toLowerCase())) return false;
    if (filters.mode && !t.teachingModes.includes(filters.mode as any)) return false;
    if (filters.minExperience && t.experience < filters.minExperience) return false;
    if (filters.verifiedOnly && t.documents?.verified === false) return false;
    
    // Keyword query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const nameMatch = t.name.toLowerCase().includes(query);
      const subMatch = t.subjects.some(s => s.toLowerCase().includes(query));
      const qualMatch = t.qualification.toLowerCase().includes(query);
      const aboutMatch = t.about.toLowerCase().includes(query);
      return nameMatch || subMatch || qualMatch || aboutMatch;
    }
    return true;
  });

  // Filter Coaching
  const matchedCoaching = allCoaching.filter((c) => {
    if (filters.city && c.city?.toLowerCase() !== filters.city.toLowerCase()) return false;
    if (filters.exam && !c.courses.some(course => course.name.toLowerCase().includes(filters.exam.toLowerCase()))) return false;
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return c.instituteName.toLowerCase().includes(query) || (c.area && c.area.toLowerCase().includes(query));
    }
    return true;
  });

  // Filter Colleges
  const matchedColleges = allColleges.filter((col) => {
    if (filters.city && col.city?.toLowerCase() !== filters.city.toLowerCase()) return false;
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return col.collegeName.toLowerCase().includes(query) || (col.affiliation && col.affiliation.toLowerCase().includes(query));
    }
    return true;
  });

  // Quick Action category triggers
  const handleQuickSubject = (subject: string) => {
    setFilters(prev => ({ ...prev, subject }));
    setActiveSegment('tutors');
    toast(`Filtered by subject: ${subject}`, 'info');
  };

  const handleQuickCity = (city: string) => {
    setFilters(prev => ({ ...prev, city }));
    toast(`Search centered around ${city}`, 'info');
  };

  // 2. AI Recommendation Handler (Full-Stack Proxy Call)
  const handleAiRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) {
      toast('Please enter a learning profile or query!', 'error');
      return;
    }

    setIsAiLoading(true);
    setAiResult(null);

    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentPrompt: aiPrompt,
          tutors: allTutors,
          studentProfile: currentUser
        })
      });

      if (!response.ok) {
        throw new Error('AI recommendation backend failure.');
      }

      const data = await response.json();
      setAiResult(data);
      toast('AI Search grounded! Custom recommendations loaded below.', 'success');
    } catch (error) {
      console.error(error);
      toast('Failed to generate neural recommendation. Fallback matching active.', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Localization translator
  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      
      {/* 1. STICKY BRAND NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-saffron-500 via-amber-500 to-indigo-600 flex items-center justify-center font-extrabold text-white text-lg tracking-wider shadow-md shadow-amber-600/15" style={{
                backgroundImage: 'linear-gradient(to right, #f97316, #f59e0b, #4f46e5)'
              }}>
                TC
              </div>
              <div>
                <span className="block text-sm font-extrabold font-display tracking-tight text-slate-900">
                  TutorConnect <span className="text-indigo-600">India</span>
                </span>
                <span className="block text-[8px] uppercase tracking-widest font-black text-slate-400">
                  Peer-to-Peer Edu Hub
                </span>
              </div>
            </div>

            {/* Desktop Center Menu */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
              <a href="#marketplace" onClick={() => setActiveSegment('tutors')} className="hover:text-indigo-600 transition-colors">Tutors List</a>
              <a href="#marketplace" onClick={() => setActiveSegment('coaching')} className="hover:text-indigo-600 transition-colors">Coaching Batches</a>
              <a href="#marketplace" onClick={() => setActiveSegment('colleges')} className="hover:text-indigo-600 transition-colors">College Placements</a>
              <a href="#map-section" className="hover:text-indigo-600 transition-colors">GPS Radar Map</a>
              <a href="#blogs" className="hover:text-indigo-600 transition-colors">Expert Articles</a>
            </nav>

            {/* Right Action buttons */}
            <div className="flex items-center gap-3">
              
              {/* Language Switcher */}
              <button
                onClick={() => {
                  const nextLang = language === 'en' ? 'hi' : 'en';
                  setLanguage(nextLang);
                  toast(`Language toggled to ${nextLang === 'hi' ? 'Hindi (हिन्दी)' : 'English'}`, 'info');
                }}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="Switch Language / भाषा बदलें"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'en' ? 'EN' : 'हिन्दी'}</span>
              </button>

              {/* User authentication badge */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <a
                    href="#dashboard-workspace"
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 rounded-xl transition-all font-bold text-xs"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="hidden sm:inline">Workspace</span>
                  </a>
                  <button
                    onClick={() => {
                      dbService.logout();
                      toast('Successfully logged out of your session.', 'info');
                    }}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  {t('login_register')}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. DYNAMIC BENTO HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-16 md:py-24">
        {/* Background ambient flare */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                {t('tagline')}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight leading-tight">
                Connect Directly with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-saffron-500 to-indigo-400">Elite Peers & Tutors</span> for Home & Online Learning
              </h1>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed font-medium">
                TutorConnect India is a 100% transparent, commission-free peer-to-peer directory. Instantly compare verified subject experts, competitive exam coaches (JEE, UPSC, NEET), nearby academies, and college programs under a single search.
              </p>

              {/* Quick action Subject tags */}
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Popular Subject Channels:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'UPSC Prelims', 'NEET Prep'].map((sub) => (
                    <button
                      key={sub}
                      onClick={() => handleQuickSubject(sub)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-indigo-400 border border-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick action City tags */}
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Major Indian Education Hubs:</span>
                <div className="flex flex-wrap gap-1.5">
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => handleQuickCity(c)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-850 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3 text-indigo-500" />
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Hero Right: Smart Neural Matcher card */}
            <div className="lg:col-span-5">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative">
                <span className="absolute -top-3 right-6 px-3 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-extrabold rounded-full text-[9px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  Neural Matcher
                </span>
                
                <h3 className="text-lg font-black font-display text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                  Gemini-Powered Smart Match
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Describe your learning goals, budget, or preferred teaching medium in plain English. Our system aligns search priorities via Gemini 1.5 Flash!
                </p>

                <form onSubmit={handleAiRecommendation} className="space-y-3">
                  <textarea
                    rows={3}
                    required
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., 'Looking for an experienced Class 12 CBSE Physics tutor in Mumbai who can teach home tuition in Hindi and holds 5+ years experience...'"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-semibold leading-relaxed"
                  />
                  <button
                    type="submit"
                    disabled={isAiLoading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-extrabold text-xs rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isAiLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        Analyzing with TutorConnect Neural AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-white animate-pulse" />
                        Generate AI Recommendations
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. NEURAL RECOMMENDATIONS DISPLAY AREA */}
      <AnimatePresence>
        {aiResult && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12"
          >
            <div className="bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden text-white shadow-xl">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-black font-display tracking-tight">AI recommendation insights</h3>
                  <p className="text-xs text-slate-400 mt-1">Grounded analysis based on student criteria match.</p>
                </div>
              </div>

              <div className="bg-slate-950/40 p-5 border border-slate-850 rounded-2xl mb-6 text-xs leading-relaxed text-slate-300 font-medium">
                {aiResult.aiAnalysis}
              </div>

              {/* Recommended profiles list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allTutors.filter(t => aiResult.recommendedTutorIds.includes(t.userId)).map((tutor) => (
                  <div key={tutor.userId} className="relative">
                    <TutorCard
                      tutor={tutor}
                      onSaveToggle={dbService.toggleSaveTutor}
                      isSaved={savedTutors.includes(tutor.userId)}
                    />
                    {/* Specific justification floating comment */}
                    {aiResult.justifications[tutor.userId] && (
                      <div className="absolute -bottom-4 left-4 right-4 bg-indigo-950 border border-indigo-500/30 p-2 rounded-xl text-[10px] text-indigo-300 font-semibold shadow-xl z-20">
                        ✨ {aiResult.justifications[tutor.userId]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 4. USER WORKSPACE PORTAL */}
      {currentUser && (
        <section id="dashboard-workspace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 scroll-mt-20">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100 font-bold uppercase tracking-wide">
                  Secure Workspace Active
                </span>
                <h2 className="text-xl font-black text-slate-900 font-display mt-1">Platform Control Dashboard</h2>
              </div>
              <button
                onClick={() => {
                  dbService.logout();
                  toast('Logged out of session.', 'info');
                }}
                className="text-xs text-rose-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
            
            <Dashboards />
          </div>
        </section>
      )}

      {/* 5. LIVE GPS NEARBY MAP RADER */}
      <section id="map-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <NearbyMap
          tutors={matchedTutors}
          coaching={matchedCoaching}
          colleges={matchedColleges}
          selectedCity={filters.city || 'India'}
          onSelectTutor={(tutor) => {
            setFilters(prev => ({ ...prev, searchQuery: tutor.name }));
            setActiveSegment('tutors');
            toast(`Centered view around ${tutor.name}`, 'info');
          }}
        />
      </section>

      {/* 6. PRIMARY EXPLORER MARKETPLACE */}
      <main id="marketplace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar filters column */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <SearchFilters
              filters={filters}
              setFilters={setFilters}
              onReset={resetFilters}
            />
          </div>
        </div>

        {/* Catalog lists column */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Marketplace navigation segments */}
          <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-100 rounded-2xl">
            {[
              { id: 'tutors', label: `Verified Tutors (${matchedTutors.length})`, icon: GraduationCap },
              { id: 'coaching', label: `Coaching Academies (${matchedCoaching.length})`, icon: Laptop },
              { id: 'colleges', label: `College Programs (${matchedColleges.length})`, icon: Award }
            ].map((seg) => (
              <button
                key={seg.id}
                onClick={() => setActiveSegment(seg.id as any)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeSegment === seg.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <seg.icon className="w-4 h-4" />
                {seg.label}
              </button>
            ))}
          </div>

          {/* Results views switcher */}
          <div className="min-h-[400px]">
            {activeSegment === 'tutors' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matchedTutors.map((tutor) => (
                    <TutorCard
                      key={tutor.userId}
                      tutor={tutor}
                      onSaveToggle={dbService.toggleSaveTutor}
                      isSaved={savedTutors.includes(tutor.userId)}
                    />
                  ))}
                </div>
                {matchedTutors.length === 0 && (
                  <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl text-slate-400 font-medium">
                    No verified tutors match your active search filters. Try clearing some constraints.
                  </div>
                )}
              </div>
            )}

            {activeSegment === 'coaching' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matchedCoaching.map((inst) => (
                    <CoachingCard
                      key={inst.userId}
                      institute={inst}
                    />
                  ))}
                </div>
                {matchedCoaching.length === 0 && (
                  <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl text-slate-400 font-medium">
                    No coaching institutes found in this selection.
                  </div>
                )}
              </div>
            )}

            {activeSegment === 'colleges' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matchedColleges.map((col) => (
                    <CollegeCard
                      key={col.userId}
                      college={col}
                    />
                  ))}
                </div>
                {matchedColleges.length === 0 && (
                  <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl text-slate-400 font-medium">
                    No colleges found in this selection.
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* 7. EXPERT ARTICLES & BLOG PANEL */}
      <section id="blogs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 border-t border-slate-200/50 pt-16">
        <div className="text-center mb-8">
          <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider block mb-1">Knowledge Hub</span>
          <h2 className="text-2xl font-black font-display text-slate-900 tracking-tight">Expert Articles & Academic Blogs</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto leading-relaxed">
            Latest guidelines on choosing competitive exam batches, home learning efficiency metrics, and parenting advice.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBlogs.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
            />
          ))}
        </div>
      </section>

      {/* 8. COMPLETE BRAND FOOTER WITH SEO INDEX INDICES */}
      <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          
          {/* Main Footer blocks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-slate-800 pb-12 mb-12">
            
            {/* Branding widget */}
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center font-extrabold text-white text-sm" style={{
                  backgroundImage: 'linear-gradient(to right, #f59e0b, #4f46e5)'
                }}>
                  TC
                </div>
                <span className="font-extrabold text-slate-100 text-sm">TutorConnect <span className="text-indigo-500">India</span></span>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                Peer-to-peer education directory connecting students and verified tutors directly across Indian states. 100% commission free.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="font-bold text-xs text-slate-100 uppercase tracking-widest mb-4">Academics</h5>
              <ul className="space-y-2.5 text-xs font-medium">
                <li><a href="#marketplace" className="hover:text-indigo-400 transition-colors">Class 10 CBSE Math</a></li>
                <li><a href="#marketplace" className="hover:text-indigo-400 transition-colors">Class 12 ISC Physics</a></li>
                <li><a href="#marketplace" className="hover:text-indigo-400 transition-colors">UPSC Optional Prep</a></li>
                <li><a href="#marketplace" className="hover:text-indigo-400 transition-colors">IIT JEE Chemistry</a></li>
              </ul>
            </div>

            {/* Competitive exams links */}
            <div>
              <h5 className="font-bold text-xs text-slate-100 uppercase tracking-widest mb-4">Indian Competitive Exams</h5>
              <ul className="space-y-2.5 text-xs font-medium">
                <li><a href="#marketplace" className="hover:text-indigo-400 transition-colors">UPSC (IAS/IFS) Guidance</a></li>
                <li><a href="#marketplace" className="hover:text-indigo-400 transition-colors">MPSC State Exam Prep</a></li>
                <li><a href="#marketplace" className="hover:text-indigo-400 transition-colors">GATE Engineering Exam</a></li>
                <li><a href="#marketplace" className="hover:text-indigo-400 transition-colors">CA Foundation / Final</a></li>
              </ul>
            </div>

            {/* General */}
            <div>
              <h5 className="font-bold text-xs text-slate-100 uppercase tracking-widest mb-4">Legal & Transparency</h5>
              <ul className="space-y-2.5 text-xs font-medium">
                <li><span className="block text-slate-500">No Commission Fee Guarantee</span></li>
                <li><span className="block text-slate-500">Verified Badge Policy</span></li>
                <li><span className="block text-slate-500">Direct WhatsApp Connections</span></li>
                <li><span className="block text-slate-500">Safe Razorpay Invoicing</span></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright & SEO Schema notes */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
            <div>
              © {new Date().getFullYear()} TutorConnect India Directory. All rights reserved.
            </div>
            <div className="flex gap-4">
              <span>SEO Schema & Sitemaps Active</span>
              <span>•</span>
              <span>100% Peer-to-Peer</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Core Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <TutorConnectMain />
    </ToastProvider>
  );
}
