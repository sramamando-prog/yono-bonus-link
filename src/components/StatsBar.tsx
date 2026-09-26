import React from 'react';
import { useApp } from '../context/AppContext';
import { Smartphone, Sparkles, FolderTree } from 'lucide-react';

export const StatsBar: React.FC = () => {
  const { stats, loading } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="bg-white rounded-2xl border border-purple-100 p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-3 divide-x divide-purple-100 text-center">
          {/* Published Apps */}
          <div className="px-2 sm:px-4">
            <div className="flex items-center justify-center gap-1.5 text-purple-700 mb-1">
              <Smartphone className="w-4 h-4 hidden sm:block" />
              <span className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {loading ? '...' : stats.liveApps}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Published Apps
            </p>
          </div>

          {/* New Apps */}
          <div className="px-2 sm:px-4">
            <div className="flex items-center justify-center gap-1.5 text-purple-700 mb-1">
              <Sparkles className="w-4 h-4 hidden sm:block" />
              <span className="text-xl sm:text-3xl font-black text-purple-700 tracking-tight">
                {loading ? '...' : stats.newApps}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
              New Apps
            </p>
          </div>

          {/* Categories */}
          <div className="px-2 sm:px-4">
            <div className="flex items-center justify-center gap-1.5 text-purple-700 mb-1">
              <FolderTree className="w-4 h-4 hidden sm:block" />
              <span className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {loading ? '...' : stats.categoryCount}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Categories
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
