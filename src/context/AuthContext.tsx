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
export const ADMIN_EMAILS = ['digitalmediazazu@gmail.com', 'eladigitalw@gmail.com', 'elae2379@gmail.com', 'admin@zazudigitalmedia.com'];
export const ADMIN_DEFAULT_PASSWORD = 'admin123';
export const ADMIN_VALID_PASSWORDS = ['admin123', 'digitalmedia'];

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
            const isSavedAdmin = ADMIN_EMAILS.some(
              (adm) => adm.toLowerCase() === (parsed?.email || '').trim().toLowerCase()
            );
            if (isSavedAdmin) {
              setUser({ ...parsed, isAdmin: true });
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
    const rawInput = emailOrUsername.trim().toLowerCase();
    const trimmedPass = pass.trim();
    let input = rawInput;
    
    // Support username aliases for admin:
    // "admin", "zazu", "eladigitalw", "vijayakumar"
    if (rawInput === 'admin' || rawInput === 'zazu' || rawInput === 'vijayakumar') {
      input = ADMIN_EMAIL.toLowerCase();
    } else if (rawInput === 'eladigitalw' || rawInput === 'ela') {
      input = 'eladigitalw@gmail.com';
    } else if (!rawInput.includes('@')) {
      input = `${rawInput}@gmail.com`;
    }

    // Direct match for authorized admin credentials (e.g., admin / admin123)
    const isAdminAccount = rawInput === 'admin' || ADMIN_EMAILS.some(adm => adm.toLowerCase() === input);
    const isValidAdminPass = ADMIN_VALID_PASSWORDS.includes(trimmedPass);

    if (isAdminAccount && isValidAdminPass) {
      const adminUser: AuthUser = {
        uid: `admin-${input.replace(/[^a-z0-9]/g, '')}`,
        email: input,
        displayName: input === 'eladigitalw@gmail.com' ? 'Kasthuri / Ela (Admin)' : 'Vijayakumar (Admin)',
        isAdmin: true
      };
      setUser(adminUser);
      localStorage.setItem('zazu_auth_user', JSON.stringify(adminUser));
      setIsAuthModalOpen(false);
      // Dispatch custom event so App.tsx immediately opens the Admin Dashboard
      window.dispatchEvent(new CustomEvent('zazu-admin-logged-in'));
      return adminUser;
    }

    if (rawInput === 'admin' && !isValidAdminPass) {
      throw new Error('Invalid administrator password.');
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, input, trimmedPass);
      const u = formatUser(cred.user);
      setUser(u);
      localStorage.setItem('zazu_auth_user', JSON.stringify(u));
      setIsAuthModalOpen(false);
      if (u.isAdmin) {
        window.dispatchEvent(new CustomEvent('zazu-admin-logged-in'));
      }
      return u;
    } catch (err: any) {
      if (isAdminAccount && !isValidAdminPass) {
        throw new Error('Invalid administrator password.');
      }
      throw new Error('Invalid username/email or password. Please verify your credentials.');
    }
  };

  const signupWithEmailPassword = async (email: string, pass: string, name?: string): Promise<AuthUser> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = pass.trim();
    const finalDisplayName = name?.trim() || email.split('@')[0];
    
    // Special admin check
    const isAdminAccount = trimmedEmail === 'admin' || ADMIN_EMAILS.some(adm => adm.toLowerCase() === trimmedEmail);
    if (isAdminAccount && ADMIN_VALID_PASSWORDS.includes(trimmedPass)) {
      const resolvedEmail = trimmedEmail.includes('@') ? trimmedEmail : ADMIN_EMAIL;
      const adminUser: AuthUser = {
        uid: `admin-${resolvedEmail.replace(/[^a-z0-9]/g, '')}`,
        email: resolvedEmail,
        displayName: finalDisplayName || 'Vijayakumar (Admin)',
        isAdmin: true
      };
      setUser(adminUser);
      localStorage.setItem('zazu_auth_user', JSON.stringify(adminUser));
      setIsAuthModalOpen(false);
      window.dispatchEvent(new CustomEvent('zazu-admin-logged-in'));
      return adminUser;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, trimmedPass);
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
        return loginWithEmailPassword(email, trimmedPass);
      }
      throw new Error(err.message || 'Unable to register account. Please check your details.');
    }
  };

  const loginWithGoogle = async (): Promise<AuthUser> => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const u = formatUser(cred.user);
      setUser(u);
      localStorage.setItem('zazu_auth_user', JSON.stringify(u));
      setIsAuthModalOpen(false);
      if (u.isAdmin) {
        window.dispatchEvent(new CustomEvent('zazu-admin-logged-in'));
      }
      return u;
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        console.warn('Firebase Google sign-in notice:', err);
      }
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
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
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
