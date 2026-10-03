import React, { useState } from 'react';
import { useAuth, ADMIN_PASSKEY } from '../context/AuthContext';
import {
  X,
  Building2,
  Lock,
  Mail,
  User as UserIcon,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  UserCheck,
  Shield,
  ArrowRight,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInAsAdmin,
    signInAsCustomer,
    error,
    clearError,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'admin'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setLocalError(null);
    clearError();
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSignIn = () => {
    signInAsAdmin('Tayeba (Administrator)', 'tayebarizu@gmail.com');
    onClose();
  };

  const handleCustomerSignIn = () => {
    signInAsCustomer('Adeola Adeleke (Client)', 'adeola.customer@gmail.com');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);
    clearError();

    try {
      if (mode === 'signup') {
        if (!fullName.trim()) {
          setLocalError('Please enter your full name');
          setLoading(false);
          return;
        }

        if (selectedRole === 'admin' && !adminKey.trim()) {
          setLocalError(`Admin registration requires the Security Key (Default: ${ADMIN_PASSKEY})`);
          setLoading(false);
          return;
        }

        await signUpWithEmail(email, password, fullName, selectedRole, adminKey);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setLocalError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 my-6"
      >
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-brown rounded-xl flex items-center justify-center text-white shadow">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg font-display">
                {mode === 'signin' ? 'Sign In to Lagos Prime' : 'Create New Account'}
              </h3>
              <p className="text-xs text-stone-300">
                {mode === 'signin'
                  ? 'Access your client bookings or executive portal'
                  : 'Select your role: Customer or Administrator'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {(localError || error) && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{localError || error}</span>
            </div>
          )}

          {/* Role Separation Notice in clean English */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center gap-2 text-[11px] text-stone-600">
            <Shield className="w-4 h-4 text-brand-brown shrink-0" />
            <span>
              <strong>Role Separation:</strong> Customer and Administrator accounts are distinct and strictly separated.
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Quick Access
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                One-Click
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCustomerSignIn}
                className="py-3 px-3 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-stone-300 shadow-sm"
              >
                <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="text-left">
                  <div className="text-[11px] font-black">Customer Login</div>
                  <div className="text-[10px] text-stone-500 font-normal">View Tours & Listings</div>
                </div>
              </button>

              <button
                type="button"
                onClick={handleAdminSignIn}
                className="py-3 px-3 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-amber-300 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="text-left">
                  <div className="text-[11px] font-black">Admin Login</div>
                  <div className="text-[10px] text-amber-800 font-normal">Executive Controls</div>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-white hover:bg-stone-50 text-stone-900 font-bold text-xs rounded-xl border border-stone-300 shadow-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="pt-2 border-t border-stone-100">
            {!showEmailForm ? (
              <button
                type="button"
                onClick={() => setShowEmailForm(true)}
                className="w-full text-center py-2 text-xs font-semibold text-stone-500 hover:text-brand-brown transition-colors cursor-pointer"
              >
                Or register / sign in with email &rarr;
              </button>
            ) : (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">
                    {mode === 'signup' ? 'Create Account' : 'Email Sign In'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    className="text-stone-400 hover:text-stone-700 font-semibold cursor-pointer"
                  >
                    Hide
                  </button>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1.5">
                      Account Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('customer')}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          selectedRole === 'customer'
                            ? 'bg-stone-900 text-white border-stone-900 shadow'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <UserIcon className="w-3.5 h-3.5" />
                          <span>Customer</span>
                        </div>
                        <div className="text-[10px] opacity-80 mt-0.5">Client & Buyer</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole('admin')}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          selectedRole === 'admin'
                            ? 'bg-amber-500 text-stone-950 border-amber-600 shadow'
                            : 'bg-amber-50/50 text-amber-950 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Administrator</span>
                        </div>
                        <div className="text-[10px] opacity-80 mt-0.5">Management Staff</div>
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-brown focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-brown focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-brown focus:outline-none"
                    />
                  </div>

                  {mode === 'signup' && selectedRole === 'admin' && (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-1">
                      <label className="block text-[11px] font-bold text-amber-950 flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                        <span>Admin Security Passkey</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={`e.g. ${ADMIN_PASSKEY}`}
                        value={adminKey}
                        onChange={(e) => setAdminKey(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs font-mono font-bold text-amber-950 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      <p className="text-[10px] text-amber-800">
                        Default Passkey: <strong>{ADMIN_PASSKEY}</strong>
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>
                      {loading
                        ? 'Please wait...'
                        : mode === 'signin'
                        ? 'Sign In'
                        : `Register as ${selectedRole === 'admin' ? 'Administrator' : 'Customer'}`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'signin' ? 'signup' : 'signin');
                      setLocalError(null);
                    }}
                    className="text-xs text-brand-brown hover:underline font-semibold cursor-pointer"
                  >
                    {mode === 'signin'
                      ? "Don't have an account? Sign Up"
                      : 'Already have an account? Sign In'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};