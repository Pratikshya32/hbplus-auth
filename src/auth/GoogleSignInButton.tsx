import { Platform } from 'react-native';
import { GoogleSignInButton as WebButton } from './GoogleSignInButton.web';
import { GoogleSignInButton as NativeButton } from './GoogleSignInButton.native';

export const GoogleSignInButton = Platform.OS === 'web' ? WebButton : NativeButton;
