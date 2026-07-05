import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, GraduationCap, Calendar, MessageSquare, CreditCard, 
  Settings, CheckCircle2, ShieldAlert, Award, AlertCircle, Plus, 
  Trash2, TrendingUp, Users, DollarSign, BookOpen, MapPin, Sparkles, Send, Bell
} from 'lucide-react';
import { dbService, subscribeToDB } from '../lib/db';
import { UserProfile, TutorProfile, Booking, Message, Review, BlogPost, SubscriptionPlan } from '../types';
import { SUBSCRIPTION_PLANS } from '../data/sampleData';
import { useToast } from './Toast';

export default function Dashboards() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(dbService.getCurrentUser());
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const unsubscribe = subscribeToDB(() => {
      setCurrentUser(dbService.getCurrentUser());
    });
    return unsubscribe;
  }, []);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto my-12 text-center p-8 bg-slate-50 border border-slate-100 rounded-3xl">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold font-display text-slate-800">No Active Session Found</h3>
        <p className="text-sm text-slate-500 mt-2">
          Please click on the <strong>Login / Register</strong> button in the navigation bar to sign in.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-4 md:p-8">
      {/* Role specific routing */}
      {currentUser.role === 'student' && <StudentDashboard user={currentUser} activeTab={activeTab} setActiveTab={setActiveTab} />}
      {currentUser.role === 'parent' && <StudentDashboard user={currentUser} activeTab={activeTab} setActiveTab={setActiveTab} isParent={true} />}
      {currentUser.role === 'tutor' && <TutorDashboard user={currentUser} activeTab={activeTab} setActiveTab={setActiveTab} />}
      {currentUser.role === 'coaching' && <CoachingDashboard user={currentUser} activeTab={activeTab} setActiveTab={setActiveTab} />}
      {currentUser.role === 'college' && <CollegeDashboard user={currentUser} activeTab={activeTab} setActiveTab={setActiveTab} />}
      {currentUser.role === 'admin' && <AdminDashboard user={currentUser} activeTab={activeTab} setActiveTab={setActiveTab} />}
    </div>
  );
}

// ==========================================
// 1. STUDENT & PARENT WORKSPACE
// ==========================================
function StudentDashboard({ user, activeTab, setActiveTab, isParent = false }: { user: UserProfile, activeTab: string, setActiveTab: (t: string) => void, isParent?: boolean }) {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [savedTutorIds, setSavedTutorIds] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatReceiver, setChatReceiver] = useState<string | null>(null);
  const [chatText, setChatText] = useState('');
  
  const { register: regProfile, handleSubmit: handleProfileSubmit } = useForm({
    defaultValues: { name: user.name, phone: user.phone || '', city: user.city || '', area: user.area || '', pincode: user.pincode || '' }
  });

  useEffect(() => {
    const syncData = () => {
      setBookings(dbService.getBookings().filter(b => b.studentId === user.id));
      setSavedTutorIds(dbService.getSavedTutors());
      setMessages(dbService.getMessages());
    };
    syncData();
    return subscribeToDB(syncData);
  }, [user.id]);

  const onUpdateProfile = (data: any) => {
    dbService.updateProfile(data);
    toast('Profile details updated successfully!', 'success');
  };

  const savedTutors = dbService.getTutors().filter(t => savedTutorIds.includes(t.userId));

  const handlePayInvoice = (bookingId: string) => {
    // simulated Razorpay
    dbService.updateBookingStatus(bookingId, 'confirmed', 'paid');
    toast('Razorpay Payment Successful! Booking status changed to Confirmed.', 'success');
  };

  // Chat filter
  const activeChatMessages = messages.filter(m => 
    (m.senderId === user.id && m.receiverId === chatReceiver) ||
    (m.senderId === chatReceiver && m.receiverId === user.id)
  ).sort((a,b) => a.timestamp - b.timestamp);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() || !chatReceiver) return;
    dbService.sendMessage(chatReceiver, chatText);
    setChatText('');
    toast('Message sent to tutor!', 'success');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar navigation */}
      <div className="lg:col-span-1 flex flex-col gap-2">
        <div className="p-4 bg-white border border-slate-100 rounded-2xl mb-2 text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-extrabold text-2xl mx-auto mb-2 border border-indigo-100">
            {user.name[0]}
          </div>
          <div className="font-extrabold text-sm text-slate-900 truncate">{user.name}</div>
          <div className="text-xs text-slate-500 mt-0.5 capitalize">{isParent ? 'Parent Account' : 'Student Account'}</div>
        </div>

        {[
          { id: 'overview', label: 'My Bookings', icon: Calendar },
          { id: 'saved', label: 'Saved Tutors', icon: GraduationCap },
          { id: 'chat', label: 'Message Center', icon: MessageSquare },
          { id: 'payments', label: 'Invoices & Payments', icon: CreditCard },
          { id: 'profile', label: 'Edit Profile', icon: Settings }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
              activeTab === t.id 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Workspace content */}
      <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-6 min-h-[400px]">
        {activeTab === 'overview' && (
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900 mb-4">My Booked Tuitions & Demos</h3>
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      b.type === 'demo' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    }`}>
                      {b.type} Session
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 mt-1">{b.subject} Tuition</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Tutor: <span className="font-semibold text-slate-700">{b.tutorName}</span></p>
                    <p className="text-xs text-slate-500">Scheduled: <span className="font-semibold text-slate-700">{b.dateTime.replace('T', ' ')}</span> • Mode: <span className="capitalize">{b.mode}</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      b.status === 'confirmed' ? 'bg-indigo-100 text-indigo-800' : b.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {b.status.toUpperCase()}
                    </span>
                    {b.paymentStatus === 'pending' && b.amount > 0 && (
                      <button
                        onClick={() => handlePayInvoice(b.id)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Pay ₹{b.amount}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <div className="text-center py-12 text-xs text-slate-400 font-medium">No bookings requested yet.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900 mb-4">Saved Verified Tutors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedTutors.map((t) => (
                <div key={t.userId} className="p-4 border border-slate-100 rounded-2xl flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0 flex items-center justify-center font-bold text-slate-700">
                    {t.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{t.name}</h4>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{t.title}</p>
                    <p className="text-[10px] text-slate-500 font-semibold">{t.subjects.join(', ')}</p>
                    <button
                      onClick={() => {
                        dbService.toggleSaveTutor(t.userId);
                        toast('Tutor removed from saved list.', 'info');
                      }}
                      className="mt-2 text-[10px] text-red-600 hover:underline font-bold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {savedTutors.length === 0 && (
                <div className="col-span-2 text-center py-12 text-xs text-slate-400 font-medium">Your saved tutors list is empty.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px]">
            {/* Conversations list */}
            <div className="md:col-span-1 border-r border-slate-100 pr-4 space-y-2 overflow-y-auto">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">My Tutor Chats</h4>
              {dbService.getTutors().map((t) => (
                <button
                  key={t.userId}
                  onClick={() => setChatReceiver(t.userId)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all truncate flex items-center gap-2 cursor-pointer ${
                    chatReceiver === t.userId ? 'bg-indigo-50 text-indigo-800' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-[10px] shrink-0">
                    {t.name[0]}
                  </div>
                  {t.name}
                </button>
              ))}
            </div>

            {/* Message Pane */}
            <div className="md:col-span-2 flex flex-col h-full justify-between">
              {chatReceiver ? (
                <>
                  <div className="flex-1 overflow-y-auto space-y-3 p-2 border border-slate-50 rounded-xl mb-3">
                    {activeChatMessages.map((m) => {
                      const isMe = m.senderId === user.id;
                      return (
                        <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-3 rounded-2xl max-w-xs text-xs font-medium ${
                            isMe ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {m.content}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <form onSubmit={handleSendChat} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={chatText}
                      onChange={(e) => setChatText(e.target.value)}
                      className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800"
                    />
                    <button type="submit" className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <MessageSquare className="w-8 h-8 opacity-40 mb-2" />
                  <p className="text-xs font-medium">Select a tutor conversation to start chatting.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900 mb-4">Invoices & Premium Bills</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500">
                    <th className="py-2.5 font-bold">Invoice ID</th>
                    <th className="py-2.5 font-bold">Tuition Subject</th>
                    <th className="py-2.5 font-bold">Amount</th>
                    <th className="py-2.5 font-bold">Status</th>
                    <th className="py-2.5 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td className="py-3 font-mono">{b.id.toUpperCase()}</td>
                      <td className="py-3">{b.subject} Tuition</td>
                      <td className="py-3">₹{b.amount}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b.paymentStatus === 'paid' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {b.paymentStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3">{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <div className="text-center py-12 text-xs text-slate-400 font-medium">No transactions recorded.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900 mb-4">My Account Settings</h3>
            <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4 max-w-md">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    {...regProfile('name')}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Mobile Contact</label>
                  <input
                    type="tel"
                    {...regProfile('phone')}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">City</label>
                  <input
                    type="text"
                    {...regProfile('city')}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Area Sector</label>
                  <input
                    type="text"
                    {...regProfile('area')}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Pincode</label>
                  <input
                    type="text"
                    {...regProfile('pincode')}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 2. TUTOR WORKSPACE
// ==========================================
function TutorDashboard({ user, activeTab, setActiveTab }: { user: UserProfile, activeTab: string, setActiveTab: (t: string) => void }) {
  const { toast } = useToast();
  const [myProfile, setMyProfile] = useState<TutorProfile | null>(null);
  const [requests, setRequests] = useState<Booking[]>([]);
  const [activePlan, setActivePlan] = useState<string | null>(null);

  const { register: regTutor, handleSubmit: handleTutorSubmit, reset } = useForm();

  useEffect(() => {
    const sync = () => {
      const all = dbService.getTutors();
      const prof = all.find(t => t.userId === user.id) || null;
      setMyProfile(prof);
      setRequests(dbService.getBookings().filter(b => b.tutorId === user.id));
      setActivePlan(dbService.getSubscription(user.id));
    };
    sync();
    return subscribeToDB(sync);
  }, [user.id]);

  // Load defaults
  useEffect(() => {
    if (myProfile) {
      reset({
        title: myProfile.title,
        qualification: myProfile.qualification,
        experience: myProfile.experience,
        fees: myProfile.fees,
        about: myProfile.about,
        whatsappNumber: myProfile.whatsappNumber,
        demoVideoUrl: myProfile.demoVideoUrl
      });
    }
  }, [myProfile, reset]);

  const onSaveProfile = (data: any) => {
    dbService.updateTutorProfile({
      ...data,
      subjects: myProfile?.subjects || ['Mathematics'],
      classes: myProfile?.classes || ['Class 10'],
      boards: myProfile?.boards || ['CBSE']
    });
    toast('Tutor catalog profile updated successfully!', 'success');
  };

  const handleBookingStatus = (bookingId: string, status: Booking['status']) => {
    dbService.updateBookingStatus(bookingId, status);
    toast(`Booking successfully ${status}!`, 'success');
  };

  const handleBuyPlan = (planId: string) => {
    dbService.purchaseSubscription(planId);
    toast('Premium subscription activated on your profile!', 'success');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar navigation */}
      <div className="lg:col-span-1 flex flex-col gap-2">
        <div className="p-4 bg-white border border-slate-100 rounded-2xl mb-2 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-extrabold text-2xl mx-auto mb-2 border border-amber-100">
            {user.name[0]}
          </div>
          <div className="font-extrabold text-sm text-slate-900 truncate flex items-center justify-center gap-1">
            {user.name}
            {user.isVerified && <CheckCircle2 className="w-4 h-4 text-indigo-600 inline shrink-0" />}
          </div>
          <div className="text-[10px] uppercase font-extrabold text-slate-400 mt-1">Verified Instructor</div>
          
          {activePlan && (
            <div className="mt-2.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 rounded-full font-extrabold text-[9px] uppercase tracking-wide">
              ★ Active Premium
            </div>
          )}
        </div>

        {[
          { id: 'overview', label: 'Student Requests', icon: Calendar },
          { id: 'profile', label: 'Tutor Settings', icon: GraduationCap },
          { id: 'subscription', label: 'Premium Upgrade', icon: Award }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
              activeTab === t.id 
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/10' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Panel Content */}
      <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-6 min-h-[400px]">
        {activeTab === 'overview' && (
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900 mb-4">Incoming Student Proposals & Bookings</h3>
            <div className="space-y-4">
              {requests.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg font-bold uppercase">{r.type}</span>
                    <h4 className="font-extrabold text-sm text-slate-900 mt-1">{r.subject} - {r.studentName}</h4>
                    <p className="text-xs text-slate-500">Contact: {r.studentEmail} {r.studentPhone && `• ${r.studentPhone}`}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Scheduled Slot: <span className="font-semibold text-slate-700">{r.dateTime.replace('T', ' ')}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleBookingStatus(r.id, 'cancelled')}
                          className="px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleBookingStatus(r.id, 'confirmed')}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                        >
                          Accept
                        </button>
                      </>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold capitalize ${
                        r.status === 'confirmed' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {r.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {requests.length === 0 && (
                <div className="text-center py-12 text-xs text-slate-400 font-medium">No student requests found yet.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900 mb-1">Tutor Professional Credentials</h3>
            <p className="text-xs text-slate-400 mb-4">Set your hourly rates and qualifications displayed to searching parents.</p>
            
            <form onSubmit={handleTutorSubmit(onSaveProfile)} className="space-y-4 max-w-xl">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Headline Title</label>
                  <input
                    type="text"
                    required
                    {...regTutor('title')}
                    placeholder="e.g. Senior IIT JEE Chemistry Prep Guide"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    {...regTutor('whatsappNumber')}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Highest Qualification</label>
                  <input
                    type="text"
                    required
                    {...regTutor('qualification')}
                    placeholder="Ph.D Chemistry, IIT Delhi"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    required
                    {...regTutor('experience')}
                    placeholder="8"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Hourly Fee (INR)</label>
                  <input
                    type="number"
                    required
                    {...regTutor('fees')}
                    placeholder="800"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Embed Demo Video URL (optional)</label>
                <input
                  type="text"
                  {...regTutor('demoVideoUrl')}
                  placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">About Biography Description</label>
                <textarea
                  rows={4}
                  required
                  {...regTutor('about')}
                  placeholder="Share details on how you teach and prepare children..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Save Profile
              </button>
            </form>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900 mb-1">Upgrade To Premium Membership</h3>
            <p className="text-xs text-slate-400 mb-6">Gain direct leads matching system recommendations and top search prioritizations.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SUBSCRIPTION_PLANS.filter(p => p.role === 'tutor').map((p) => {
                const isActive = activePlan === p.id;
                return (
                  <div key={p.id} className="p-6 border border-slate-150 rounded-3xl flex flex-col justify-between hover:shadow-lg transition-all relative">
                    {isActive && (
                      <span className="absolute -top-3 right-4 px-2.5 py-1 bg-amber-500 text-slate-900 font-extrabold rounded-full text-[8px] uppercase tracking-wider">
                        Active Plan
                      </span>
                    )}
                    <div>
                      <h4 className="font-extrabold text-slate-900 font-display text-lg">{p.name}</h4>
                      <div className="mt-2 font-mono text-2xl font-black text-slate-900">₹{p.price}<span className="text-xs text-slate-400">/{p.billing}</span></div>
                      <ul className="mt-4 space-y-2 text-xs text-slate-600 font-medium">
                        {p.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => handleBuyPlan(p.id)}
                      disabled={isActive}
                      className={`w-full mt-6 py-2.5 font-bold text-xs rounded-xl transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-slate-100 text-slate-400 border border-slate-200' 
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                      }`}
                    >
                      {isActive ? 'Current Subscription' : `Activate for ₹${p.price}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 3. COACHING INSTITUTE WORKSPACE
// ==========================================
function CoachingDashboard({ user, activeTab, setActiveTab }: { user: UserProfile, activeTab: string, setActiveTab: (t: string) => void }) {
  const { toast } = useToast();
  const [coachingProfile, setCoachingProfile] = useState<any>(null);

  useEffect(() => {
    const sync = () => {
      const all = dbService.getCoaching();
      setCoachingProfile(all.find(c => c.userId === user.id) || null);
    };
    sync();
    return subscribeToDB(sync);
  }, [user.id]);

  return (
    <div>
      <h3 className="text-lg font-bold font-display text-slate-900 mb-1">{user.name} Portal</h3>
      <p className="text-xs text-slate-400 mb-6">Manage batch schedules, admission lists, fees structure, and gallery details.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border border-slate-100 rounded-2xl bg-white">
          <div className="text-slate-400 text-[10px] uppercase font-bold">Total Enrolled Admissions</div>
          <div className="font-mono text-3xl font-black text-indigo-600 mt-1">45</div>
        </div>
        <div className="p-4 border border-slate-100 rounded-2xl bg-white">
          <div className="text-slate-400 text-[10px] uppercase font-bold">Listed Batch Courses</div>
          <div className="font-mono text-3xl font-black text-indigo-600 mt-1">3</div>
        </div>
        <div className="p-4 border border-slate-100 rounded-2xl bg-white">
          <div className="text-slate-400 text-[10px] uppercase font-bold">Subscribed Status</div>
          <div className="font-mono text-sm font-black text-slate-700 mt-3 uppercase">Institute Pro Plan</div>
        </div>
      </div>

      <div className="mt-8 p-6 border border-dashed border-slate-200 bg-white rounded-3xl text-center text-slate-400 max-w-xl mx-auto py-12">
        <Sparkles className="w-10 h-10 mx-auto text-amber-500 opacity-60 mb-2" />
        <h4 className="font-bold text-slate-700">Course Directories Live</h4>
        <p className="text-xs text-slate-400 mt-1">APEX Engineering/NEET batches are synchronized with Mumbai regional servers.</p>
      </div>
    </div>
  );
}

// ==========================================
// 4. COLLEGE CAMPUS WORKSPACE
// ==========================================
function CollegeDashboard({ user, activeTab, setActiveTab }: { user: UserProfile, activeTab: string, setActiveTab: (t: string) => void }) {
  return (
    <div>
      <h3 className="text-lg font-bold font-display text-slate-900 mb-1">{user.name} Campus Panel</h3>
      <p className="text-xs text-slate-400 mb-6">Update placement brochures, verify direct applications, and moderate alumni reviews.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border border-slate-100 rounded-2xl bg-white">
          <div className="text-slate-400 text-[10px] uppercase font-bold">Placement Average Salary</div>
          <div className="font-mono text-2xl font-black text-indigo-600 mt-1">₹7.8 Lakhs/yr</div>
        </div>
        <div className="p-4 border border-slate-100 rounded-2xl bg-white">
          <div className="text-slate-400 text-[10px] uppercase font-bold">Open Direct Admission Applications</div>
          <div className="font-mono text-2xl font-black text-indigo-600 mt-1">12</div>
        </div>
        <div className="p-4 border border-slate-100 rounded-2xl bg-white">
          <div className="text-slate-400 text-[10px] uppercase font-bold">Campus Rating</div>
          <div className="font-mono text-2xl font-black text-slate-700 mt-1">★ 4.6 (95 reviews)</div>
        </div>
      </div>

      <div className="mt-8 p-6 border border-dashed border-slate-200 bg-white rounded-3xl text-center text-slate-400 max-w-xl mx-auto py-12">
        <Sparkles className="w-10 h-10 mx-auto text-indigo-500 opacity-60 mb-2" />
        <h4 className="font-bold text-slate-700">Brochures and Placements Synced</h4>
        <p className="text-xs text-slate-400 mt-1">Your placement catalogs and CSD rankings are visible across Indian student search filters.</p>
      </div>
    </div>
  );
}

// ==========================================
// 5. SUPER ADMIN WORKSPACE (With Live Audits)
// ==========================================
function AdminDashboard({ user, activeTab, setActiveTab }: { user: UserProfile, activeTab: string, setActiveTab: (t: string) => void }) {
  const { toast } = useToast();
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const sync = () => {
      setTutors(dbService.getTutors());
      setAllUsers(dbService.getUsers());
    };
    sync();
    return subscribeToDB(sync);
  }, []);

  const handleAuditVerification = (userId: string) => {
    dbService.verifyTutor(userId);
    toast('Tutor credentials verified and approved successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-150 pb-4">
        <span className="text-xs text-rose-500 font-extrabold tracking-widest uppercase flex items-center gap-1.5 mb-1 animate-pulse">
          <Bell className="w-3.5 h-3.5" />
          Platform System Core Control
        </span>
        <h3 className="text-2xl font-black text-slate-900 font-display">TutorConnect Central Administration</h3>
        <p className="text-xs text-slate-500">Supervise registrations, approve document uploads, audit payments, and handle disputes.</p>
      </div>

      {/* Metrics bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase">Total Users</span>
            <div className="font-mono text-2xl font-black mt-0.5">{allUsers.length}</div>
          </div>
          <Users className="w-8 h-8 text-indigo-400 shrink-0 opacity-80" />
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase">Total Listed Tutors</span>
            <div className="font-mono text-2xl font-black mt-0.5">{tutors.length}</div>
          </div>
          <GraduationCap className="w-8 h-8 text-amber-400 shrink-0 opacity-80" />
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase">Platform Transactions</span>
            <div className="font-mono text-2xl font-black mt-0.5">{dbService.getBookings().length}</div>
          </div>
          <DollarSign className="w-8 h-8 text-indigo-400 shrink-0 opacity-80" />
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase">Active Cities</span>
            <div className="font-mono text-2xl font-black mt-0.5">10</div>
          </div>
          <MapPin className="w-8 h-8 text-blue-400 shrink-0 opacity-80" />
        </div>
      </div>

      {/* Tutors credential verification log */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-slate-900 font-display text-sm">Verify Tutors Credentials & Audit Uploads</h4>
          <span className="text-[10px] bg-amber-50 text-amber-800 font-extrabold px-3 py-1 rounded-full border border-amber-100">
            Awaiting Document Checks
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {tutors.map((t) => {
            const isVerified = t.documents?.verified;
            return (
              <div key={t.userId} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-900">{t.name}</span>
                    <span className="text-[9px] text-slate-400 font-mono">ID: {t.userId}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">{t.qualification} • {t.experience} yrs exp</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Teaches: {t.subjects.join(', ')}</p>
                </div>
                <div>
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                      Approved
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAuditVerification(t.userId)}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                    >
                      Audit & Approve Badge
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
