import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useApp } from '../context/AppContext';
import { AppLogo } from '../components/AppLogo';
import { 
  ArrowLeft, 
  ExternalLink, 
  Gift, 
  HelpCircle, 
  ShieldAlert, 
  Share2, 
  Check, 
  Send, 
  Flame, 
  Star, 
  Info,
  Calendar
} from 'lucide-react';

export const AppDetailsPage: React.FC = () => {
  const { selectedAppSlug, navigate } = useNavigation();
  const { apps } = useApp();
  const [copied, setCopied] = useState(false);

  // Find app by slug or ID
  const app = apps.find(
    (a) => a.slug === selectedAppSlug || a.id === selectedAppSlug
  );

  if (!app) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">App Not Found</h2>
        <p className="text-sm text-gray-500">
          The requested application listing could not be found or might have been unpublished.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-purple-700 hover:bg-purple-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOfficialLinkClick = () => {
    if (!app.officialUrl) return;
    let url = app.officialUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* Top Bar with Back and Share */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-bold text-purple-900 hover:text-purple-700 bg-white hover:bg-purple-50 px-3.5 py-2 rounded-xl border border-purple-200 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Apps</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-purple-700 bg-white hover:bg-purple-50 px-3 py-2 rounded-xl border border-gray-200 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-gray-500" />
              <span>Share App</span>
            </>
          )}
        </button>
      </div>

      {/* Main App Header Card */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Logo */}
          <AppLogo
            src={app.logoUrl}
            alt={app.name}
            size="lg"
            className="w-full h-full object-cover"
          />

          {/* Details header */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-100 text-purple-900">
                {app.category}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700">
                {app.appType}
              </span>

              {app.isNew && (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-200">
                  <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  NEW
                </span>
              )}

              {app.isFeatured && (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-900">
                  <Star className="w-3.5 h-3.5 text-indigo-600 fill-indigo-500" />
                  FEATURED
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {app.name}
            </h1>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {app.shortDescription}
            </p>
          </div>
        </div>

        {/* Bonus Highlight Box */}
        {app.bonusText && (
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50/50 to-purple-50 border border-purple-200/90 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
            <div className="p-2 bg-purple-700 text-white rounded-xl flex-shrink-0 shadow-xs">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-wider text-purple-950 uppercase mb-0.5">
                Bonus / Offer Information
              </h4>
              <p className="text-sm sm:text-base font-extrabold text-purple-900">
                {app.bonusText}
              </p>
              <p className="text-[11px] text-purple-600/90 mt-1">
                *All bonuses and promotional values are determined by the application operator and subject to their official terms.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleOfficialLinkClick}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-base text-white bg-purple-700 hover:bg-purple-800 shadow-md shadow-purple-700/25 active:scale-98 transition-all cursor-pointer"
          >
            <span>Visit Official Website</span>
            <ExternalLink className="w-5 h-5" />
          </button>

          {app.telegramUrl && (
            <a
              href={app.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm text-purple-900 bg-purple-100 hover:bg-purple-200 transition-colors"
            >
              <Send className="w-4 h-4 text-purple-700" />
              <span>Telegram Updates</span>
            </a>
          )}
        </div>
      </div>

      {/* Description & How It Works */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Overview */}
        <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-purple-900 font-extrabold text-base">
            <Info className="w-5 h-5 text-purple-700" />
            <h3>Overview & Information</h3>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {app.fullDescription || app.shortDescription}
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-purple-900 font-extrabold text-base">
            <HelpCircle className="w-5 h-5 text-purple-700" />
            <h3>How It Works</h3>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {app.howItWorks || 'Visit the official link above, register your profile through the official instructions, and review available incentives.'}
          </p>
        </div>
      </div>

      {/* Age & Legal Notices */}
      {(app.ageNotice || app.legalNotice || app.appType === 'Rummy / Real-Money Gaming') && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 space-y-3 text-amber-950">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <h4 className="text-sm uppercase tracking-wider">
              Legal, Eligibility & Responsible Participation
            </h4>
          </div>

          <div className="text-xs sm:text-sm space-y-2 text-amber-900/90 leading-relaxed">
            {app.ageNotice && (
              <p>
                <strong>Age Notice:</strong> {app.ageNotice}
              </p>
            )}

            {app.legalNotice && (
              <p>
                <strong>Territory Notice:</strong> {app.legalNotice}
              </p>
            )}

            <p className="text-[11px] text-amber-800/80 pt-1">
              Warning: Games involving real money or stakes carry financial risk and may be addictive. Please play responsibly and within your means. The user is solely responsible for verifying the legal status of online games in their local jurisdiction.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
