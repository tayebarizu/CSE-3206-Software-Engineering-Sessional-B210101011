import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type UserRole = 'admin' | 'customer' | 'user';

export const ADMIN_PASSKEY = 'LAGOS-ADMIN-2026';

export const ADMIN_EMAILS = [
  'tayebarizu@gmail.com',
  'admin@lagosprime.com',
  'executive@lagosprime.com',
  'manager@lagosprime.com',
];

export const checkIsAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();
  return ADMIN_EMAILS.some((adminEmail) => cleanEmail === adminEmail.toLowerCase());
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: 'admin' | 'customer';
  isAdmin: boolean;
  isCustomer: boolean;
  isAuthorizedAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    pass: string,
    name: string,
    requestedRole: 'customer' | 'admin',
    adminPasskey?: string
  ) => Promise<void>;
  signInAsAdmin: (name?: string, email?: string) => void;
  signInAsCustomer: (name?: string, email?: string) => void;
  signInAsDemoUser: (name?: string, email?: string) => void;
  signOutUser: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('local_dev_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [role, setRole] = useState<'admin' | 'customer'>('customer');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthorizedAdmin = !!(user?.email && checkIsAdminEmail(user.email)) || role === 'admin';
  const isAdmin = role === 'admin';
  const isCustomer = role === 'customer';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        localStorage.removeItem('local_dev_user');

        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userDocRef);

          let userRole: 'admin' | 'customer' = 'customer';

          if (snap.exists()) {
            const data = snap.data();
            if (data.role === 'admin') {
              userRole = 'admin';
            } else if (data.role === 'customer') {
              userRole = 'customer';
            } else if (checkIsAdminEmail(currentUser.email)) {
              userRole = 'admin';
            }
          } else {
            userRole = checkIsAdminEmail(currentUser.email) ? 'admin' : 'customer';
            await setDoc(
              userDocRef,
              {
                displayName: currentUser.displayName || 'Client',
                email: currentUser.email || '',
                photoURL: currentUser.photoURL || '',
                role: userRole,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          }

          setRole(userRole);
          localStorage.setItem(`user_role_${currentUser.uid}`, userRole);
        } catch {
          const fallbackRole = checkIsAdminEmail(currentUser.email) ? 'admin' : 'customer';
          setRole(fallbackRole);
        }
      } else {
        const stored = localStorage.getItem('local_dev_user');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            const savedRole = localStorage.getItem(`dev_user_role_${parsed.uid}`);
            setRole(savedRole === 'admin' ? 'admin' : 'customer');
          } catch {
            setUser(null);
            setRole('customer');
          }
        } else {
          setUser(null);
          setRole('customer');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign in failed';
      setError(msg);
      throw err;
    }
  };

  const signInAsAdmin = (name = 'Tayeba (Administrator)', email = 'tayebarizu@gmail.com') => {
    const dummyUser = {
      uid: 'admin-dev-001',
      displayName: name,
      email: email,
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      emailVerified: true,
      isAnonymous: false,
    } as unknown as User;

    setUser(dummyUser);
    setRole('admin');
    localStorage.setItem('local_dev_user', JSON.stringify(dummyUser));
    localStorage.setItem(`dev_user_role_${dummyUser.uid}`, 'admin');
    setError(null);
  };

  const signInAsDemoUser = (name = 'Tayeba (Administrator)', email = 'tayebarizu@gmail.com') => {
    signInAsAdmin(name, email);
  };

  const signInAsCustomer = (name = 'Adeola Adeleke (Client)', email = 'adeola.customer@gmail.com') => {
    const dummyUser = {
      uid: 'client-user-999',
      displayName: name,
      email: email,
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      emailVerified: true,
      isAnonymous: false,
    } as unknown as User;

    setUser(dummyUser);
    setRole('customer');
    localStorage.setItem('local_dev_user', JSON.stringify(dummyUser));
    localStorage.setItem(`dev_user_role_${dummyUser.uid}`, 'customer');
    setError(null);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      setError(null);
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        try {
          const snap = await getDoc(doc(db, 'users', cred.user.uid));
          if (snap.exists() && snap.data().role === 'admin') {
            setRole('admin');
          } else if (checkIsAdminEmail(cred.user.email)) {
            setRole('admin');
          } else {
            setRole('customer');
          }
        } catch {
          setRole(checkIsAdminEmail(cred.user.email) ? 'admin' : 'customer');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sign in with email';
      setError(msg);
      throw err;
    }
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    name: string,
    requestedRole: 'customer' | 'admin',
    adminPasskey?: string
  ) => {
    try {
      setError(null);

      if (requestedRole === 'admin') {
        const isPasskeyValid = adminPasskey?.trim() === ADMIN_PASSKEY;
        const isEmailWhitelisted = checkIsAdminEmail(email);

        if (!isPasskeyValid && !isEmailWhitelisted) {
          throw new Error(
            `ভুল অ্যাডমিন সিকিউরিটি কী (Admin Passkey)। অ্যাডমিন অ্যাকাউন্ট খোলার জন্য সঠিক কী দিন (ডিফল্ট: ${ADMIN_PASSKEY})।`
          );
        }
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const newUser = userCredential.user;

      if (newUser) {
        await updateProfile(newUser, { displayName: name });
        const finalRole = requestedRole === 'admin' ? 'admin' : 'customer';
        await setDoc(
          doc(db, 'users', newUser.uid),
          {
            displayName: name,
            email: email,
            role: finalRole,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        setRole(finalRole);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to register account';
      setError(msg);
      throw err;
    }
  };

  const signOutUser = async () => {
    try {
      setError(null);
      localStorage.removeItem('local_dev_user');
      setUser(null);
      setRole('customer');
      await signOut(auth);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sign out';
      setError(msg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        role,
        isAdmin,
        isCustomer,
        isAuthorizedAdmin,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInAsAdmin,
        signInAsCustomer,
        signInAsDemoUser,
        signOutUser,
        error,
        clearError: () => setError(null),
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