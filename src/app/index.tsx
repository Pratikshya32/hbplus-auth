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
  
  // Robust responsiveness: on web, check window width directly so static export never forces mobile stacking
  const isWeb = Platform.OS === 'web';
  const [isWide, setIsWide] = useState(() => {
    if (isWeb && typeof window !== 'undefined') {
      return window.innerWidth >= 760;
    }
    return width >= 760;
  });

  useEffect(() => {
    if (isWeb && typeof window !== 'undefined') {
      const update = () => setIsWide(window.innerWidth >= 760);
      update();
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    } else {
      setIsWide(width >= 760);
    }
  }, [width, isWeb]);

  useEffect(() => { if (!loading && user) router.replace('/dashboard'); }, [loading, user]);

  if (loading || user) return <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.green} /></View>;

  return <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.bg }}>
      <View style={[{ width: '100%', maxWidth: 1120, alignSelf: 'center', flex: 1, paddingHorizontal: isWide ? 44 : 20, paddingVertical: 20 }, isWeb ? ({ minHeight: '100vh', boxSizing: 'border-box' } as object) : {}]}>
        
        {/* Top Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Brand />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 99, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12, paddingVertical: 7 }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green }} />
            <Word style={{ color: colors.muted, fontSize: 11, letterSpacing: 0.8 }}>SECURE WORKSPACE</Word>
          </View>
        </View>

        {/* Hero & Card Section */}
        <View style={[{ flex: 1, justifyContent: isWide ? 'space-between' : 'center', alignItems: 'center', paddingVertical: isWide ? 28 : 20, gap: isWide ? 48 : 32 }, isWide ? { flexDirection: 'row' } : { flexDirection: 'column' }]}>
          
          {/* Left Column (Hero) */}
          <View style={{ flex: isWide ? 1 : undefined, maxWidth: isWide ? 500 : 440, width: '100%', alignSelf: 'center' }}>
            <View style={{ alignSelf: 'flex-start', borderRadius: 99, borderWidth: 1, borderColor: '#343a32', backgroundColor: '#171b17', paddingHorizontal: 12, paddingVertical: 6, marginBottom: 20 }}>
              <Word style={{ color: colors.greenBright, fontSize: 10, letterSpacing: 1.5 }}>●  HBPLUS TEAM ACCESS</Word>
            </View>
            <Word style={{ fontSize: isWide ? 48 : 36, fontWeight: '700', letterSpacing: -1.5, lineHeight: isWide ? 56 : 44 }}>
              A better way to{ '\n' }work, together.
            </Word>
            <Word style={{ color: colors.muted, fontSize: 15, lineHeight: 24, marginTop: 16, maxWidth: 410 }}>
              Your HBPlus workspace, ready when you are. Sign in with your official team account to continue.
            </Word>
            <View style={{ flexDirection: 'row', gap: 24, marginTop: 28 }}>
              <View>
                <Word style={{ color: colors.green, fontSize: 15, fontWeight: '600' }}>Private</Word>
                <Word style={{ color: colors.dim, fontSize: 11, marginTop: 4 }}>TEAM WORKSPACE</Word>
              </View>
              <View style={{ width: 1, backgroundColor: colors.line }} />
              <View>
                <Word style={{ color: colors.green, fontSize: 15, fontWeight: '600' }}>Protected</Word>
                <Word style={{ color: colors.dim, fontSize: 11, marginTop: 4 }}>GOOGLE SIGN-IN</Word>
              </View>
            </View>
          </View>

          {/* Right Column (Card) */}
          <View style={{ width: '100%', maxWidth: 420, alignSelf: 'center', borderRadius: 20, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel, padding: isWide ? 26 : 22 }}>
            <Brand small />
            <Word style={{ fontSize: 22, fontWeight: '700', letterSpacing: -0.5, marginTop: 18 }}>Welcome back</Word>
            <Word style={{ color: colors.muted, fontSize: 13, lineHeight: 20, marginTop: 6 }}>Sign in with your company Google account to access your workspace.</Word>
            
            <GoogleSignInButton onError={setError} style={{ marginTop: 18 }} />
            
            {/* Demo dashboard button - always available */}
            <View style={{ marginTop: 12, alignItems: 'center', gap: 6 }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Preview the dashboard with a demo profile"
                onPress={startDemoSession}
                style={({ pressed }) => ({
                  minHeight: 46,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 11,
                  borderWidth: 1,
                  borderColor: '#46513f',
                  backgroundColor: '#1b201c',
                  opacity: pressed ? 0.75 : 1,
                })}>
                <Word style={{ color: colors.greenBright, fontSize: 13, fontWeight: '600' }}>Preview dashboard (demo)</Word>
              </Pressable>
              <Word style={{ color: colors.dim, textAlign: 'center', fontSize: 10, lineHeight: 15 }}>
                Local preview only. This does not sign you in to Google or Firebase.
              </Word>
            </View>

            {!!authError && <View accessibilityRole="alert" style={{ marginTop: 12, borderRadius: 10, borderColor: colors.line, borderWidth: 1, backgroundColor: '#211b19', padding: 12 }}><Word style={{ color: '#e2c687', fontSize: 12, lineHeight: 18 }}>{authError}</Word></View>}
            {!!error && <View accessibilityRole="alert" style={{ marginTop: 12, borderRadius: 10, borderColor: error.includes('Access restricted') ? '#684d46' : colors.line, borderWidth: 1, backgroundColor: '#211b19', padding: 12 }}><Word style={{ color: error.includes('Access restricted') ? '#e4a29b' : '#e2c687', fontSize: 12, lineHeight: 18 }}>{error}</Word></View>}

            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, backgroundColor: '#1b201c', marginTop: 14 }}>
              <Word style={{ color: colors.green, fontSize: 13 }}>✓</Word>
              <Word style={{ color: colors.muted, flex: 1, fontSize: 11, lineHeight: 17 }}>Access is limited to accounts in the <Text style={{ color: colors.greenBright, fontWeight: '600' }}>@hbplus.fit</Text> domain.</Word>
            </View>

            <View style={{ height: 1, backgroundColor: colors.line, marginTop: 16, marginBottom: 12 }} />
            <Word style={{ color: colors.dim, textAlign: 'center', fontSize: 11, lineHeight: 16 }}>By continuing, you agree to use your authorized HBPlus account. Your session is securely managed by Google and Firebase.</Word>
          </View>

        </View>

        {/* Footer */}
        <View style={{ paddingTop: 14, borderTopWidth: 1, borderTopColor: '#202320', flexDirection: 'row', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <Word style={{ color: colors.dim, fontSize: 10 }}>© 2026 HBPlus. TEAM WORKSPACE.</Word>
          <Word style={{ color: colors.dim, fontSize: 10 }}>SECURE SIGN-IN · GOOGLE IDENTITY</Word>
        </View>

      </View>
    </ScrollView>
  </SafeAreaView>;
}
