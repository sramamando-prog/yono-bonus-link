import React from 'react';
import { useApp } from '../context/AppContext';
import { Send, Bell, ShieldCheck, CheckCircle2, Users } from 'lucide-react';

export const TelegramPage: React.FC = () => {
  const { settings } = useApp();
  const telegramUrl = settings.telegramUrl || 'https://t.me/Job_wala_Akash';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="bg-white rounded-3xl border border-purple-100 p-8 sm:p-12 shadow-xs text-center space-y-6">
        {/* Telegram Icon Badge */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30">
          <Send className="w-10 h-10 -ml-1 mt-1" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Official Community Channel
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Join Yono Bonus Link Telegram
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
            Get instant notifications when new apps, verified reward offers, or domain link updates are published by the admin.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-black text-base text-white bg-purple-700 hover:bg-purple-800 shadow-md shadow-purple-700/25 active:scale-98 transition-all"
          >
            <Send className="w-5 h-5" />
            <span>Join Official Telegram Channel</span>
          </a>
        </div>

        {/* Benefits list */}
        <div className="border-t border-gray-100 pt-8 mt-6 text-left grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/50">
            <Bell className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wide text-gray-900">
                Instant Alerts
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                Be the first to know whenever new apps or special bonus events are catalogued.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/50">
            <ShieldCheck className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wide text-gray-900">
                Verified Link Protection
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                Direct safe links to protect you from spoofed websites or unverified APK copies.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/50">
            <CheckCircle2 className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wide text-gray-900">
                No Spam Guarantee
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                Only genuine, verified official updates are posted.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/50">
            <Users className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wide text-gray-900">
                Transparent Community
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                Join a community focused on transparency, security, and factual details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
