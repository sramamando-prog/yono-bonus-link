import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useApp } from '../context/AppContext';
import { Sparkles, Send, ShieldAlert, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useNavigation();
  const { settings } = useApp();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-purple-100/80 text-gray-600 mt-16 transition-colors">
      {/* Responsible Gaming Notice Bar */}
      <div className="bg-purple-900 text-white py-3.5 px-4 text-xs font-medium">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-purple-950 font-black text-[11px] px-1.5 py-0.5 rounded-sm">18+</span>
            <span>Responsible Gaming & Informational Notice: Game responsibly. Some apps may involve financial risk.</span>
          </div>
          <button 
            onClick={() => navigate('/disclaimer')}
            className="text-purple-200 hover:text-white underline text-xs cursor-pointer font-semibold"
          >
            Read Full Disclaimer
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2.5 cursor-pointer group inline-flex"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-700 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <span className="font-extrabold text-xl text-gray-900">
                Yono <span className="text-purple-700">Bonus</span> Link
              </span>
            </div>
            
            <p className="text-sm text-gray-500 max-w-md leading-relaxed">
              Yono Bonus Link is an independent informational directory for reward, bonus, and gaming application links. We do not provide financial advice, guarantee earnings, or host gaming operations.
            </p>

            {settings.telegramUrl && (
              <div className="pt-1">
                <a
                  href={settings.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Join Our Telegram Channel</span>
                </a>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-purple-900 uppercase mb-3.5">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-600 hover:text-purple-700 hover:underline cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="text-gray-600 hover:text-purple-700 hover:underline cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="text-gray-600 hover:text-purple-700 hover:underline cursor-pointer"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/disclaimer')}
                  className="text-gray-600 hover:text-purple-700 hover:underline cursor-pointer"
                >
                  Disclaimer & Safety
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/telegram')}
                  className="text-gray-600 hover:text-purple-700 hover:underline cursor-pointer"
                >
                  Telegram Channel
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-purple-900 uppercase mb-3.5">
              Safety & Terms
            </h4>
            <div className="space-y-2 text-xs text-gray-500 leading-normal">
              <p>
                All app trademarks, logos, and brands belong to their respective copyright owners.
              </p>
              <p>
                Users must verify promotional rules, bonuses, and terms directly on the official developer sites.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/admin/login')}
                  className="text-xs text-gray-400 hover:text-purple-700 font-medium underline"
                >
                  Admin Portal
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>© {currentYear} Yono Bonus Link. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with transparency & security
          </p>
        </div>
      </div>
    </footer>
  );
};
