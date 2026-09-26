import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigation } from '../../context/NavigationContext';
import { AdminLayout } from './AdminLayout';
import { AppLogo } from '../../components/AppLogo';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Flame, 
  Star, 
  ExternalLink, 
  AlertTriangle,
  X,
  Filter
} from 'lucide-react';
import { AppItem } from '../../types';

export const AdminAppsList: React.FC = () => {
  const { apps, toggleAppStatus, toggleNew, toggleFeatured, deleteApp } = useApp();
  const { navigate } = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'draft'>('all');
  const [deleteTarget, setDeleteTarget] = useState<AppItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered apps
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [apps, searchQuery, statusFilter]);

  const confirmDelete = async () => {
    if (!deleteTarget || !deleteTarget.id) return;
    try {
      setIsDeleting(true);
      await deleteApp(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete app:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout activeTab="apps">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Manage Applications ({apps.length})
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Publish, update, review draft statuses, and manage official links.
            </p>
          </div>

          <button
            onClick={() => navigate('/admin/apps/new')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm shadow-sm shadow-purple-700/25 active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New App</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-purple-100 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps by name or category..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-gray-700 focus:outline-hidden"
            >
              <option value="all">All Statuses ({apps.length})</option>
              <option value="live">Live Only ({apps.filter((a) => a.status === 'live').length})</option>
              <option value="draft">Draft Only ({apps.filter((a) => a.status === 'draft').length})</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-3xl border border-purple-100 shadow-xs overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-purple-50/60 border-b border-purple-100 text-xs font-bold text-purple-900 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">App</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">New</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-4">Official URL</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <tr key={app.id || app.slug} className="hover:bg-purple-50/30 transition-colors">
                    {/* App Column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <AppLogo
                          src={app.logoUrl}
                          alt={app.name}
                          size="sm"
                          containerClassName="w-10 h-10 rounded-xl"
                          className="w-full h-full object-cover"
                        />
                        <div>
                          <div className="font-bold text-gray-900">{app.name}</div>
                          <div className="text-xs text-gray-400 line-clamp-1">{app.shortDescription}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">
                        {app.category}
                      </span>
                    </td>

                    {/* Status Column */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => app.id && toggleAppStatus(app.id, app.status)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                          app.status === 'live'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                        title="Click to toggle Live/Draft"
                      >
                        {app.status === 'live' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span className="capitalize">{app.status}</span>
                      </button>
                    </td>

                    {/* New Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => app.id && toggleNew(app.id, app.isNew)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          app.isNew ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        title="Toggle New badge"
                      >
                        <Flame className={`w-4 h-4 ${app.isNew ? 'fill-amber-500' : ''}`} />
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => app.id && toggleFeatured(app.id, app.isFeatured)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          app.isFeatured ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        title="Toggle Featured badge"
                      >
                        <Star className={`w-4 h-4 ${app.isFeatured ? 'fill-indigo-500' : ''}`} />
                      </button>
                    </td>

                    {/* URL */}
                    <td className="py-3.5 px-4">
                      {app.officialUrl ? (
                        <a
                          href={app.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-purple-700 hover:underline max-w-[150px] truncate"
                        >
                          <span className="truncate">{app.officialUrl}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/admin/apps/edit/${app.id}`)}
                          className="p-1.5 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit App"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(app)}
                          className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                          title="Delete App"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 text-sm">
                    No applications match the current filter or search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile / Tablet Cards View */}
        <div className="lg:hidden space-y-3.5">
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <div
                key={app.id || app.slug}
                className="bg-white rounded-2xl border border-purple-100 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <AppLogo
                      src={app.logoUrl}
                      alt={app.name}
                      size="custom"
                      containerClassName="w-12 h-12 rounded-xl"
                      className="w-full h-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{app.name}</h4>
                      <span className="text-[11px] font-semibold text-gray-500">{app.category}</span>
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <button
                    onClick={() => app.id && toggleAppStatus(app.id, app.status)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      app.status === 'live' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {app.status === 'live' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span className="capitalize">{app.status}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => app.id && toggleNew(app.id, app.isNew)}
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-bold ${
                      app.isNew ? 'bg-amber-100 text-amber-900' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Flame className="w-3 h-3" />
                    <span>New: {app.isNew ? 'Yes' : 'No'}</span>
                  </button>

                  <button
                    onClick={() => app.id && toggleFeatured(app.id, app.isFeatured)}
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-bold ${
                      app.isFeatured ? 'bg-indigo-100 text-indigo-900' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Star className="w-3 h-3" />
                    <span>Featured: {app.isFeatured ? 'Yes' : 'No'}</span>
                  </button>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href={app.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-700 font-semibold inline-flex items-center gap-1 truncate max-w-[180px]"
                  >
                    <span>Visit Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/admin/apps/edit/${app.id}`)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(app)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-6 text-center text-sm text-gray-500">
              No applications match your filter.
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal (Section 14 requirement) */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-gray-900">
                  Delete Application
                </h3>
                <p className="text-xs text-gray-500">
                  Are you sure you want to delete <span className="font-bold text-gray-800">"{deleteTarget.name}"</span>? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  {isDeleting ? 'Deleting...' : 'Delete App'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
