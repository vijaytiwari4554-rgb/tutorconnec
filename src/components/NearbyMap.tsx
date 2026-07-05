import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Compass, Search, GraduationCap, Building2, School } from 'lucide-react';
import { TutorProfile, CoachingProfile, CollegeProfile } from '../types';

interface NearbyMapProps {
  tutors: TutorProfile[];
  coaching: CoachingProfile[];
  colleges: CollegeProfile[];
  selectedCity: string;
  onSelectTutor: (tutor: TutorProfile) => void;
}

interface MapMarker {
  id: string;
  name: string;
  type: 'tutor' | 'coaching' | 'college';
  lat: number; // 0-100% relative X
  lng: number; // 0-100% relative Y
  rating: number;
  subjectOrCourse: string;
  fees: string;
  rawObj: any;
}

export default function NearbyMap({ tutors, coaching, colleges, selectedCity, onSelectTutor }: NearbyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  const [activeMarker, setActiveMarker] = useState<MapMarker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Observe container size dynamically as requested
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({ width: width || 600, height: height || 400 });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 2. Generate deterministic coordinates based on name string so pins persist
  const getCoordinates = (name: string, index: number) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const x = 15 + Math.abs((hash * (index + 1)) % 70); // Keep between 15% and 85%
    const y = 20 + Math.abs((hash / (index + 2)) % 60); // Keep between 20% and 80%
    return { x, y };
  };

  // 3. Compile markers based on filters
  const markers: MapMarker[] = [];

  tutors.forEach((t, i) => {
    const coords = getCoordinates(t.name, i);
    markers.push({
      id: t.userId,
      name: t.name,
      type: 'tutor',
      lat: coords.x,
      lng: coords.y,
      rating: t.rating || 5.0,
      subjectOrCourse: t.subjects[0] || 'General',
      fees: `₹${t.fees}/hr`,
      rawObj: t
    });
  });

  coaching.forEach((c, i) => {
    const coords = getCoordinates(c.instituteName, i + 10);
    markers.push({
      id: c.userId,
      name: c.instituteName,
      type: 'coaching',
      lat: coords.x,
      lng: coords.y,
      rating: c.rating || 5.0,
      subjectOrCourse: c.courses[0]?.name || 'Coaching',
      fees: c.courses[0] ? `₹${Math.round(c.courses[0].fees / 1000)}k` : 'Varies',
      rawObj: c
    });
  });

  colleges.forEach((col, i) => {
    const coords = getCoordinates(col.collegeName, i + 20);
    markers.push({
      id: col.userId,
      name: col.collegeName,
      type: 'college',
      lat: coords.x,
      lng: coords.y,
      rating: col.rating || 5.0,
      subjectOrCourse: col.courses[0]?.name || 'Degree',
      fees: col.courses[0] ? `₹${Math.round(col.courses[0].feePerYear / 1000)}k/yr` : 'Varies',
      rawObj: col
    });
  });

  // Filter markers by query search
  const filteredMarkers = markers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.subjectOrCourse.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-white text-slate-900 rounded-3xl p-6 border border-slate-200 shadow-sm overflow-hidden">
      {/* Search & Sidebar */}
      <div className="lg:w-80 flex flex-col gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-bold tracking-wider uppercase mb-1">
            <Compass className="w-3.5 h-3.5 animate-spin-slow text-indigo-500" />
            Live GPS Map Radar
          </span>
          <h3 className="text-xl font-extrabold font-display tracking-tight text-slate-900">
            Nearby Tutors in <span className="text-indigo-600">{selectedCity}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Showing verified educators, institutes & college campuses situated around your neighborhood area.
          </p>
        </div>

        {/* Local Area Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search local areas/subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Sidebar Markers list */}
        <div className="flex-1 max-h-[250px] lg:max-h-[350px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {filteredMarkers.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setActiveMarker(m);
                if (m.type === 'tutor') onSelectTutor(m.rawObj);
              }}
              className={`w-full text-left p-3 rounded-2xl transition-all border flex items-center gap-3 cursor-pointer ${
                activeMarker?.id === m.id
                  ? 'bg-indigo-50/50 border-indigo-200'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200/50'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${
                m.type === 'tutor' ? 'bg-amber-500/10 text-amber-600' :
                m.type === 'coaching' ? 'bg-indigo-500/10 text-indigo-600' :
                'bg-emerald-500/10 text-emerald-600'
              }`}>
                {m.type === 'tutor' && <GraduationCap className="w-4 h-4" />}
                {m.type === 'coaching' && <Building2 className="w-4 h-4" />}
                {m.type === 'college' && <School className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs truncate text-slate-800">{m.name}</div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">{m.subjectOrCourse} • {m.fees}</div>
              </div>
              <div className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded-lg font-mono text-indigo-600 font-bold">
                ★ {m.rating}
              </div>
            </button>
          ))}
          {filteredMarkers.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-500 font-medium">
              No matching local educational hubs found in {selectedCity}.
            </div>
          )}
        </div>
      </div>

      {/* Interactive Map Visualizer */}
      <div 
        ref={containerRef}
        className="flex-1 min-h-[350px] lg:min-h-[450px] bg-slate-50 rounded-2xl relative border border-slate-200 overflow-hidden"
        style={{ backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}
      >
        {/* Radar grids overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5">
          <div className="w-[300px] h-[300px] border border-slate-900 rounded-full animate-pulse" />
          <div className="w-[200px] h-[200px] border border-slate-900 rounded-full absolute" />
          <div className="w-[100px] h-[100px] border border-slate-900 rounded-full absolute" />
        </div>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white/95 border border-slate-200 shadow-sm backdrop-blur-md px-3.5 py-2 rounded-xl text-[10px] flex gap-3 z-10 font-bold text-slate-600">
          <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-amber-500" /> Tutors</span>
          <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-indigo-500" /> Coaching</span>
          <span className="flex items-center gap-1"><School className="w-3.5 h-3.5 text-emerald-500" /> Colleges</span>
        </div>

        {/* Active Pins */}
        {filteredMarkers.map((m) => {
          const isActive = activeMarker?.id === m.id;
          return (
            <div
              key={m.id}
              className="absolute transition-transform duration-300 hover:scale-110"
              style={{
                left: `${m.lat}%`,
                top: `${m.lng}%`,
                transform: 'translate(-50%, -100%)'
              }}
            >
              <button
                onClick={() => {
                  setActiveMarker(m);
                  if (m.type === 'tutor') onSelectTutor(m.rawObj);
                }}
                className={`relative flex items-center justify-center cursor-pointer transition-all p-1 rounded-full ${
                  isActive 
                    ? 'scale-125 z-30' 
                    : 'z-10'
                }`}
              >
                {/* Glowing ring */}
                {isActive && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-500/30 animate-ping" />
                )}

                <div className={`p-1.5 rounded-full border shadow-md ${
                  m.type === 'tutor' ? 'bg-amber-500 border-amber-300 text-white' :
                  m.type === 'coaching' ? 'bg-indigo-600 border-indigo-400 text-white' :
                  'bg-emerald-600 border-emerald-400 text-white'
                }`}>
                  <MapPin className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          );
        })}

        {/* Floating Pin Card Details popup */}
        <AnimatePresence>
          {activeMarker && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-xs bg-white border border-slate-200 p-4 rounded-2xl shadow-xl z-20 flex gap-3"
            >
              <div className={`p-3 rounded-xl self-start ${
                activeMarker.type === 'tutor' ? 'bg-amber-500/10 text-amber-500' :
                activeMarker.type === 'coaching' ? 'bg-indigo-500/10 text-indigo-500' :
                'bg-emerald-500/10 text-emerald-500'
              }`}>
                {activeMarker.type === 'tutor' && <GraduationCap className="w-5 h-5" />}
                {activeMarker.type === 'coaching' && <Building2 className="w-5 h-5" />}
                {activeMarker.type === 'college' && <School className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-slate-400 text-[9px] uppercase tracking-wider font-extrabold">{activeMarker.type} • {selectedCity}</div>
                <div className="font-extrabold text-xs text-slate-900 truncate mt-0.5">{activeMarker.name}</div>
                <div className="text-[10px] text-slate-500 font-semibold truncate mt-1">Specializes: {activeMarker.subjectOrCourse}</div>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-xs font-mono text-indigo-600 font-bold">{activeMarker.fees}</span>
                  <button
                    onClick={() => {
                      if (activeMarker.type === 'tutor') {
                        onSelectTutor(activeMarker.rawObj);
                      }
                    }}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 font-bold text-[9px] rounded-lg text-white hover:text-indigo-700 transition-colors cursor-pointer"
                  >
                    View & Book
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
