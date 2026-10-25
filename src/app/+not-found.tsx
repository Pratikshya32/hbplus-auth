import { Link, Stack } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { colors, web } from '@/src/theme';

export default function NotFoundScreen() {
  return <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
    <Stack.Screen options={{ title: 'Page not found', headerShown: false }} />
    <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: colors.bg, fontWeight: '800', fontSize: 21 }}>H</Text></View>
    <Text style={[{ color: colors.text, fontSize: 23, fontWeight: '700', marginTop: 20 }, web]}>This page doesn’t exist.</Text>
    <Text style={[{ color: colors.muted, fontSize: 13, marginTop: 9, textAlign: 'center' }, web]}>The link may be old, or the address may have been typed incorrectly.</Text>
    <Link href="/" asChild><Pressable accessibilityRole="button" style={{ marginTop: 22, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 12, backgroundColor: colors.panelLight }}><Text style={[{ color: colors.greenBright, fontSize: 13, fontWeight: '600' }, web]}>Back to sign in</Text></Pressable></Link>
  </View>;
}
