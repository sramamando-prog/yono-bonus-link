import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Menu, 
  X, 
  Send, 
  ShieldCheck, 
  Layers, 
  HelpCircle, 
  Mail, 
  FileText,
  Lock
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentPath, navigate } = useNavigation();
  const { settings } = useApp();
  const { isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Disclaimer', path: '/disclaimer' },
    { label: 'Telegram', path: '/telegram' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-xs transition-all duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-800 via-purple-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-gray-900 leading-tight">
                Yono <span className="text-purple-700">Bonus</span> Link
              </span>
              <span className="text-[10px] text-purple-600 font-medium tracking-wide hidden sm:block">
                Verified Offers & Official Links
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-purple-50 text-purple-800 font-bold border border-purple-200 shadow-xs'
                      : 'text-gray-600 hover:text-purple-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {settings.telegramUrl && (
              <a
                href={settings.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 shadow-sm shadow-purple-700/20 hover:shadow-purple-700/40 active:scale-95 transition-all duration-150"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Join Telegram</span>
              </a>
            )}

            {isAdmin ? (
              <button
                onClick={() => navigate('/admin')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-purple-900 bg-purple-100 hover:bg-purple-200 transition-colors cursor-pointer"
                title="Admin Dashboard"
              >
                <ShieldCheck className="w-4 h-4 text-purple-700" />
                <span>Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/admin/login')}
                className="p-2 text-gray-400 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
                title="Admin Access"
                aria-label="Admin Access"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            {settings.telegramUrl && (
              <a
                href={settings.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 shadow-xs"
              >
                <Send className="w-3 h-3" />
                <span>Telegram</span>
              </a>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-purple-700 hover:bg-purple-50 rounded-xl focus:outline-hidden transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-purple-100 shadow-xl px-4 pt-2 pb-5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-100 text-purple-900 font-bold'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-800'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            {settings.telegramUrl && (
              <a
                href={settings.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Join Official Telegram</span>
              </a>
            )}

            <button
              onClick={() => {
                navigate(isAdmin ? '/admin' : '/admin/login');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-purple-900 bg-purple-50 hover:bg-purple-100 transition-colors"
            >
              <Lock className="w-4 h-4 text-purple-700" />
              <span>{isAdmin ? 'Admin Dashboard' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
