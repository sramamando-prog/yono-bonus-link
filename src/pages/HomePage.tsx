import React, { useRef, useState } from 'react';
import { Hero } from '../components/Hero';
import { StatsBar } from '../components/StatsBar';
import { AppGrid } from '../components/AppGrid';
import { AppLogo } from '../components/AppLogo';
import { useApp } from '../context/AppContext';
import { useNavigation } from '../context/NavigationContext';
import { ShieldCheck, Star, ExternalLink, ArrowRight, Gift, Send, Bell } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { apps } = useApp();
  const { navigate } = useNavigation();
  const listingRef = useRef<HTMLDivElement>(null);
  const [initialTab, setInitialTab] = useState<'all' | 'new'>('all');

  const scrollToListing = (tab: 'all' | 'new') => {
    setInitialTab(tab);
    const element = document.getElementById('apps-listing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Featured apps
  const featuredApps = apps.filter((a) => a.status === 'live' && a.isFeatured).slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <Hero
        onExploreClick={() => scrollToListing('all')}
        onNewAppsClick={() => scrollToListing('new')}
      />

      {/* Dynamic Statistics Bar from Firebase */}
      <StatsBar />

      {/* Featured Apps Carousel / Showcase */}
      {featuredApps.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                <Star className="w-4 h-4 fill-indigo-600" />
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                Featured Highlights
              </h2>
            </div>
            <span className="text-xs font-semibold text-gray-400">
              Admin Selected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredApps.map((app) => (
              <div
                key={app.id || app.slug}
                onClick={() => navigate(`/app/${app.slug}`)}
                className="bg-gradient-to-br from-white to-purple-50/50 rounded-2xl border border-purple-200/80 p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <AppLogo
                      src={app.logoUrl}
                      alt={app.name}
                      size="custom"
                      containerClassName="w-12 h-12 rounded-xl"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100/70 px-1.5 py-0.5 rounded">
                        {app.category}
                      </span>
                      <h3 className="font-bold text-sm text-gray-900 truncate mt-0.5 group-hover:text-purple-700 transition-colors">
                        {app.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                    {app.shortDescription}
                  </p>

                  {app.bonusText && (
                    <div className="text-[11px] font-semibold text-purple-900 bg-purple-100/80 px-2 py-1 rounded-lg mb-3 flex items-center gap-1.5 truncate">
                      <Gift className="w-3 h-3 text-purple-700 flex-shrink-0" />
                      <span className="truncate">{app.bonusText}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-purple-100 flex items-center justify-between text-xs">
                  <span className="text-purple-700 font-bold group-hover:underline flex items-center gap-1">
                    View Details <ArrowRight className="w-3 h-3" />
                  </span>
                  {app.officialUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        let url = app.officialUrl.trim();
                        if (!url.startsWith('http://') && !url.startsWith('https://')) {
                          url = `https://${url}`;
                        }
                        window.open(url, '_blank', 'noopener,noreferrer');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-purple-700 text-white font-bold text-[11px] hover:bg-purple-800 transition-colors"
                    >
                      Website
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Apps Listing */}
      <AppGrid key={initialTab} initialTab={initialTab} />

      {/* Homepage Telegram CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-purple-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-purple-500/20">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold backdrop-blur-xs">
              <Bell className="w-3.5 h-3.5 text-amber-300" />
              <span>Instant Offer Alerts</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Join Our Official Telegram Channel
            </h3>
            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
              Get notified immediately whenever new bonus apps, verified reward offers, or link updates are published by the admin.
            </p>
          </div>

          <a
            href="https://t.me/Job_wala_Akash"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-purple-900 bg-white hover:bg-purple-50 active:scale-95 transition-all shadow-md cursor-pointer whitespace-nowrap"
          >
            <Send className="w-4 h-4 text-purple-700" />
            <span>Join Telegram Channel</span>
          </a>
        </div>
      </section>

      {/* Responsible Policy Info Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-gradient-to-r from-purple-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-lg sm:text-xl">
                  Transparency & Safety Notice
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
                Yono Bonus Link publishes verified links and informational summaries directly as managed by the administrator. We do not operate games, process money transactions, or guarantee profits. Always verify promotional conditions on third-party official websites.
              </p>
            </div>
            <button
              onClick={() => navigate('/disclaimer')}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-purple-900 bg-white hover:bg-purple-50 transition-all cursor-pointer whitespace-nowrap"
            >
              Read Full Terms
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
