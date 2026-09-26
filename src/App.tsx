import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';

// Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AppDetailsPage } from './pages/AppDetailsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { TelegramPage } from './pages/TelegramPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminAppsList } from './pages/admin/AdminAppsList';
import { AdminAppForm } from './pages/admin/AdminAppForm';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminSettings } from './pages/admin/AdminSettings';

const AppRouter: React.FC = () => {
  const { currentPath, selectedAppSlug, editingAppId } = useNavigation();
  const { isAdmin, loading: authLoading } = useAuth();
  const { settings } = useApp();

  // Dynamic document title update based on settings
  React.useEffect(() => {
    if (selectedAppSlug) {
      document.title = `${selectedAppSlug.replace(/-/g, ' ').toUpperCase()} | Yono Bonus Link`;
    } else if (currentPath.startsWith('/admin')) {
      document.title = 'Admin Console | Yono Bonus Link';
    } else {
      document.title = settings.siteName ? `${settings.siteName} - Latest Bonus & Earning Apps` : 'Yono Bonus Link';
    }
  }, [currentPath, selectedAppSlug, settings.siteName]);

  // Handle Admin Routes
  if (currentPath === '/admin/login') {
    return <AdminLoginPage />;
  }

  if (currentPath.startsWith('/admin')) {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-purple-700 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-gray-500">Checking credentials...</p>
          </div>
        </div>
      );
    }

    if (!isAdmin) {
      return <AdminLoginPage />;
    }

    if (currentPath === '/admin/apps/new') {
      return <AdminAppForm mode="create" />;
    }

    if (currentPath.startsWith('/admin/apps/edit/')) {
      return <AdminAppForm mode="edit" appId={editingAppId || undefined} />;
    }

    if (currentPath === '/admin/apps') {
      return <AdminAppsList />;
    }

    if (currentPath === '/admin/categories') {
      return <AdminCategories />;
    }

    if (currentPath === '/admin/settings') {
      return <AdminSettings />;
    }

    // Default to Admin Dashboard
    return <AdminDashboard />;
  }

  // Handle Public Pages
  let pageContent: React.ReactNode;

  if (selectedAppSlug) {
    pageContent = <AppDetailsPage />;
  } else if (currentPath === '/about') {
    pageContent = <AboutPage />;
  } else if (currentPath === '/contact') {
    pageContent = <ContactPage />;
  } else if (currentPath === '/disclaimer') {
    pageContent = <DisclaimerPage />;
  } else if (currentPath === '/telegram') {
    pageContent = <TelegramPage />;
  } else {
    pageContent = <HomePage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/60 text-gray-900 selection:bg-purple-600 selection:text-white">
      <Header />
      <main className="flex-1">{pageContent}</main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <NavigationProvider>
          <AppRouter />
        </NavigationProvider>
      </AppProvider>
    </AuthProvider>
  );
}
