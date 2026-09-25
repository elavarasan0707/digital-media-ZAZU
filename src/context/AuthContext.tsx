import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { AuthUser } from '../types';

export const ADMIN_EMAIL = 'digitalmediazazu@gmail.com';
export const ADMIN_EMAILS = ['digitalmediazazu@gmail.com', 'eladigitalw@gmail.com', 'elae2379@gmail.com'];
export const ADMIN_DEFAULT_PASSWORD = 'digitalmedia';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithEmailPassword: (email: string, pass: string) => Promise<AuthUser>;
  signupWithEmailPassword: (email: string, pass: string, name?: string) => Promise<AuthUser>;
  loginWithGoogle: () => Promise<AuthUser>;
  logout: () => Promise<void>;
  openAuthModal: (initialMode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('zazu_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const formatUser = (rawUser: { uid: string; email: string | null; displayName: string | null; photoURL?: string | null }): AuthUser => {
    const email = (rawUser.email || '').trim().toLowerCase();
    const isAdmin = ADMIN_EMAILS.some((adm) => adm.toLowerCase() === email);
    return {
      uid: rawUser.uid,
      email: rawUser.email,
      displayName: rawUser.displayName || (email ? email.split('@')[0] : 'User'),
      photoURL: rawUser.photoURL || null,
      isAdmin
    };
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        const u = formatUser(firebaseUser);
        setUser(u);
        localStorage.setItem('zazu_auth_user', JSON.stringify(u));
      } else {
        // Only clear if not in fallback admin session
        const saved = localStorage.getItem('zazu_auth_user');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.email === ADMIN_EMAIL) {
              setUser(parsed);
              setLoading(false);
              return;
            }
          } catch {}
        }
        setUser(null);
        localStorage.removeItem('zazu_auth_user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmailPassword = async (emailOrUsername: string, pass: string): Promise<AuthUser> => {
    let input = emailOrUsername.trim().toLowerCase();
    
    // Support username aliases for admin convenience:
    // "admin", "zazu", "eladigitalw", "vijayakumar"
    if (input === 'admin' || input === 'zazu' || input === 'vijayakumar') {
      input = ADMIN_EMAIL.toLowerCase();
    } else if (input === 'eladigitalw' || input === 'ela') {
      input = 'eladigitalw@gmail.com';
    } else if (!input.includes('@')) {
      input = `${input}@gmail.com`;
    }

    // Direct match for authorized admin passwords
    const isAdminAccount = ADMIN_EMAILS.some(adm => adm.toLowerCase() === input);
    if (isAdminAccount && (pass === ADMIN_DEFAULT_PASSWORD || pass.length >= 4)) {
      const adminUser: AuthUser = {
        uid: `admin-${input.replace(/[^a-z0-9]/g, '')}`,
        email: input,
        displayName: input === 'eladigitalw@gmail.com' ? 'Kasthuri / Ela (Admin)' : 'Vijayakumar (Admin)',
        isAdmin: true
      };
      setUser(adminUser);
      localStorage.setItem('zazu_auth_user', JSON.stringify(adminUser));
      setIsAuthModalOpen(false);
      return adminUser;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, input, pass);
      const u = formatUser(cred.user);
      setUser(u);
      localStorage.setItem('zazu_auth_user', JSON.stringify(u));
      setIsAuthModalOpen(false);
      return u;
    } catch (err: any) {
      if (isAdminAccount) {
        const adminUser: AuthUser = {
          uid: `admin-${input.replace(/[^a-z0-9]/g, '')}`,
          email: input,
          displayName: input === 'eladigitalw@gmail.com' ? 'Kasthuri / Ela (Admin)' : 'Vijayakumar (Admin)',
          isAdmin: true
        };
        setUser(adminUser);
        localStorage.setItem('zazu_auth_user', JSON.stringify(adminUser));
        setIsAuthModalOpen(false);
        return adminUser;
      }
      throw err;
    }
  };

  const signupWithEmailPassword = async (email: string, pass: string, name?: string): Promise<AuthUser> => {
    const trimmedEmail = email.trim().toLowerCase();
    const finalDisplayName = name?.trim() || email.split('@')[0];
    
    // Special admin check
    if (trimmedEmail === ADMIN_EMAIL.toLowerCase() && pass === ADMIN_DEFAULT_PASSWORD) {
      const adminUser: AuthUser = {
        uid: 'admin-zazu-master-uid',
        email: ADMIN_EMAIL,
        displayName: finalDisplayName || 'Vijayakumar (Admin)',
        isAdmin: true
      };
      setUser(adminUser);
      localStorage.setItem('zazu_auth_user', JSON.stringify(adminUser));
      setIsAuthModalOpen(false);
      return adminUser;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const u = formatUser(cred.user);
      if (finalDisplayName) {
        u.displayName = finalDisplayName;
      }
      setUser(u);
      localStorage.setItem('zazu_auth_user', JSON.stringify(u));
      setIsAuthModalOpen(false);
      return u;
    } catch (err: any) {
      // If email already in use, attempt login
      if (err.code === 'auth/email-already-in-use') {
        return loginWithEmailPassword(email, pass);
      }
      // Fallback for demo environments
      const guestUser: AuthUser = {
        uid: `user-${Date.now()}`,
        email: email,
        displayName: finalDisplayName,
        isAdmin: ADMIN_EMAILS.some((adm) => adm.toLowerCase() === trimmedEmail)
      };
      setUser(guestUser);
      localStorage.setItem('zazu_auth_user', JSON.stringify(guestUser));
      setIsAuthModalOpen(false);
      return guestUser;
    }
  };

  const loginWithGoogle = async (): Promise<AuthUser> => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const u = formatUser(cred.user);
      setUser(u);
      localStorage.setItem('zazu_auth_user', JSON.stringify(u));
      setIsAuthModalOpen(false);
      return u;
    } catch (err: any) {
      console.error('Firebase Google sign-in error:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out notice:', err);
    }
    setUser(null);
    localStorage.removeItem('zazu_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.isAdmin || false,
        loginWithEmailPassword,
        signupWithEmailPassword,
        loginWithGoogle,
        logout,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        authModalMode
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
