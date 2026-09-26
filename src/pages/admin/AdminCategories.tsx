import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { FolderTree, Plus, Trash2, Tag, Check, AlertCircle } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categories, apps, addCategory, deleteCategory } = useApp();
  const [newCatName, setNewCatName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      setSaving(true);
      await addCategory(newCatName.trim());
      setNewCatName('');
      setMessage('Category added successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error(err);
      setMessage('Failed to add category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      try {
        await deleteCategory(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <AdminLayout activeTab="categories">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Manage Categories
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Categorize reward, gaming, and bonus applications for seamless visitor navigation.
          </p>
        </div>

        {message && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        {/* Add Category Form */}
        <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-xs">
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Tag className="w-4 h-4 text-purple-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="New Category Name (e.g., Casual Tournaments, Crypto Rewards)..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{saving ? 'Adding...' : 'Add Category'}</span>
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-3xl border border-purple-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">
              Existing Categories ({categories.filter((c) => c.slug !== 'all').length})
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {categories
              .filter((c) => c.slug !== 'all')
              .map((cat) => {
                const count = apps.filter(
                  (a) => a.category.toLowerCase() === cat.name.toLowerCase()
                ).length;

                return (
                  <div
                    key={cat.id || cat.slug}
                    className="p-4 sm:p-5 flex items-center justify-between hover:bg-purple-50/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm">
                        <FolderTree className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">{cat.name}</h4>
                        <span className="text-xs text-gray-400">
                          slug: {cat.slug} • {count} {count === 1 ? 'app' : 'apps'}
                        </span>
                      </div>
                    </div>

                    {cat.id && (
                      <button
                        onClick={() => handleDelete(cat.id!, cat.name)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
