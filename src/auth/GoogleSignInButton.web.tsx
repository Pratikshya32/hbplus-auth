import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, firebaseConfigReady } from '@/src/firebase';
import { ACCESS_ERROR, isAuthorizedEmail } from './domain';
import { colors, web } from '@/src/theme';

export function GoogleSignInButton({ onError, style }: { onError: (message: string) => void; style?: StyleProp<ViewStyle> }) {
  const [busy, setBusy] = useState(false);
  const signIn = async (chooseAccount = false) => {
    if (!firebaseConfigReady || !auth) { onError('Add your Firebase settings to .env to enable sign-in.'); return; }
    setBusy(true); onError('');
    try {
      const provider = new GoogleAuthProvider();
      if (chooseAccount) provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      if (!isAuthorizedEmail(result.user.email)) { await auth.signOut(); onError(ACCESS_ERROR); }
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') onError('Sign-in was cancelled. You can try again when ready.');
      else if (code === 'auth/popup-blocked') onError('Your browser blocked the Google sign-in window. Allow pop-ups and try again.');
      else if (code === 'auth/network-request-failed') onError('A network error interrupted sign-in. Check your connection and try again.');
      else onError('We couldn’t complete sign-in. Check your Firebase and Google provider settings, then try again.');
    } finally { setBusy(false); }
  };

  return <View style={[{ gap: 10 }, style]}>
    <GoogleButton label="Continue with Google" busy={busy} onPress={() => signIn()} />
    <GoogleButton label="Sign in as a new user" secondary busy={busy} onPress={() => signIn(true)} />
  </View>;
}

function GoogleButton({ label, onPress, busy, secondary = false }: { label: string; onPress: () => void; busy: boolean; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={busy} onPress={onPress} style={({ pressed }) => [secondary ? secondaryButton : button, { opacity: pressed || busy ? 0.75 : 1 }]}>
    {busy && !secondary ? <ActivityIndicator color={colors.text} /> : <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}><Text style={[{ fontSize: secondary ? 14 : 18, fontWeight: '700', color: secondary ? colors.greenBright : colors.text }, web]}>{secondary ? '＋' : 'G'}</Text><Text style={[{ color: secondary ? colors.greenBright : colors.text, fontSize: 13, fontWeight: '600' }, web]}>{label}</Text></View>}
  </Pressable>;
}

const button = { minHeight: 54, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panelLight, alignItems: 'center' as const, justifyContent: 'center' as const };
const secondaryButton = { ...button, minHeight: 46, backgroundColor: 'transparent', borderColor: '#343a32' };
