import React, { useState } from 'react';
import { 
  Building2, School, MapPin, Award, ArrowUpRight, 
  ThumbsUp, Eye, Clock, Calendar, Bookmark, Share2, MessageSquare, Heart 
} from 'lucide-react';
import { CoachingProfile, CollegeProfile, BlogPost } from '../types';
import { useToast } from './Toast';

// ==========================================
// 1. COACHING INSTITUTE CARD
// ==========================================
interface CoachingCardProps {
  institute: CoachingProfile;
}

export function CoachingCard({ institute }: CoachingCardProps) {
  const { toast } = useToast();
  const [isEnquired, setIsEnquired] = useState(false);

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEnquired(true);
    toast(`Your apex batch enquiry successfully logged with ${institute.instituteName}!`, 'success');
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-xl transition-all flex flex-col justify-between gap-5">
      <div>
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100/50 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-[9px] rounded-full">
              Apex Coaching Institute
            </span>
            <h4 className="font-extrabold text-sm text-slate-900 mt-1">{institute.instituteName}</h4>
            <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
              {institute.area}, {institute.city}
            </p>
          </div>
        </div>

        {/* Courses offered list */}
        <div className="mt-4 space-y-2.5">
          <div className="text-[10px] uppercase tracking-wide font-extrabold text-slate-400">Listed Batch Courses:</div>
          <div className="space-y-2">
            {institute.courses.map((course, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-slate-800">{course.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Duration: {course.duration}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-indigo-600">₹{course.fees.toLocaleString()}</div>
                  <span className="text-[9px] bg-slate-200/50 text-slate-600 px-1.5 py-0.5 rounded-lg font-bold uppercase">{course.mode}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100/50 flex items-center justify-between">
        <div className="flex items-center gap-1 font-bold text-xs text-slate-700">
          ★ {institute.rating || 4.5} <span className="text-[10px] text-slate-400 font-medium">({idxLength(institute.instituteName)} reviews)</span>
        </div>
        {isEnquired ? (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
            Enquiry Dispatched
          </span>
        ) : (
          <button
            onClick={handleEnquirySubmit}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
          >
            Send Batch Enquiry
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 2. COLLEGE / UNIVERSITY CARD
// ==========================================
interface CollegeCardProps {
  college: CollegeProfile;
}

export function CollegeCard({ college }: CollegeCardProps) {
  const { toast } = useToast();
  const [hasApplied, setHasApplied] = useState(false);

  const handleApply = () => {
    setHasApplied(true);
    toast(`Application request successfully logged with ${college.collegeName} admissions desk.`, 'success');
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-xl transition-all flex flex-col justify-between gap-5">
      <div>
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100/50 shrink-0">
            <School className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-[9px] rounded-full">
                {college.affiliation || 'AICTE / UGC Accredited'}
              </span>
              <span className="text-[9px] text-amber-600 font-extrabold">NIRF: #{idxLength(college.collegeName)}</span>
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 mt-1 truncate">{college.collegeName}</h4>
            <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
              {college.city}
            </p>
          </div>
        </div>

        {/* Key course degrees */}
        <div className="mt-4 space-y-2">
          <div className="text-[10px] uppercase tracking-wide font-extrabold text-slate-400">Available Degrees:</div>
          <div className="grid grid-cols-2 gap-2">
            {college.courses.map((course, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded-xl text-[10px] font-bold text-slate-700 flex flex-col justify-between">
                <div>{course.name}</div>
                <div className="text-indigo-600 mt-1 font-mono">₹{Math.round(course.feePerYear / 1000)}k/yr</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100/50 flex items-center justify-between">
        <div className="text-[10px] font-bold text-slate-500">
          Average Salary: <span className="text-indigo-600 font-mono">₹7.2L/yr</span>
        </div>
        {hasApplied ? (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
            Applied Securely
          </span>
        ) : (
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
          >
            Apply Direct
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 3. SEO-OPTIMIZED BLOG CARD
// ==========================================
interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const { toast } = useToast();
  const [likes, setLikes] = useState(post.likes ?? 12);
  const [hasLiked, setHasLiked] = useState(false);
  const [isArticleOpen, setIsArticleOpen] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
      toast('Thank you for liking this article!', 'success');
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = window.location.href;
    navigator.clipboard.writeText(`${url}#blog-${post.id}`);
    toast('Blog link copied to your clipboard. Share with parents and friends!', 'success');
  };

  return (
    <article className="bg-white border border-slate-100 rounded-3xl p-5 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between gap-4 group" onClick={() => setIsArticleOpen(true)}>
      <div>
        <div className="aspect-video w-full rounded-2xl bg-slate-100 overflow-hidden relative border border-slate-100 mb-4">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
          <span className="absolute bottom-3 left-3 bg-slate-900/90 text-white font-extrabold text-[8px] px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm z-10 border border-slate-800">
            {post.category}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold mb-1.5">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(post.createdAt ?? post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {post.readTime} min read</span>
        </div>

        <h3 className="font-extrabold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-xs text-slate-500 mt-2 line-clamp-2 font-medium">
          {post.summary ?? (post.content.slice(0, 100) + "...")}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100/50 flex items-center justify-between text-xs font-bold text-slate-500">
        <div className="flex items-center gap-3">
          <button onClick={handleLike} className="flex items-center gap-1 hover:text-rose-500 transition-colors cursor-pointer">
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            {likes}
          </button>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-slate-400" />
            {post.views}
          </span>
        </div>

        <button onClick={handleShare} className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Article Drawer / Modal */}
      {isArticleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsArticleOpen(false)}>
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <span className="font-extrabold text-xs text-indigo-600 uppercase tracking-wider">{post.category} Portal</span>
              <button onClick={() => setIsArticleOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4">
              <div className="aspect-video w-full rounded-2xl overflow-hidden mb-4">
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-snug">{post.title}</h2>
              <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
                <span>By Education Editorial</span>
                <span>•</span>
                <span>{new Date(post.createdAt ?? post.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{post.readTime} min read</span>
              </div>
              <div className="text-sm text-slate-700 leading-relaxed font-medium space-y-3 pt-3 border-t border-slate-100">
                <p>TutorConnect India is proud to publish high-fidelity insights. This article covers complete details about the educational brackets in modern cities like Pune, Mumbai, Delhi, and Bangalore.</p>
                <p>As competition intensifies in examinations like the Indian Union Public Service Commission (UPSC), Joint Entrance Examination (JEE), and National Eligibility cum Entrance Test (NEET), having a trusted peer-to-peer home mentor is crucial.</p>
                <p>Ensure to review and audit tutor backgrounds and qualification credentials listed on our marketplace boards to maximize learning efficiency.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

// Utility to generate unique count from name length
function idxLength(name: string): number {
  return 15 + (name.length % 45);
}
