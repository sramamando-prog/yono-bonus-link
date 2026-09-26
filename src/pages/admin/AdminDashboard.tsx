import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigation } from '../../context/NavigationContext';
import { AdminLayout } from './AdminLayout';
import { 
  Smartphone, 
  CheckCircle2, 
  FileEdit, 
  Sparkles, 
  FolderTree, 
  PlusCircle, 
  ArrowUpRight, 
  Flame, 
  Eye, 
  EyeOff,
  Database
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { apps, stats, toggleAppStatus, seedInitialDataIfEmpty } = useApp();
  const { navigate } = useNavigation();
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      await seedInitialDataIfEmpty();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  const recentApps = [...apps].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 5);

  const statCards = [
    { label: 'Total Apps', value: stats.totalApps, icon: Smartphone, color: 'text-purple-700 bg-purple-100' },
    { label: 'Live Apps', value: stats.liveApps, icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-100' },
    { label: 'Draft Apps', value: stats.draftApps, icon: FileEdit, color: 'text-amber-700 bg-amber-100' },
    { label: 'New Apps', value: stats.newApps, icon: Flame, color: 'text-rose-700 bg-rose-100' },
    { label: 'Categories', value: stats.categoryCount, icon: FolderTree, color: 'text-indigo-700 bg-indigo-100' },
  ];

  return (
    <AdminLayout activeTab="dashboard">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Admin Overview
            </h1>
            <p className="text-xs sm:text-sm text-purple-200">
              Manage your verified application directory, publish new links, and configure categories.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate('/admin/apps/new')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-purple-900 font-bold text-xs sm:text-sm hover:bg-purple-50 transition-all shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-purple-700" />
              <span>Add New App</span>
            </button>
            {apps.length === 0 && (
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-600 transition-all border border-purple-500 cursor-pointer"
              >
                <Database className="w-4 h-4" />
                <span>{seeding ? 'Syncing...' : 'Seed Sample Apps'}</span>
              </button>
            )}
          </div>
        </div>

        {seedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Sample categories and apps have been seeded to Firestore successfully!</span>
          </div>
        )}

        {/* Dynamic Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-purple-100/90 p-4 shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    {stat.label}
                  </span>
                  <div className={`p-2 rounded-xl ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Apps Table / Cards */}
        <div className="bg-white rounded-3xl border border-purple-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                Recent Applications
              </h2>
              <p className="text-xs text-gray-500">
                Latest updated apps in your catalog
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/apps')}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({apps.length})</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {recentApps.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentApps.map((app) => (
                <div
                  key={app.id || app.slug}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-purple-50/30 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {app.logoUrl ? (
                        <img
                          src={app.logoUrl}
                          alt={app.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-black text-purple-700 text-lg">
                          {app.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-gray-900">
                          {app.name}
                        </h4>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            app.status === 'live'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {app.category} • {app.bonusText || app.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {/* Fast Status Toggle */}
                    <button
                      onClick={() => app.id && toggleAppStatus(app.id, app.status)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        app.status === 'live'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={app.status === 'live' ? 'Click to Unpublish to Draft' : 'Click to Publish Live'}
                    >
                      {app.status === 'live' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{app.status === 'live' ? 'Live' : 'Draft'}</span>
                    </button>

                    {/* Edit button */}
                    <button
                      onClick={() => navigate(`/admin/apps/edit/${app.id}`)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-gray-500">
              No apps created yet. Click "Add New App" above to publish your first entry.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
