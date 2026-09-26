import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AppCard } from './AppCard';
import { Search, SlidersHorizontal, Flame, LayoutGrid, X } from 'lucide-react';

interface AppGridProps {
  initialTab?: 'all' | 'new';
}

export const AppGrid: React.FC<AppGridProps> = ({ initialTab = 'all' }) => {
  const { apps, categories, loading } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'new'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'az' | 'za'>('latest');

  // Filter public live apps only
  const liveApps = useMemo(() => {
    return apps.filter((a) => a.status === 'live');
  }, [apps]);

  // Tab counts
  const allCount = liveApps.length;
  const newCount = liveApps.filter((a) => a.isNew).length;

  // Filtered & Sorted Apps
  const filteredApps = useMemo(() => {
    let result = [...liveApps];

    // Tab filter
    if (activeTab === 'new') {
      result = result.filter((a) => a.isNew);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((a) => a.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.shortDescription.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          (a.bonusText && a.bonusText.toLowerCase().includes(q))
      );
    }

    // Sort order
    result.sort((a, b) => {
      if (sortBy === 'latest') {
        return (b.createdAt || 0) - (a.createdAt || 0);
      }
      if (sortBy === 'oldest') {
        return (a.createdAt || 0) - (b.createdAt || 0);
      }
      if (sortBy === 'az') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'za') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

    return result;
  }, [liveApps, activeTab, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="apps-listing" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Controls Container */}
      <div className="bg-white rounded-2xl border border-purple-100 p-4 sm:p-5 shadow-xs mb-6 space-y-4">
        {/* Top row: Tabs & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center bg-purple-50/80 p-1 rounded-xl border border-purple-100">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-gray-600 hover:text-purple-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All Apps ({allCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'new'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-gray-600 hover:text-purple-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>New Apps ({newCount})</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 hidden sm:inline">Sort:</span>
            <div className="relative flex-1 sm:flex-none">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto appearance-none bg-white border border-gray-200 rounded-xl px-3.5 py-2 pr-8 text-xs sm:text-sm font-semibold text-gray-700 hover:border-purple-300 focus:outline-hidden focus:ring-2 focus:ring-purple-600/20 cursor-pointer"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="az">A - Z</option>
                <option value="za">Z - A</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Second row: Search & Category Pills */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Instant Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-purple-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps by name, description, bonus..."
              className="w-full pl-10 pr-9 py-2.5 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 text-gray-800 focus:outline-hidden focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Dropdown or Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-purple-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              All Categories
            </button>
            {categories
              .filter((c) => c.slug !== 'all')
              .map((cat) => (
                <button
                  key={cat.id || cat.slug}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory.toLowerCase() === cat.name.toLowerCase()
                      ? 'bg-purple-700 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* App Listings */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse p-5"
            />
          ))}
        </div>
      ) : filteredApps.length > 0 ? (
        <div className="space-y-3.5">
          {filteredApps.map((app) => (
            <AppCard key={app.id || app.slug} app={app} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-dashed border-purple-200 p-8 sm:p-12 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            {activeTab === 'new'
              ? 'No new apps available right now.'
              : 'No apps available right now.'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mt-1">
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your search terms or clearing selected category filters.'
              : 'Check back soon for new offers and verified official listings.'}
          </p>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </section>
  );
};
