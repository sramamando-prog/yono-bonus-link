import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AppItem, CategoryItem, SiteSettings, ContactMessage } from '../types';
import { INITIAL_APPS, INITIAL_CATEGORIES, INITIAL_SETTINGS } from '../lib/initialData';
import { extractLogoUrl } from '../lib/imageUtils';
import { useAuth } from './AuthContext';

interface AppContextType {
  apps: AppItem[];
  categories: CategoryItem[];
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
  // Stats
  stats: {
    totalApps: number;
    liveApps: number;
    draftApps: number;
    newApps: number;
    categoryCount: number;
  };
  // Actions
  addApp: (appData: Omit<AppItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateApp: (id: string, appData: Partial<AppItem>) => Promise<void>;
  deleteApp: (id: string) => Promise<void>;
  toggleAppStatus: (id: string, currentStatus: 'draft' | 'live') => Promise<void>;
  toggleNew: (id: string, currentVal: boolean) => Promise<void>;
  toggleFeatured: (id: string, currentVal: boolean) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt'>) => Promise<void>;
  seedInitialDataIfEmpty: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const [apps, setApps] = useState<AppItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to apps collection
  useEffect(() => {
    try {
      const appsRef = collection(db, 'apps');
      const appsQuery = query(appsRef, orderBy('displayOrder', 'asc'));

      const unsubscribe = onSnapshot(
        appsQuery,
        (snapshot) => {
          const loadedApps: AppItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const resolvedLogo = extractLogoUrl(data);
            loadedApps.push({
              id: docSnap.id,
              name: data.name || '',
              slug: data.slug || docSnap.id,
              logoUrl: resolvedLogo,
              imageUrl: resolvedLogo,
              shortDescription: data.shortDescription || '',
              fullDescription: data.fullDescription || '',
              category: data.category || 'General',
              appType: data.appType || 'Other',
              bonusText: data.bonusText || '',
              howItWorks: data.howItWorks || '',
              officialUrl: data.officialUrl || '',
              telegramUrl: data.telegramUrl || '',
              status: data.status || 'live',
              isNew: !!data.isNew,
              isFeatured: !!data.isFeatured,
              ageNotice: data.ageNotice || '',
              legalNotice: data.legalNotice || '',
              displayOrder: Number(data.displayOrder) || 1,
              createdAt: data.createdAt || Date.now(),
              updatedAt: data.updatedAt || Date.now(),
            });
          });

          // If database is empty, fallback to INITIAL_APPS for preview
          if (loadedApps.length === 0 && !isAdmin) {
            setApps(INITIAL_APPS.map((a, i) => ({ ...a, id: `seed-${i}` })));
          } else {
            setApps(loadedApps);
          }
          setLoading(false);
        },
        (err) => {
          console.warn('Firestore apps onSnapshot warning (will fallback to default dataset):', err);
          // Public fallback
          setApps(INITIAL_APPS.map((a, i) => ({ ...a, id: `seed-${i}` })));
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (e: any) {
      console.error('Error attaching apps listener:', e);
      setApps(INITIAL_APPS.map((a, i) => ({ ...a, id: `seed-${i}` })));
      setLoading(false);
    }
  }, [isAdmin]);

  // Subscribe to categories
  useEffect(() => {
    try {
      const catRef = collection(db, 'categories');
      const unsubscribe = onSnapshot(
        catRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const loadedCats: CategoryItem[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              loadedCats.push({
                id: docSnap.id,
                name: data.name || '',
                slug: data.slug || docSnap.id,
                createdAt: data.createdAt || Date.now(),
              });
            });
            setCategories(loadedCats);
          } else {
            setCategories(INITIAL_CATEGORIES);
          }
        },
        (err) => {
          console.warn('Firestore categories onSnapshot warning:', err);
          setCategories(INITIAL_CATEGORIES);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.error('Error listening to categories:', err);
      setCategories(INITIAL_CATEGORIES);
    }
  }, []);

  // Subscribe to settings
  useEffect(() => {
    try {
      const settingsDocRef = doc(db, 'settings', 'general');
      const unsubscribe = onSnapshot(
        settingsDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const currentTelegram = (data.telegramUrl && data.telegramUrl !== 'https://t.me/yonobonuslink_official')
              ? data.telegramUrl
              : 'https://t.me/Job_wala_Akash';
            setSettings({
              ...INITIAL_SETTINGS,
              ...data,
              telegramUrl: currentTelegram,
              id: docSnap.id,
            });
          } else {
            setSettings(INITIAL_SETTINGS);
          }
        },
        (err) => {
          console.warn('Firestore settings onSnapshot warning:', err);
          setSettings(INITIAL_SETTINGS);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.error('Error listening to settings:', err);
      setSettings(INITIAL_SETTINGS);
    }
  }, []);

  // Auto seed helper if admin is logged in and DB has 0 apps
  const seedInitialDataIfEmpty = async () => {
    try {
      // 1. Settings
      await setDoc(doc(db, 'settings', 'general'), INITIAL_SETTINGS);

      // 2. Categories
      for (const cat of INITIAL_CATEGORIES) {
        await addDoc(collection(db, 'categories'), {
          name: cat.name,
          slug: cat.slug,
          createdAt: Date.now(),
        });
      }

      // 3. Apps
      for (const appItem of INITIAL_APPS) {
        await addDoc(collection(db, 'apps'), {
          ...appItem,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    } catch (err) {
      console.error('Failed to seed initial data:', err);
    }
  };

  // CRUD actions for Apps
  const addApp = async (appData: Omit<AppItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = Date.now();
    const cleanLogo = (appData.logoUrl || appData.imageUrl || '').trim();
    const docRef = await addDoc(collection(db, 'apps'), {
      ...appData,
      logoUrl: cleanLogo,
      imageUrl: cleanLogo,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    return docRef.id;
  };

  const updateApp = async (id: string, appData: Partial<AppItem>) => {
    const docRef = doc(db, 'apps', id);
    const payload: Record<string, any> = {
      ...appData,
      updatedAt: Date.now(),
    };
    if (appData.logoUrl !== undefined || appData.imageUrl !== undefined) {
      const cleanLogo = (appData.logoUrl || appData.imageUrl || '').trim();
      payload.logoUrl = cleanLogo;
      payload.imageUrl = cleanLogo;
    }
    await updateDoc(docRef, payload);
  };

  const deleteApp = async (id: string) => {
    const docRef = doc(db, 'apps', id);
    await deleteDoc(docRef);
  };

  const toggleAppStatus = async (id: string, currentStatus: 'draft' | 'live') => {
    const nextStatus = currentStatus === 'live' ? 'draft' : 'live';
    await updateApp(id, { status: nextStatus });
  };

  const toggleNew = async (id: string, currentVal: boolean) => {
    await updateApp(id, { isNew: !currentVal });
  };

  const toggleFeatured = async (id: string, currentVal: boolean) => {
    await updateApp(id, { isFeatured: !currentVal });
  };

  const addCategory = async (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await addDoc(collection(db, 'categories'), {
      name,
      slug,
      createdAt: Date.now(),
    });
  };

  const deleteCategory = async (id: string) => {
    await deleteDoc(doc(db, 'categories', id));
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const settingsDocRef = doc(db, 'settings', 'general');
    await setDoc(settingsDocRef, { ...settings, ...newSettings, updatedAt: Date.now() }, { merge: true });
  };

  const submitContactMessage = async (msg: Omit<ContactMessage, 'id' | 'createdAt'>) => {
    await addDoc(collection(db, 'messages'), {
      ...msg,
      createdAt: Date.now(),
      read: false,
    });
  };

  // Stats calculation
  const liveAppsCount = apps.filter((a) => a.status === 'live').length;
  const draftAppsCount = apps.filter((a) => a.status === 'draft').length;
  const newAppsCount = apps.filter((a) => a.status === 'live' && a.isNew).length;
  const categoryCount = categories.filter((c) => c.slug !== 'all').length;

  const stats = {
    totalApps: apps.length,
    liveApps: liveAppsCount,
    draftApps: draftAppsCount,
    newApps: newAppsCount,
    categoryCount: categoryCount,
  };

  return (
    <AppContext.Provider
      value={{
        apps,
        categories,
        settings,
        loading,
        error,
        stats,
        addApp,
        updateApp,
        deleteApp,
        toggleAppStatus,
        toggleNew,
        toggleFeatured,
        addCategory,
        deleteCategory,
        updateSettings,
        submitContactMessage,
        seedInitialDataIfEmpty,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
