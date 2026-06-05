import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';

const BG = '#080810';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: BG }}>
        <SafeAreaProvider style={{ backgroundColor: BG }}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: BG },
              gestureEnabled: false,
              animation: 'slide_from_right',
              animationDuration: 250,
              animationTypeForReplace: 'push',
            }}
          />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </View>
  );
}
