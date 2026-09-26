import React, { useState, useEffect } from 'react';
import { useAuth, AUTHORIZED_ADMIN_EMAIL } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { 
  Sparkles, 
  Lock, 
  ShieldAlert, 
  ShieldCheck, 
  ExternalLink, 
  AlertCircle,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';

const GoogleIcon: React.FC = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const AdminLoginPage: React.FC = () => {
  const { loginWithGoogle, isAdmin, authError, clearAuthError } = useAuth();
  const { navigate } = useNavigation();

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isOperationNotAllowed, setIsOperationNotAllowed] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setLocalError(null);
    clearAuthError();
    setIsOperationNotAllowed(false);

    try {
      await loginWithGoogle();
      navigate('/admin');
    } catch (err: any) {
      console.error('Admin Google sign-in failed:', err);

      if (err.code === 'auth/operation-not-allowed') {
        setIsOperationNotAllowed(true);
        setLocalError(
          'Google Sign-In is not yet toggled on in your Firebase Console. Follow the quick steps below to enable it.'
        );
      } else if (err.code === 'auth/popup-closed-by-user') {
        setLocalError('Sign-in popup was closed before completion. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setLocalError('The sign-in popup was blocked by your browser. Please allow popups for this site and try again.');
      } else if (err.message === 'You are not authorized to access the Admin Panel.' || err.message === 'UNAUTHORIZED_ADMIN') {
        setLocalError('You are not authorized to access the Admin Panel.');
      } else {
        setLocalError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const displayedError = localError || authError;

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12">
      {/* Back to Home Link */}
      <div className="w-full max-w-md mb-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-purple-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Yono Bonus Link Home</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl border border-purple-100 p-8 shadow-xl shadow-purple-900/5 space-y-6">
        {/* Header Icon & Brand */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-purple-800 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-700/25">
            <Lock className="w-8 h-8 text-white" />
          </div>

          <div className="pt-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
              Admin Portal
            </span>
          </div>

          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Yono Bonus Link
          </h1>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Authorized administrator access for managing apps, categories, and settings.
          </p>
        </div>

        {/* Error / Unauthorized Notice */}
        {displayedError && (
          <div className={`p-4 rounded-2xl border text-xs space-y-1.5 animate-in fade-in duration-150 ${
            displayedError === 'You are not authorized to access the Admin Panel.'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>
                {displayedError === 'You are not authorized to access the Admin Panel.'
                  ? 'Access Denied'
                  : 'Notice'}
              </span>
            </div>
            <p className="font-semibold leading-relaxed">
              {displayedError}
            </p>
          </div>
        )}

        {/* Firebase Console Instruction Banner if operation-not-allowed */}
        {isOperationNotAllowed && (
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 text-xs space-y-2.5">
            <div className="flex items-center gap-1.5 font-black text-purple-900">
              <HelpCircle className="w-4 h-4 text-purple-700" />
              <span>Enable Google Provider in Firebase Console</span>
            </div>
            <p className="text-purple-800 leading-relaxed">
              To activate Google Sign-In for your project:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-purple-900 font-medium">
              <li>Open your project&rsquo;s <strong>Authentication &gt; Sign-in method</strong> tab.</li>
              <li>Click <strong>Google</strong> under Additional providers.</li>
              <li>Toggle <strong>Enable</strong>, select your support email, and click <strong>Save</strong>.</li>
            </ol>
            <a
              href="https://console.firebase.google.com/project/gen-lang-client-0219310736/authentication/providers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold text-xs shadow-xs transition-colors"
            >
              <span>Open Firebase Sign-in Settings</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Primary Action: Google Sign-In */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm text-gray-800 bg-white hover:bg-gray-50 active:bg-gray-100 border-2 border-purple-200 hover:border-purple-400 shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer disabled:opacity-50"
          >
            <GoogleIcon />
            <span>{loading ? 'Authenticating with Google...' : 'Continue with Google'}</span>
          </button>

          {/* Authorized Admin Notice */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-[11px] text-gray-500">
              Authorized admin account:
            </p>
            <p className="text-xs font-mono font-bold text-purple-900 mt-0.5 select-all">
              {AUTHORIZED_ADMIN_EMAIL}
            </p>
          </div>
        </div>

        {/* Footer Security Badges */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Firebase OAuth</span>
          </div>
          <span>Single-Admin RBAC</span>
        </div>
      </div>
    </div>
  );
};
