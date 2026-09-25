import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, ShieldAlert, CheckCircle2, ArrowRight, Eye, EyeOff, Copy, Check } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    openAuthModal,
    loginWithEmailPassword,
    signupWithEmailPassword,
    loginWithGoogle
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setUnauthorizedDomain(null);
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        await loginWithEmailPassword(email, password);
        setSuccessMsg('Logged in successfully!');
      } else {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name');
          setLoading(false);
          return;
        }
        await signupWithEmailPassword(email, password, name);
        setSuccessMsg('Account created successfully!');
      }
      setTimeout(() => {
        closeAuthModal();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setUnauthorizedDomain(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      setSuccessMsg('Connected with Google!');
      setTimeout(() => {
        closeAuthModal();
      }, 600);
    } catch (err: any) {
      console.error('Google sign in error:', err);
      const host = window.location.hostname;
      if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.includes('unauthorized-domain'))) {
        setUnauthorizedDomain(host);
        setErrorMsg(`Unauthorized Domain: "${host}" is not added in Firebase Authorised domains yet.`);
      } else if (err.code === 'auth/popup-blocked') {
        setErrorMsg('Popup was blocked by your browser. Please allow popups or test in a separate window.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in cancelled: The Google popup was closed before completion.');
      } else {
        setErrorMsg(err.message || 'Google sign-in failed. Please verify your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDomain = () => {
    if (unauthorizedDomain) {
      navigator.clipboard.writeText(unauthorizedDomain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#111111] border border-white/10 p-6 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.95)]">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C542]/10 border border-[#F5C542]/30 text-[#FFD966] text-xs font-mono uppercase tracking-wider mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>ZAZU DIGITAL PORTAL</span>
          </div>
          <h3 className="text-2xl font-display font-bold text-white tracking-tight">
            {authModalMode === 'login' ? 'Sign In' : 'Register Account'}
          </h3>
          <p className="text-xs text-[#A0A0A0] mt-1.5">
            {authModalMode === 'login'
              ? 'Enter your email & password to access your account.'
              : 'Create an account to manage your inquiries and bookings.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-black/60 rounded-xl border border-white/5 mb-5">
          <button
            type="button"
            onClick={() => { openAuthModal('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              authModalMode === 'login'
                ? 'bg-[#F5C542] text-[#080808] shadow-md font-bold'
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { openAuthModal('signup'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              authModalMode === 'signup'
                ? 'bg-[#F5C542] text-[#080808] shadow-md font-bold'
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Continue with Google */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 text-white text-xs font-semibold transition-all flex items-center justify-center gap-3 mb-4 group cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#111111] px-3 text-[11px] font-mono uppercase text-[#666666]">OR EMAIL</span>
          <div className="border-t border-white/10 w-full" />
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {unauthorizedDomain && (
          <div className="mb-4 p-3.5 rounded-xl bg-[#1A1A1A] border border-[#F5C542]/40 text-left space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FFD966]">Firebase Setup Step</span>
              <button
                type="button"
                onClick={handleCopyDomain}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#F5C542] text-[#080808] text-[10px] font-bold hover:bg-[#FFD966] transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy Domain'}</span>
              </button>
            </div>
            <p className="text-[11px] text-[#D4D4D4] leading-relaxed">
              To allow Google Sign-In, please add your current preview domain to Firebase:
            </p>
            <div className="p-2 rounded bg-black border border-white/10 font-mono text-[11px] text-[#FFD966] break-all select-all">
              {unauthorizedDomain}
            </div>
            <p className="text-[10px] text-[#888888] leading-tight">
              Steps: Open your Firebase Console &rarr; Authentication &rarr; Settings &rarr; Authorised domains &rarr; Click <strong>"Add domain"</strong> &rarr; Paste this domain.
            </p>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-green-950/40 border border-green-500/40 text-green-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalMode === 'signup' && (
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[#A0A0A0] block mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full pl-9 pr-3 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#F5C542] transition-colors"
                />
                <User className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-[#A0A0A0] block mb-1">
              {authModalMode === 'login' ? 'Username or Email' : 'Email Address'}
            </label>
            <div className="relative">
              <input
                type={authModalMode === 'login' ? 'text' : 'email'}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={authModalMode === 'login' ? 'Enter username or email' : 'Enter email address'}
                className="w-full pl-9 pr-3 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#F5C542] transition-colors"
              />
              <Mail className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-[#A0A0A0] block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-10 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#F5C542] transition-colors"
              />
              <Lock className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#666666] hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#F5C542] to-[#FFD966] text-[#080808] hover:shadow-[0_0_20px_rgba(245,197,66,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <span>{authModalMode === 'login' ? 'Login' : 'Register Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
