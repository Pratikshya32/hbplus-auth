import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ProtectedRoute } from '@/src/auth/ProtectedRoute';
import { useAuth } from '@/src/auth/AuthContext';
import { colors, web } from '@/src/theme';

function DashboardContent() {
  const { user, isDemo, signOutUser } = useAuth();
  const { width } = useWindowDimensions();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const signOut = async () => {
    setBusy(true); setError('');
    try { await signOutUser(); router.replace('/'); }
    catch { setError('We couldn’t sign you out. Check your connection and try again.'); setBusy(false); }
  };
  return <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}><ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.bg }}>
    <View style={[{ flex: 1, alignSelf: 'center', width: '100%', maxWidth: 960, paddingHorizontal: width > 700 ? 36 : 20, paddingTop: 32, paddingBottom: 30 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 22, borderBottomWidth: 1, borderBottomColor: colors.line }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}><View style={{ width: 35, height: 35, borderRadius: 10, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: colors.bg, fontWeight: '800', fontSize: 16 }}>H</Text></View><Text style={[{ color: colors.text, fontSize: 18, fontWeight: '700' }, web]}>HB<Text style={{ color: colors.green }}>Plus</Text></Text></View>
        <View style={{ borderRadius: 99, borderWidth: 1, borderColor: isDemo ? '#574b32' : colors.line, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}><View style={{ width: 7, height: 7, borderRadius: 5, backgroundColor: isDemo ? '#d4b36b' : colors.green }} /><Text style={[{ color: isDemo ? '#e2c687' : colors.greenBright, fontSize: 11 }, web]}>{isDemo ? 'Demo preview' : 'Authenticated'}</Text></View>
      </View>
      <View style={{ paddingTop: 42, paddingBottom: 24 }}><Text style={[{ color: colors.text, fontSize: 30, fontWeight: '700', letterSpacing: -1 }, web]}>Welcome back</Text><Text style={[{ color: colors.muted, fontSize: 14, marginTop: 9 }, web]}>You’re signed in to your HBPlus workspace.</Text></View>
      <Text style={[{ color: colors.muted, fontSize: 12, fontWeight: '600', marginBottom: 12 }, web]}>YOUR ACCOUNT</Text>
      <View style={{ borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel, padding: width > 600 ? 24 : 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, paddingBottom: 22, borderBottomWidth: 1, borderBottomColor: colors.line }}>
          {user?.photoURL ? <Image source={{ uri: user.photoURL }} accessibilityLabel="Google profile photo" style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.panelLight }} /> : <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.panelLight, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: colors.greenBright, fontSize: 22 }}>{user?.displayName?.charAt(0) ?? 'H'}</Text></View>}
          <View style={{ flex: 1 }}><Text style={[{ color: colors.text, fontSize: 17, fontWeight: '600' }, web]}>{user?.displayName ?? 'HBPlus member'}</Text><Text style={[{ color: colors.muted, fontSize: 13, marginTop: 5 }, web]}>{user?.email}</Text></View>
          <Text style={[{ color: isDemo ? '#e2c687' : colors.greenBright, fontSize: 11 }, web]}>{isDemo ? 'Demo profile' : 'Verified'}</Text>
        </View>
        <View style={{ paddingTop: 19, gap: 15 }}><Info label="WORKSPACE" value={isDemo ? 'HBPlus Demo' : 'HBPlus Team'} /><Info label="SIGN-IN METHOD" value={isDemo ? 'Local preview' : 'Google Workspace'} /><Info label="ACCESS STATUS" value={isDemo ? 'Preview only' : 'Authorized team member'} green={!isDemo} /></View>
      </View>
      <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 22 }} />
      {error ? <Text accessibilityRole="alert" style={[{ color: colors.red, fontSize: 12, marginBottom: 12 }, web]}>{error}</Text> : null}
      <Pressable accessibilityRole="button" disabled={busy} onPress={signOut} style={({ pressed }) => ({ minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 11, backgroundColor: colors.panelLight, borderWidth: 1, borderColor: colors.line, opacity: pressed || busy ? 0.7 : 1 })}>{busy ? <ActivityIndicator color={colors.greenBright} /> : <Text style={[{ color: colors.text, fontWeight: '600', fontSize: 13 }, web]}>↪   Sign out</Text>}</Pressable>
      <Text style={[{ color: colors.dim, fontSize: 11, lineHeight: 18, textAlign: 'center', marginTop: 20 }, web]}>{isDemo ? 'Demo profile only. Sign in with Google to use a real HBPlus account.' : 'Your account is securely managed by Firebase Authentication.'}</Text>
    </View>
  </ScrollView></SafeAreaView>;
}

function Info({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}><Text style={[{ color: colors.dim, fontSize: 10, letterSpacing: 0.7 }, web]}>{label}</Text><Text style={[{ color: green ? colors.greenBright : colors.text, fontSize: 12 }, web]}>{value}</Text></View>;
}

export default function DashboardScreen() {
  return <ProtectedRoute><DashboardContent /></ProtectedRoute>;
}
