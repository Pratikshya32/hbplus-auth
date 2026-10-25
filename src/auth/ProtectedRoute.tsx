import { useEffect, type ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from './AuthContext';
import { colors } from '@/src/theme';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  useEffect(() => { if (!loading && !user) router.replace('/'); }, [loading, user]);
  if (loading || !user) return <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.green} /></View>;
  return children;
}
