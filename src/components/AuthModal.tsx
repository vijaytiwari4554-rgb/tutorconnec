import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Phone, Lock, User, Sparkles, LogIn, Key, Compass, ShieldCheck } from 'lucide-react';
import { dbService } from '../lib/db';
import { UserRole } from '../types';
import { useToast } from './Toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type AuthView = 'login' | 'register' | 'forgot_password' | 'phone_otp' | 'otp_verify' | 'email_verify';

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { toast } = useToast();
  const [view, setView] = useState<AuthView>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [otpSentPhone, setOtpSentPhone] = useState('');
  const [emailForVerify, setEmailForVerify] = useState('');

  // Forms config
  const { register: regLogin, handleSubmit: handleLoginSubmit, reset: resetLogin } = useForm();
  const { register: regSignup, handleSubmit: handleSignupSubmit, reset: resetSignup } = useForm();
  const { register: regForgot, handleSubmit: handleForgotSubmit, reset: resetForgot } = useForm();
  const { register: regPhone, handleSubmit: handlePhoneSubmit, reset: resetPhone } = useForm();
  const { register: regOtp, handleSubmit: handleOtpSubmit, reset: resetOtp } = useForm();

  if (!isOpen) return null;

  // Login handler
  const onLogin = (data: any) => {
    try {
      const user = dbService.login(data.email, selectedRole);
      toast(`Successfully logged in as ${user.name} (${user.role.toUpperCase()})!`, 'success');
      resetLogin();
      if (onSuccess) onSuccess();
      onClose();
    } catch (e: any) {
      toast('Login failed. Please check your inputs.', 'error');
    }
  };

  // Signup handler
  const onSignup = (data: any) => {
    try {
      const users = dbService.getUsers();
      const exists = users.find(u => u.email.toLowerCase() === data.email.toLowerCase() && u.role === selectedRole);
      if (exists) {
        toast(`An account with this email already exists as a ${selectedRole}.`, 'error');
        return;
      }

      // Create profile
      const newUser = dbService.login(data.email, selectedRole);
      dbService.updateProfile({
        name: data.name,
        phone: data.phone || '',
        city: data.city || 'Mumbai',
        area: data.area || '',
        pincode: data.pincode || '',
        photoUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?w=150&auto=format&fit=crop`
      });

      setEmailForVerify(data.email);
      setView('email_verify'); // Proceed to email verification code screen
      toast('Welcome! We sent an activation verification code to your email.', 'info');
      resetSignup();
    } catch (e) {
      toast('Registration failed.', 'error');
    }
  };

  // Google OAuth Login handler
  const onGoogleLogin = () => {
    // Standard Firebase Auth Popup simulation
    const mockEmail = `${selectedRole}-connect@google.com`;
    const user = dbService.login(mockEmail, selectedRole);
    dbService.updateProfile({
      name: `Google User (${selectedRole.toUpperCase()})`,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop'
    });
    toast(`Google Account authenticated! Welcome, ${user.name}.`, 'success');
    if (onSuccess) onSuccess();
    onClose();
  };

  // Forgot password
  const onForgotPassword = (data: any) => {
    toast(`Password reset instructions successfully sent to ${data.email}.`, 'success');
    resetForgot();
    setView('login');
  };

  // Send OTP handler
  const onSendOtp = (data: any) => {
    setOtpSentPhone(data.phone);
    setView('otp_verify');
    toast(`SMS verification code OTP ("123456") successfully dispatched to ${data.phone}.`, 'success');
    resetPhone();
  };

  // OTP verify handler
  const onVerifyOtp = (data: any) => {
    if (data.code === '123456') {
      const mockEmail = `${otpSentPhone.replace(/[^0-9]/g, '')}@otp-connect.in`;
      const user = dbService.login(mockEmail, selectedRole);
      dbService.updateProfile({
        name: `OTP User ${otpSentPhone.slice(-5)}`,
        phone: otpSentPhone
      });
      toast(`Phone OTP verified! Signed in as ${user.name}.`, 'success');
      resetOtp();
      if (onSuccess) onSuccess();
      onClose();
    } else {
      toast('Incorrect verification code. Use OTP: 123456', 'error');
    }
  };

  // Email verification check
  const onVerifyEmail = (data: any) => {
    if (data.code === '555555' || data.code.length === 6) {
      toast('Email successfully verified! Your TutorConnect India account is now active.', 'success');
      if (onSuccess) onSuccess();
      onClose();
    } else {
      toast('Incorrect code. Try entering 555555.', 'error');
    }
  };

  const roles: { val: UserRole; label: string }[] = [
    { val: 'student', label: 'Student' },
    { val: 'parent', label: 'Parent' },
    { val: 'tutor', label: 'Tutor' },
    { val: 'coaching', label: 'Coaching' },
    { val: 'college', label: 'College' },
    { val: 'admin', label: 'Admin' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
      >
        {/* Header decoration */}
        <div className="bg-indigo-600 h-1.5" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 max-h-[90vh] overflow-y-auto">
          {/* Logo & Subtext */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-2">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Secure Edu-Portal
            </span>
            <h2 className="text-2xl font-extrabold font-display text-slate-900 tracking-tight">
              TutorConnect <span className="text-indigo-600">India</span>
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Direct and transparent peer-to-peer education marketplace
            </p>
          </div>

          {/* Role selector - Hide for verification codes */}
          {view !== 'otp_verify' && view !== 'email_verify' && (
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                1. Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl">
                {roles.map((r) => (
                  <button
                    key={r.val}
                    type="button"
                    onClick={() => setSelectedRole(r.val)}
                    className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      selectedRole === r.val
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form blocks based on View state */}
          <AnimatePresence mode="wait">
            {view === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="e.g., rahul@gmail.com"
                        {...regLogin('email')}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-slate-600">Password</label>
                      <button
                        type="button"
                        onClick={() => setView('forgot_password')}
                        className="text-xs text-indigo-600 hover:underline font-semibold"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        defaultValue="123456"
                        {...regLogin('password')}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    Secure Login
                  </button>
                </form>

                <div className="mt-4 flex flex-col gap-2.5">
                  <button
                    onClick={() => setView('phone_otp')}
                    className="w-full py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    Sign in with Phone OTP (SMS)
                  </button>

                  <button
                    onClick={onGoogleLogin}
                    className="w-full py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.281 1.094 15.548 0 12.24 0c-6.627 0-12 5.373-12 12s5.373 12 12 12c6.924 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                    </svg>
                    Simulate Google Login
                  </button>
                </div>

                <div className="mt-6 text-center text-xs text-slate-500">
                  New to TutorConnect India?{' '}
                  <button
                    onClick={() => setView('register')}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Create Account
                  </button>
                </div>
              </motion.div>
            )}

            {view === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <form onSubmit={handleSignupSubmit(onSignup)} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Kumar"
                        {...regSignup('name')}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. rahul@gmail.com"
                        {...regSignup('email')}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 XXXXX XXXXX"
                        {...regSignup('phone')}
                        className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">City</label>
                      <input
                        type="text"
                        required
                        placeholder="Mumbai"
                        {...regSignup('city')}
                        className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    Register Account
                  </button>
                </form>

                <div className="mt-4 text-center text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    onClick={() => setView('login')}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Log In
                  </button>
                </div>
              </motion.div>
            )}

            {view === 'forgot_password' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <div className="mb-4 text-xs text-slate-500">
                  Enter your registered email address below. We will send you secure instructions to reset your account password.
                </div>
                <form onSubmit={handleForgotSubmit(onForgotPassword)} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. rahul@gmail.com"
                        {...regForgot('email')}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setView('login')}
                      className="flex-1 py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-sm transition-all text-center cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all text-center shadow-md shadow-indigo-600/10 cursor-pointer"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {view === 'phone_otp' && (
              <motion.div
                key="phone_otp"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <div className="mb-4 text-xs text-slate-500">
                  Enter your mobile number. We will dispatch a 6-digit OTP verification code via SMS to securely authenticate your session.
                </div>
                <form onSubmit={handlePhoneSubmit(onSendOtp)} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        {...regPhone('phone')}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setView('login')}
                      className="flex-1 py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-sm transition-all text-center cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all text-center shadow-md shadow-indigo-600/10 cursor-pointer"
                    >
                      Send OTP Code
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {view === 'otp_verify' && (
              <motion.div
                key="otp_verify"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-800 flex items-start gap-2">
                  <Key className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <strong>Demo Mode OTP:</strong> We simulated sending an SMS to <strong>{otpSentPhone}</strong>. Use the code <strong>123456</strong> to proceed.
                  </div>
                </div>
                <form onSubmit={handleOtpSubmit(onVerifyOtp)} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 123456"
                      {...regOtp('code')}
                      className="w-full tracking-[1em] text-center font-mono py-3 border border-slate-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Verify & Authenticate
                  </button>
                </form>
              </motion.div>
            )}

            {view === 'email_verify' && (
              <motion.div
                key="email_verify"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-start gap-2">
                  <Key className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <strong>Verification Sent:</strong> We dispatched an activation code to <strong>{emailForVerify}</strong>. Use code <strong>555555</strong> to verify.
                  </div>
                </div>
                <form onSubmit={handleOtpSubmit(onVerifyEmail)} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">6-Digit Activation Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 555555"
                      {...regOtp('code')}
                      className="w-full tracking-[1em] text-center font-mono py-3 border border-slate-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Activate Account
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
