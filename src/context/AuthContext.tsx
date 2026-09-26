import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

export const AUTHORIZED_ADMIN_EMAIL = 'akashramamando@gmail.com';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userEmail = (user.email || '').trim().toLowerCase();
        if (userEmail === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
          setCurrentUser(user);
          setAuthError(null);
        } else {
          // Deny access immediately and sign out any unauthorized Google account
          await firebaseSignOut(auth);
          setCurrentUser(null);
          setAuthError('You are not authorized to access the Admin Panel.');
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userEmail = (user.email || '').trim().toLowerCase();

      if (userEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
        await firebaseSignOut(auth);
        setCurrentUser(null);
        throw new Error('UNAUTHORIZED_ADMIN');
      }

      setCurrentUser(user);
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED_ADMIN') {
        const msg = 'You are not authorized to access the Admin Panel.';
        setAuthError(msg);
        throw new Error(msg);
      }
      throw err;
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setCurrentUser(null);
    setAuthError(null);
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  const isAdmin = !!currentUser && (currentUser.email || '').toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAdmin,
        loginWithGoogle,
        logout,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
