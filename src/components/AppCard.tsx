import React from 'react';
import { AppItem } from '../types';
import { useNavigation } from '../context/NavigationContext';
import { AppLogo } from './AppLogo';
import { Gift, ExternalLink, Flame, Star, ChevronRight } from 'lucide-react';

interface AppCardProps {
  app: AppItem;
}

export const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const { navigate } = useNavigation();

  const handleCardClick = () => {
    navigate(`/app/${app.slug}`);
  };

  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!app.officialUrl) return;
    
    // Ensure proper URL schema
    let url = app.officialUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-purple-100/90 hover:border-purple-300 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4 relative overflow-hidden"
    >
      {/* Accent corner bar for featured apps */}
      {app.isFeatured && (
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-purple-700 to-indigo-600 hidden sm:block" />
      )}

      {/* App Logo */}
      <AppLogo
        src={app.logoUrl}
        alt={app.name}
        size="md"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
      />

      {/* Middle Details Content */}
      <div className="flex-1 min-w-0 w-full space-y-1.5">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 text-purple-900">
            {app.category}
          </span>

          {app.isNew && (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
              <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
              NEW
            </span>
          )}

          {app.isFeatured && (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900">
              <Star className="w-3 h-3 text-indigo-600 fill-indigo-500" />
              FEATURED
            </span>
          )}

          {app.ageNotice && app.ageNotice.includes('18+') && (
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-sm bg-rose-100 text-rose-800 border border-rose-200">
              18+
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-purple-700 transition-colors truncate">
          {app.name}
        </h3>

        {/* Short description */}
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {app.shortDescription}
        </p>

        {/* Bonus offer badge if available */}
        {app.bonusText && (
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-950 bg-purple-50/90 border border-purple-200/80 px-2.5 py-1 rounded-lg">
            <Gift className="w-3.5 h-3.5 text-purple-700 flex-shrink-0" />
            <span className="truncate">{app.bonusText}</span>
          </div>
        )}
      </div>

      {/* Right action buttons */}
      <div className="flex-shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-2">
        <button
          onClick={handleExternalClick}
          className="flex-1 sm:flex-none w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-purple-700 hover:bg-purple-800 active:scale-95 transition-all shadow-xs hover:shadow-purple-700/25 cursor-pointer whitespace-nowrap"
          title={`Open official website for ${app.name}`}
        >
          <span>Visit Official Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className="sm:w-full inline-flex items-center justify-center gap-1 text-xs font-semibold text-gray-500 hover:text-purple-700 py-1 px-2 cursor-pointer transition-colors"
        >
          <span>Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
