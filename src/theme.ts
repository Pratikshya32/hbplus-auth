import { Platform } from 'react-native';

export const colors = {
  bg: '#0b0c0b', panel: '#151716', panelLight: '#1b1e1c', line: '#292d2a',
  green: '#a0b091', greenBright: '#b1c49f', text: '#f4f5f2', muted: '#969b97',
  dim: '#626963', red: '#db8580', yellow: '#d5b66b',
};

export const web = Platform.OS === 'web' ? ({
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  boxSizing: 'border-box',
} as const) : {};
