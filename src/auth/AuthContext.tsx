import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '@/src/firebase';
import { isAuthorizedEmail } from './domain';

type AppUser = Pick<User, 'displayName' | 'email' | 'photoURL'>;
type AuthValue = { user: AppUser | null; isDemo: boolean; loading: boolean; authError: string | null; startDemoSession: () => void; signOutUser: () => Promise<void> };
const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [demoUser, setDemoUser] = useState<AppUser | null>(null);
  const user = demoUser ?? firebaseUser;
  const isDemo = demoUser !== null;
  const [loading, setLoading] = useState(auth !== null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const currentAuth = auth;
    if (!currentAuth) return;
    const startupTimer = setTimeout(() => {
      setAuthError('Firebase is taking longer than expected to restore your session. You can still try signing in.');
      setLoading(false);
    }, 8000);
    const unsubscribe = onAuthStateChanged(currentAuth, async (nextUser) => {
      clearTimeout(startupTimer);
      setAuthError(null);
      if (nextUser && !isAuthorizedEmail(nextUser.email)) {
        try { await signOut(currentAuth); } catch { /* Keep the unauthorized account out of the protected UI. */ }
        setFirebaseUser(null);
        setLoading(false);
        return;
      }
      setFirebaseUser(nextUser);
      setLoading(false);
    });
    return () => { clearTimeout(startupTimer); unsubscribe(); };
  }, []);

  const value = useMemo(() => ({
    user,
    isDemo,
    loading,
    authError,
    startDemoSession: () => {
      if (!__DEV__) return;
      setDemoUser({ displayName: 'Demo HBPlus Member', email: 'demo@hbplus.fit', photoURL: null });
    },
    signOutUser: async () => {
      if (demoUser) { setDemoUser(null); return; }
      if (auth) await signOut(auth);
    },
  }), [user, isDemo, loading, authError, demoUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
