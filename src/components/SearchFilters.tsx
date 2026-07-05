import React from 'react';
import { Search, MapPin, Filter, BookOpen, GraduationCap, Award, Laptop, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { CITIES, CLASSES_BOARDS, SUBJECTS, COMPETITIVE_EXAMS, SKILL_COURSES, LANGUAGES } from '../data/sampleData';

interface SearchFiltersProps {
  filters: {
    city: string;
    area: string;
    pincode: string;
    classLevel: string;
    board: string;
    subject: string;
    exam: string;
    skill: string;
    language: string;
    mode: string;
    minExperience: number;
    verifiedOnly: boolean;
    searchQuery: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  onReset: () => void;
}

export default function SearchFilters({ filters, setFilters, onReset }: SearchFiltersProps) {
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
          <h3 className="font-extrabold font-display text-sm text-slate-900">Fine-Tune Search Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5 font-bold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* 1. KEYWORD SMART SEARCH */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Smart Text Search</label>
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Type physics, calculus, python coding..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-800 font-medium"
          />
        </div>
      </div>

      {/* 2. GEOLOCATION FILTER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Select City</label>
          <select
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="w-full px-3.5 py-3 border border-slate-200 rounded-2xl text-xs bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
          >
            <option value="">All Indian Cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Area Neighborhood</label>
          <input
            type="text"
            placeholder="e.g. Andheri, Kothrud"
            value={filters.area}
            onChange={(e) => handleFilterChange('area', e.target.value)}
            className="w-full px-3.5 py-3 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Pincode</label>
          <input
            type="text"
            placeholder="e.g. 400053"
            value={filters.pincode}
            onChange={(e) => handleFilterChange('pincode', e.target.value)}
            className="w-full px-3.5 py-3 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* 3. ACADEMICS BRACKET */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Class Level</label>
          <select
            value={filters.classLevel}
            onChange={(e) => handleFilterChange('classLevel', e.target.value)}
            className="w-full px-3.5 py-3 border border-slate-200 rounded-2xl text-xs bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
          >
            <option value="">All Classes</option>
            {CLASSES_BOARDS.classes.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Education Board</label>
          <select
            value={filters.board}
            onChange={(e) => handleFilterChange('board', e.target.value)}
            className="w-full px-3.5 py-3 border border-slate-200 rounded-2xl text-xs bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
          >
            <option value="">All Boards</option>
            {CLASSES_BOARDS.boards.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Core Subjects</label>
          <select
            value={filters.subject}
            onChange={(e) => handleFilterChange('subject', e.target.value)}
            className="w-full px-3.5 py-3 border border-slate-200 rounded-2xl text-xs bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
          >
            <option value="">All Subjects</option>
            {SUBJECTS.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. EXAMS & SKILLS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Competitive Exams</label>
          <select
            value={filters.exam}
            onChange={(e) => handleFilterChange('exam', e.target.value)}
            className="w-full px-3.5 py-3 border border-slate-200 rounded-2xl text-xs bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
          >
            <option value="">None Selected</option>
            {COMPETITIVE_EXAMS.map((ex) => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Skill / Hobby Courses</label>
          <select
            value={filters.skill}
            onChange={(e) => handleFilterChange('skill', e.target.value)}
            className="w-full px-3.5 py-3 border border-slate-200 rounded-2xl text-xs bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
          >
            <option value="">None Selected</option>
            {SKILL_COURSES.map((sk) => (
              <option key={sk} value={sk}>{sk}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Language Medium</label>
          <select
            value={filters.language}
            onChange={(e) => handleFilterChange('language', e.target.value)}
            className="w-full px-3.5 py-3 border border-slate-200 rounded-2xl text-xs bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
          >
            <option value="">All Languages</option>
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 5. MODES, RATINGS & AUDITS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-100 pt-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Teaching Mode:</span>
            <div className="inline-flex rounded-xl bg-slate-100 p-0.5">
              {[
                { val: '', label: 'All' },
                { val: 'online', label: 'Online' },
                { val: 'home', label: 'Home Tuition' },
                { val: 'center', label: 'Institute' }
              ].map((m) => (
                <button
                  key={m.val}
                  type="button"
                  onClick={() => handleFilterChange('mode', m.val)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    filters.mode === m.val
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Experience:</span>
            <select
              value={filters.minExperience}
              onChange={(e) => handleFilterChange('minExperience', Number(e.target.value))}
              className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-700 focus:outline-none"
            >
              <option value={0}>Any Experience</option>
              <option value={3}>3+ Years</option>
              <option value={5}>5+ Years</option>
              <option value={10}>10+ Years</option>
            </select>
          </div>
        </div>

        {/* VERIFIED ONLY TOGGLE */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="verifiedOnly"
            checked={filters.verifiedOnly}
            onChange={(e) => handleFilterChange('verifiedOnly', e.target.checked)}
            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
          />
          <label htmlFor="verifiedOnly" className="text-xs font-bold text-slate-700 cursor-pointer select-none flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Verified Tutors Only
          </label>
        </div>
      </div>
    </div>
  );
}
