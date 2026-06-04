export default {
  name: 'Mr. White',
  slug: 'mr-white-game',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'dark',
  scheme: 'mrwhite',
  splash: {
    resizeMode: 'contain',
    backgroundColor: '#080810',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.mrwhite.game',
  },
  android: {
    package: 'com.mrwhite.game',
    adaptiveIcon: {
      backgroundColor: '#080810',
    },
  },
  plugins: ['expo-router'],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: '986e98a3-4643-466c-a446-d236e0737c74',
    },
  },
};