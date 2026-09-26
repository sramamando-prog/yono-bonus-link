import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { 
  LayoutDashboard, 
  Smartphone, 
  PlusCircle, 
  FolderTree, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'apps' | 'new-app' | 'categories' | 'settings';
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab }) => {
  const { logout, currentUser } = useAuth();
  const { navigate } = useNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { id: 'apps', label: 'All Apps', path: '/admin/apps', icon: Smartphone },
    { id: 'new-app', label: 'Add New App', path: '/admin/apps/new', icon: PlusCircle },
    { id: 'categories', label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { id: 'settings', label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-purple-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-700 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <span className="font-extrabold text-base text-gray-900">
            Admin <span className="text-purple-700">Console</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 text-gray-500 hover:text-purple-700 text-xs font-semibold flex items-center gap-1"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-700 hover:bg-purple-50 rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar for Desktop & Mobile drawer */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block md:w-64 bg-white border-r border-purple-100/90 flex-shrink-0 flex flex-col justify-between p-4 sticky top-0 md:h-screen z-20`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="hidden md:flex items-center justify-between px-2 py-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-purple-700 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <span className="font-black text-lg text-gray-900">
                Yono <span className="text-purple-700">Admin</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-700 text-white shadow-sm shadow-purple-700/20'
                      : 'text-gray-600 hover:text-purple-800 hover:bg-purple-50'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-purple-700 hover:bg-gray-50 cursor-pointer"
          >
            <span>Open Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-2xl flex items-center gap-2.5">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Admin avatar"
                className="w-8 h-8 rounded-full border border-purple-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-extrabold text-purple-900 uppercase">
                  Verified Admin
                </span>
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
              </div>
              <p className="text-xs font-semibold text-gray-800 truncate" title={currentUser?.email || ''}>
                {currentUser?.email || 'akashramamando@gmail.com'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};
