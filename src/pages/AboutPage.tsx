import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Sparkles, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-purple-700" />
          <span>Informational App Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          About Yono Bonus Link
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Your transparent gateway to verified app links, bonus notices, and official publisher destinations.
        </p>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-10 shadow-xs space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h2>
          <p>
            <strong>Yono Bonus Link</strong> is an independent digital catalogue founded to solve a common problem in the online rewards and gaming landscape: broken download links, misleading claims, and insecure unofficial clones. We provide an organized, mobile-first directory where every link points to official publisher pages.
          </p>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Our Core Principles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">No Guaranteed Earnings</h4>
                <p className="text-xs text-gray-600 mt-1">
                  We never claim users are guaranteed to win money. All bonuses and payouts are strictly determined by third-party application terms.
                </p>
              </div>
            </div>

            <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Direct Official URLs</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Every button opens verified official links published by the administrator. We do not re-host apps or distribute modified packages.
                </p>
              </div>
            </div>

            <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Zero Phishing Guarantee</h4>
                <p className="text-xs text-gray-600 mt-1">
                  We never request user passwords, OTPs, Aadhaar, PAN, or financial banking credentials under any circumstance.
                </p>
              </div>
            </div>

            <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Responsible Gaming</h4>
                <p className="text-xs text-gray-600 mt-1">
                  We advocate strict compliance with 18+ regulations and territory laws regarding games of skill and real-money gaming.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">How Information is Verified</h2>
          <p className="text-sm text-gray-600">
            Information presented on this website is manually curated and reviewed by the site administrator. Application developers frequently modify their promotional conditions, sign-up perks, and seasonal offers. Users are advised to review the terms on official websites prior to participating.
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-purple-700 hover:bg-purple-800 transition-colors shadow-xs"
          >
            <span>Explore App Directory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
