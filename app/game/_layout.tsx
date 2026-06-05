import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function GameLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#080810' },
        gestureEnabled: false,
        animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
        animationDuration: Platform.OS === 'android' ? 250 : undefined,
      }}
    />
  );
}
