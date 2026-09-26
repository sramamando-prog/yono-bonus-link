import React, { createContext, useContext, useState, useEffect } from 'react';

export type RoutePath =
  | '/'
  | '/about'
  | '/contact'
  | '/disclaimer'
  | '/telegram'
  | '/admin'
  | '/admin/login'
  | '/admin/apps'
  | '/admin/apps/new'
  | '/admin/categories'
  | '/admin/settings'
  | string;

interface NavigationContextType {
  currentPath: string;
  navigate: (path: string) => void;
  selectedAppSlug: string | null;
  editingAppId: string | null;
  setEditingAppId: (id: string | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialPath = () => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path.startsWith('/admin/apps/edit/')) {
      const id = path.replace('/admin/apps/edit/', '');
      setEditingAppId(id);
    } else {
      setEditingAppId(null);
    }

    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine if viewing an app detail page
  let selectedAppSlug: string | null = null;
  if (currentPath.startsWith('/app/')) {
    selectedAppSlug = currentPath.replace('/app/', '');
  }

  return (
    <NavigationContext.Provider
      value={{
        currentPath,
        navigate,
        selectedAppSlug,
        editingAppId,
        setEditingAppId,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
