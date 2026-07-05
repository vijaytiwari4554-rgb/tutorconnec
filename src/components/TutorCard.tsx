import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, Star, MapPin, Award, BookOpen, Clock, 
  MessageCircle, Phone, Video, Calendar, ShieldCheck, X 
} from 'lucide-react';
import { TutorProfile, Booking } from '../types';
import { dbService } from '../lib/db';
import { useToast } from './Toast';

interface TutorCardProps {
  tutor: TutorProfile;
  onSaveToggle: (id: string) => void;
  isSaved: boolean;
  onBookingSuccess?: () => void;
}

// Generate next 5 days starting from Sunday, July 5, 2026
const baseDate = new Date(2026, 6, 5); // July 5, 2026
const bookingDays = Array.from({ length: 5 }, (_, i) => {
  const d = new Date(baseDate);
  d.setDate(baseDate.getDate() + i);
  return d;
});

const defaultSlots = [
  '09:00 AM - 09:30 AM',
  '11:00 AM - 11:30 AM',
  '02:00 PM - 02:30 PM',
  '04:30 PM - 05:00 PM',
  '06:00 PM - 06:30 PM',
];

export default function TutorCard({ tutor, onSaveToggle, isSaved, onBookingSuccess }: TutorCardProps) {
  const { toast } = useToast();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingType, setBookingType] = useState<'demo' | 'tuition'>('demo');
  const [showVideo, setShowVideo] = useState(false);

  // Custom mini-date selection state
  const [selectedDay, setSelectedDay] = useState<Date>(bookingDays[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>(defaultSlots[0]);

  // Form config
  const { register, handleSubmit, reset, setValue } = useForm();

  // Keep form dateTime value synced when using custom date & slot selectors
  useEffect(() => {
    if (isBookingOpen && bookingType === 'demo') {
      const dateStr = selectedDay.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
      setValue('dateTime', `${dateStr} @ ${selectedSlot}`);
    }
  }, [isBookingOpen, bookingType, selectedDay, selectedSlot, setValue]);

  const handleBookingSubmit = (data: any) => {
    const currentUser = dbService.getCurrentUser();
    if (!currentUser) {
      toast('Please login to schedule a session!', 'error');
      return;
    }

    try {
      dbService.createBooking({
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentEmail: currentUser.email,
        studentPhone: currentUser.phone,
        tutorId: tutor.userId,
        tutorName: tutor.name,
        type: bookingType,
        mode: data.mode as 'online' | 'home' | 'center',
        subject: data.subject || tutor.subjects[0],
        dateTime: data.dateTime,
        amount: bookingType === 'demo' ? 0 : Number(tutor.fees) * 2, // 2 hours deposit
        notes: data.notes
      });

      toast(`Successfully requested ${bookingType.toUpperCase()} session with ${tutor.name}! Check your dashboard.`, 'success');
      setIsBookingOpen(false);
      reset();
      if (onBookingSuccess) onBookingSuccess();
    } catch (e) {
      toast('Failed to create booking.', 'error');
    }
  };

  // WhatsApp click handler
  const handleWhatsAppClick = () => {
    const message = `Hello ${tutor.name}, I found your profile on TutorConnect India and want to book a demo session.`;
    const url = `https://wa.me/${tutor.whatsappNumber?.replace('+', '') || '919876543210'}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    toast('Redirecting to WhatsApp chat with tutor...', 'info');
  };

  // Call click handler
  const handleCallClick = () => {
    toast(`[VOICE CALL SIMULATION] Dialling ${tutor.name} at +91 98765 43210... Connections are encrypted & secure.`, 'success');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-md hover:border-indigo-200/50 transition-all flex flex-col justify-between gap-6 relative">
      
      {/* Featured ribbon banner */}
      {tutor.isFeatured && (
        <span className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-full font-extrabold text-[9px] uppercase tracking-wider shadow-sm flex items-center gap-1">
          <Star className="w-3 h-3 fill-white" />
          Featured Elite
        </span>
      )}

      <div>
        {/* Header Block */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 shrink-0 overflow-hidden border border-slate-100 relative">
            {tutor.demoVideoUrl && (
              <button 
                onClick={() => setShowVideo(true)}
                className="absolute inset-0 bg-slate-900/40 hover:bg-slate-900/60 transition-colors flex items-center justify-center z-10 cursor-pointer"
                title="Watch Demo Video"
              >
                <Video className="w-5 h-5 text-white" />
              </button>
            )}
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop" 
              alt={tutor.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop";
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-extrabold text-sm text-slate-900 truncate">{tutor.name}</h4>
              {tutor.documents?.verified !== false && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded-full text-[9px] border border-indigo-100 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{tutor.title}</p>
            <p className="text-[10px] text-slate-400 font-bold truncate mt-0.5 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              {tutor.qualification}
            </p>
          </div>

          {/* Save button */}
          <button
            onClick={() => {
              onSaveToggle(tutor.userId);
              toast(isSaved ? 'Tutor removed from saved list.' : 'Tutor added to saved list!', 'info');
            }}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-rose-500 transition-all cursor-pointer shrink-0"
          >
            <Star className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Credentials metrics block */}
        <div className="grid grid-cols-3 gap-2 py-3.5 my-3 bg-slate-50 rounded-2xl text-center">
          <div>
            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wide">Experience</span>
            <span className="text-xs font-bold text-slate-800 font-display">{tutor.experience}+ Years</span>
          </div>
          <div>
            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wide">Hourly Rate</span>
            <span className="text-xs font-black text-indigo-600 font-display">₹{tutor.fees}/hr</span>
          </div>
          <div>
            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wide">Average Rating</span>
            <span className="text-xs font-bold text-slate-800 font-display flex items-center justify-center gap-0.5">
              ★ {tutor.rating || 5.0}
            </span>
          </div>
        </div>

        {/* Biography snippet */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
          {tutor.about}
        </p>

        {/* Specialties Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tutor.subjects.map((s) => (
            <span key={s} className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold text-[9px] rounded-lg border border-indigo-100/50">
              {s}
            </span>
          ))}
          {tutor.classes.slice(0, 2).map((c) => (
            <span key={c} className="px-2.5 py-0.5 bg-slate-50 text-slate-700 font-extrabold text-[9px] rounded-lg border border-slate-200/50">
              {c}
            </span>
          ))}
          {tutor.boards.slice(0, 2).map((b) => (
            <span key={b} className="px-2.5 py-0.5 bg-slate-50 text-slate-700 font-extrabold text-[9px] rounded-lg border border-slate-200/50">
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Button controls */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setBookingType('demo');
              setIsBookingOpen(true);
            }}
            className="flex-1 py-2.5 px-4 border border-indigo-600 hover:bg-indigo-50 text-indigo-600 font-bold text-xs rounded-xl transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book Free Demo
          </button>
          <button
            onClick={() => {
              setBookingType('tuition');
              setIsBookingOpen(true);
            }}
            className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            Book Paid Class
          </button>
        </div>

        {/* Direct Connect icons row */}
        <div className="flex gap-2 pt-2 border-t border-slate-150">
          <button
            onClick={handleWhatsAppClick}
            className="flex-1 py-2 px-3 border border-slate-200 hover:bg-indigo-50 text-slate-700 font-semibold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-indigo-500" />
            WhatsApp Chat
          </button>
          <button
            onClick={handleCallClick}
            className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-indigo-500" />
            Call Instantly
          </button>
        </div>
      </div>

      {/* YouTube Demo embed modal overlay */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl w-full max-w-xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h5 className="font-bold text-xs text-white">Watch demo class preview with {tutor.name}</h5>
              <button onClick={() => setShowVideo(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={tutor.demoVideoUrl}
                title="Tutor class demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Overlay Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md relative border border-slate-100"
            >
              <button
                onClick={() => setIsBookingOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-4">
                <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Book Tuition Slot</span>
                <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">Schedule with {tutor.name}</h3>
                <p className="text-xs text-slate-500">
                  {bookingType === 'demo' ? 'Book a 30-minute free trial introductory demo.' : 'Book regular tuition classes. Minimum 2 hour deposit required.'}
                </p>
              </div>

              <form onSubmit={handleSubmit(handleBookingSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Select Subject</label>
                    <select
                      required
                      {...register('subject')}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-indigo-500"
                    >
                      {tutor.subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Session Mode</label>
                    <select
                      required
                      {...register('mode')}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="online">Online Mode</option>
                      <option value="home">Home Visit</option>
                      <option value="center">At Academy Center</option>
                    </select>
                  </div>
                </div>

                <div>
                  {bookingType === 'demo' ? (
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-600 mb-1">Select Demo Date</label>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {bookingDays.map((day, idx) => {
                          const isSelected = selectedDay.getDate() === day.getDate();
                          const dayLabel = idx === 0 ? 'Today' : day.toLocaleDateString('en-US', { weekday: 'short' });
                          return (
                            <button
                              key={day.toISOString()}
                              type="button"
                              onClick={() => {
                                setSelectedDay(day);
                                const dateStr = day.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
                                setValue('dateTime', `${dateStr} @ ${selectedSlot}`);
                              }}
                              className={`flex-shrink-0 flex flex-col items-center justify-center w-16 py-2 rounded-2xl border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-300'
                              }`}
                            >
                              <span className="text-[9px] font-bold uppercase tracking-wider opacity-90">{dayLabel}</span>
                              <span className="text-sm font-black mt-0.5">{day.getDate()}</span>
                              <span className="text-[8px] font-extrabold opacity-75 mt-0.5 uppercase">
                                {day.toLocaleDateString('en-US', { month: 'short' })}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <label className="block text-xs font-bold text-slate-600 mb-1">Select 30-Min Slot</label>
                      <div className="grid grid-cols-2 gap-2">
                        {defaultSlots.map((slot) => {
                          const isSelected = selectedSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => {
                                setSelectedSlot(slot);
                                const dateStr = selectedDay.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
                                setValue('dateTime', `${dateStr} @ ${slot}`);
                              }}
                              className={`py-2 px-3 rounded-xl border text-[10px] font-bold text-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-300'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                      <input type="hidden" {...register('dateTime', { required: true })} />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Date and Preferred Time Slot</label>
                      <input
                        type="datetime-local"
                        required
                        {...register('dateTime')}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Add Note / Learning Goals</label>
                  <textarea
                    rows={2}
                    {...register('notes')}
                    placeholder="Describe specific class boards, syllabus, or goals..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800"
                  />
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between font-bold text-xs text-slate-700">
                  <span>Due Payable Amount:</span>
                  <span className="text-sm text-indigo-600">
                    {bookingType === 'demo' ? '₹0 (FREE Trial)' : `₹${tutor.fees * 2} (Deposit)`}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Request Booking Reservation
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
