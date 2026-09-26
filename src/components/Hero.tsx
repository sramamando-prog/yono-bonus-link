import React from 'react';
import { Sparkles, ArrowRight, Flame, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeroProps {
  onExploreClick: () => void;
  onNewAppsClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onNewAppsClick }) => {
  const { settings } = useApp();

  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 bg-gradient-to-b from-purple-50/70 via-white to-transparent">
      {/* Decorative backdrop glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-radial from-purple-200/40 via-purple-100/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Safe pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 border border-purple-200/80 text-purple-900 text-xs font-semibold mb-5 shadow-xs animate-in fade-in zoom-in-95 duration-200">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
          <span>Curated Official Links & Verified Offers</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
          {settings.heroHeading || 'Latest Bonus & Earning Apps'}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {settings.heroSubtitle || 'Explore the latest apps, offers and official links in one place.'}
        </p>

        {/* Action Buttons */}
        <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-purple-700 hover:bg-purple-800 shadow-md shadow-purple-700/25 hover:shadow-purple-700/40 active:scale-98 transition-all cursor-pointer"
          >
            <span>Explore Apps</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onNewAppsClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-purple-900 bg-white hover:bg-purple-50/80 border border-purple-200 shadow-xs active:scale-98 transition-all cursor-pointer"
          >
            <Flame className="w-4 h-4 text-purple-700" />
            <span>New Apps</span>
          </button>
        </div>
      </div>
    </section>
  );
};
