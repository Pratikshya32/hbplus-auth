import { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth, firebaseConfigReady } from '@/src/firebase';
import { ACCESS_ERROR, isAuthorizedEmail } from './domain';
import { colors, web } from '@/src/theme';

WebBrowser.maybeCompleteAuthSession();

export function GoogleSignInButton({ onError, style }: { onError: (message: string) => void; style?: StyleProp<ViewStyle> }) {
  const clientId = Platform.OS === 'ios' ? process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID : process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
  if (!firebaseConfigReady || !auth) {
    const showError = () => onError('Add your Firebase settings to .env to enable sign-in.');
    return <View style={[{ gap: 10 }, style]}><GoogleButton onPress={showError} /><GoogleButton secondary onPress={showError} /></View>;
  }
  if (!clientId) {
    const showError = () => onError('Add your platform Google OAuth client ID to .env to enable sign-in.');
    return <View style={[{ gap: 10 }, style]}><GoogleButton onPress={showError} /><GoogleButton secondary onPress={showError} /></View>;
  }
  return <ConfiguredGoogleSignInButton clientId={clientId} onError={onError} style={style} />;
}

function ConfiguredGoogleSignInButton({ clientId, onError, style }: { clientId: string; onError: (message: string) => void; style?: StyleProp<ViewStyle> }) {
  const [busy, setBusy] = useState(false);
  const [request, , promptAsync] = Google.useIdTokenAuthRequest({
    ...(Platform.OS === 'ios' ? { iosClientId: clientId } : { androidClientId: clientId }),
  });
  const [newUserRequest, , promptNewUserAsync] = Google.useIdTokenAuthRequest({
    ...(Platform.OS === 'ios' ? { iosClientId: clientId } : { androidClientId: clientId }),
    selectAccount: true,
  });

  const signIn = async (chooseAccount = false) => {
    if (!(chooseAccount ? newUserRequest : request)) { onError('Google sign-in is still loading. Please try again in a moment.'); return; }
    onError(''); setBusy(true);
    try {
      const result = await (chooseAccount ? promptNewUserAsync() : promptAsync());
      if (result.type === 'cancel' || result.type === 'dismiss') { onError('Sign-in was cancelled. You can try again when ready.'); return; }
      if (result.type !== 'success') { onError('Google sign-in couldn’t connect. Check your connection and try again.'); return; }
      const token = result.params.id_token;
      if (!token) { onError('Google didn’t return an identity token. Check your OAuth client configuration.'); return; }
      const currentAuth = auth;
      if (!currentAuth) { onError('Add your Firebase settings to .env to enable sign-in.'); return; }
      const credential = await signInWithCredential(currentAuth, GoogleAuthProvider.credential(token));
      if (!isAuthorizedEmail(credential.user.email)) {
        try { await currentAuth.signOut(); } finally { onError(ACCESS_ERROR); }
      }
    } catch { onError('We couldn’t complete sign-in. Check your connection and Google OAuth settings, then try again.'); }
    finally { setBusy(false); }
  };

  return <View style={[{ gap: 10 }, style]}>
    <GoogleButton busy={busy} onPress={() => signIn()} />
    <GoogleButton busy={busy} secondary onPress={() => signIn(true)} />
  </View>;
}

function GoogleButton({ busy = false, onPress, secondary = false }: { busy?: boolean; onPress: () => void; secondary?: boolean }) {
  const label = secondary ? 'Sign in as a new user' : 'Continue with Google';
  return <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={busy} onPress={onPress} style={({ pressed }) => [secondary ? secondaryButton : button, { opacity: pressed || busy ? 0.75 : 1 }]}>
    {busy && !secondary ? <ActivityIndicator color={colors.text} /> : <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}><Text style={[{ fontSize: secondary ? 15 : 18, fontWeight: '700', color: secondary ? colors.greenBright : colors.text }, web]}>{secondary ? '+' : 'G'}</Text><Text style={[{ color: secondary ? colors.greenBright : colors.text, fontSize: 14, fontWeight: '600' }, web]}>{label}</Text></View>}
  </Pressable>;
}

const button = { minHeight: 54, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panelLight, alignItems: 'center' as const, justifyContent: 'center' as const };
const secondaryButton = { ...button, minHeight: 46, backgroundColor: 'transparent', borderColor: '#343a32' };
