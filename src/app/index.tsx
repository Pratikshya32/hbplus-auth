import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/src/auth/AuthContext';
import { GoogleSignInButton } from '@/src/auth/GoogleSignInButton';
import { colors, web } from '@/src/theme';

function Brand({ small = false }: { small?: boolean }) {
  return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
    <View style={{ width: small ? 36 : 42, height: small ? 36 : 42, borderRadius: 12, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: colors.bg, fontSize: small ? 17 : 20, fontWeight: '800' }}>H</Text></View>
    <Text style={[{ color: colors.text, fontSize: small ? 18 : 22, fontWeight: '700', letterSpacing: -0.5 }, web]}>HB<Text style={{ color: colors.green }}>Plus</Text></Text>
  </View>;
}

function Word({ children, style }: { children: ReactNode; style?: object }) {
  return <Text style={[{ color: colors.text }, web, style]}>{children}</Text>;
}

export default function LoginScreen() {
  const { user, loading, authError, startDemoSession } = useAuth();
  const { width } = useWindowDimensions();
  const [error, setError] = useState('');
  const wide = width >= 860;
  useEffect(() => { if (!loading && user) router.replace('/dashboard'); }, [loading, user]);

  if (loading || user) return <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.green} /></View>;

  return <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}><ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.bg }}>
    <View style={[{ width: '100%', maxWidth: 1100, alignSelf: 'center', flex: 1, paddingHorizontal: wide ? 48 : 24, paddingVertical: 28 }, Platform.OS === 'web' ? ({ minHeight: '100vh' } as object) : {}]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Brand /><View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 99, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12, paddingVertical: 8 }}><View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green }} /><Word style={{ color: colors.muted, fontSize: 11, letterSpacing: 0.8 }}>SECURE WORKSPACE</Word></View></View>
      <View style={[{ flex: 1, justifyContent: 'center', gap: wide ? 80 : 34, paddingVertical: 56 }, wide ? { flexDirection: 'row', alignItems: 'center' } : {}]}>
        <View style={{ flex: 1, maxWidth: wide ? 470 : 520, alignSelf: wide ? 'center' : 'stretch' }}>
          <View style={{ alignSelf: 'flex-start', borderRadius: 99, borderWidth: 1, borderColor: '#343a32', backgroundColor: '#171b17', paddingHorizontal: 12, paddingVertical: 7, marginBottom: 25 }}><Word style={{ color: colors.greenBright, fontSize: 10, letterSpacing: 1.5 }}>●  HBPLUS TEAM ACCESS</Word></View>
          <Word style={{ fontSize: wide ? 52 : 41, fontWeight: '700', letterSpacing: -2, lineHeight: wide ? 60 : 49 }}>A better way to{ '\n' }work, together.</Word>
          <Word style={{ color: colors.muted, fontSize: 15, lineHeight: 25, marginTop: 18, maxWidth: 390 }}>Your HBPlus workspace, ready when you are. Sign in with your official team account to continue.</Word>
          <View style={{ flexDirection: 'row', gap: 24, marginTop: 34 }}><View><Word style={{ color: colors.green, fontSize: 15, fontWeight: '600' }}>Private</Word><Word style={{ color: colors.dim, fontSize: 11, marginTop: 4 }}>TEAM WORKSPACE</Word></View><View style={{ width: 1, backgroundColor: colors.line }} /><View><Word style={{ color: colors.green, fontSize: 15, fontWeight: '600' }}>Protected</Word><Word style={{ color: colors.dim, fontSize: 11, marginTop: 4 }}>GOOGLE SIGN-IN</Word></View></View>
        </View>
        <View style={{ width: '100%', maxWidth: 420, alignSelf: 'center', borderRadius: 20, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel, padding: wide ? 30 : 24 }}>
          <Brand small />
          <Word style={{ fontSize: 23, fontWeight: '650', letterSpacing: -0.5, marginTop: 30 }}>Welcome back</Word>
          <Word style={{ color: colors.muted, fontSize: 13, lineHeight: 21, marginTop: 9 }}>Sign in with your company Google account to access your workspace.</Word>
          <GoogleSignInButton onError={setError} style={{ marginTop: 27 }} />
          {__DEV__ && <View style={{ marginTop: 18, alignItems: 'center', gap: 7 }}>
            <Pressable accessibilityRole="button" accessibilityLabel="Preview the dashboard with a demo profile" onPress={startDemoSession} style={({ pressed }) => ({ minHeight: 46, width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 11, borderWidth: 1, borderColor: '#46513f', backgroundColor: '#1b201c', opacity: pressed ? 0.75 : 1 })}>
              <Word style={{ color: colors.greenBright, fontSize: 13, fontWeight: '600' }}>Preview dashboard (demo)</Word>
            </Pressable>
            <Word style={{ color: colors.dim, textAlign: 'center', fontSize: 10, lineHeight: 15 }}>Local preview only. This does not sign you in to Google or Firebase.</Word>
          </View>}
          {!!authError && <View accessibilityRole="alert" style={{ marginTop: 15, borderRadius: 10, borderColor: colors.line, borderWidth: 1, backgroundColor: '#211b19', padding: 13 }}><Word style={{ color: '#e2c687', fontSize: 12, lineHeight: 19 }}>{authError}</Word></View>}
          {!!error && <View accessibilityRole="alert" style={{ marginTop: 15, borderRadius: 10, borderColor: error.includes('Access restricted') ? '#684d46' : colors.line, borderWidth: 1, backgroundColor: '#211b19', padding: 13 }}><Word style={{ color: error.includes('Access restricted') ? '#e4a29b' : '#e2c687', fontSize: 12, lineHeight: 19 }}>{error}</Word></View>}
          <View style={{ flexDirection: 'row', gap: 11, alignItems: 'flex-start', padding: 13, borderRadius: 10, backgroundColor: '#1b201c', marginTop: 18 }}><Word style={{ color: colors.green, fontSize: 13 }}>✓</Word><Word style={{ color: colors.muted, flex: 1, fontSize: 11, lineHeight: 18 }}>Access is limited to accounts in the <Text style={{ color: colors.greenBright, fontWeight: '600' }}>@hbplus.fit</Text> domain.</Word></View>
          <View style={{ height: 1, backgroundColor: colors.line, marginTop: 23, marginBottom: 17 }} />
          <Word style={{ color: colors.dim, textAlign: 'center', fontSize: 11, lineHeight: 18 }}>By continuing, you agree to use your authorized HBPlus account. Your session is securely managed by Google and Firebase.</Word>
        </View>
      </View>
      <View style={{ paddingTop: 18, borderTopWidth: 1, borderTopColor: '#202320', flexDirection: 'row', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}><Word style={{ color: colors.dim, fontSize: 10 }}>© 2026 HBPlus. TEAM WORKSPACE.</Word><Word style={{ color: colors.dim, fontSize: 10 }}>SECURE SIGN-IN · GOOGLE IDENTITY</Word></View>
    </View>
  </ScrollView></SafeAreaView>;
}

