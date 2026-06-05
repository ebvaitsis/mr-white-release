import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore } from '../src/store/settingsStore';
import { C } from '../src/constants';

const STRINGS = {
  en: {
    back: '← Back',
    title: 'Settings',
    languageSection: 'LANGUAGE',
    legalSection: 'LEGAL',
    terms: 'Terms & Conditions',
    privacy: 'Privacy Policy',
    termsUrl: 'https://sites.google.com/view/mr-white-termsandconditions/home',
    privacyUrl: 'https://sites.google.com/view/mrwhiteprivacypolicy/home',
    openError: 'Could not open link.',
  },
  gr: {
    back: '← Πίσω',
    title: 'Ρυθμίσεις',
    languageSection: 'ΓΛΩΣΣΑ',
    legalSection: 'ΝΟΜΙΚΑ',
    terms: 'Όροι Χρήσης',
    privacy: 'Πολιτική Απορρήτου',
    termsUrl: 'https://sites.google.com/view/mr-white-termsandconditions/home',
    privacyUrl: 'https://sites.google.com/view/mrwhiteprivacypolicy/home',
    openError: 'Δεν ήταν δυνατό το άνοιγμα του συνδέσμου.',
  },
};

const openUrl = async (url: string, errorMsg: string) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert(errorMsg);
  }
};

export default function SettingsScreen() {
  const { language, setLanguage } = useSettingsStore();
  const s = STRINGS[language];
  const isGr = language === 'gr';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scroll}>

        {/* Header */}
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>{s.back}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{s.title}</Text>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{s.languageSection}</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={[styles.langRow, !isGr && styles.langRowActive]}
              onPress={() => setLanguage('en')}
              activeOpacity={0.75}
            >
              <Text style={styles.langFlag}>🇬🇧</Text>
              <Text style={[styles.langText, !isGr && styles.langTextActive]}>English</Text>
              {!isGr && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[styles.langRow, isGr && styles.langRowActive]}
              onPress={() => setLanguage('gr')}
              activeOpacity={0.75}
            >
              <Text style={styles.langFlag}>🇬🇷</Text>
              <Text style={[styles.langText, isGr && styles.langTextActive]}>Ελληνικά</Text>
              {isGr && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{s.legalSection}</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.legalRow}
              onPress={() => openUrl(s.termsUrl, s.openError)}
              activeOpacity={0.75}
            >
              <Text style={styles.legalIcon}>📄</Text>
              <Text style={styles.legalText}>{s.terms}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.legalRow}
              onPress={() => openUrl(s.privacyUrl, s.openError)}
              activeOpacity={0.75}
            >
              <Text style={styles.legalIcon}>🔒</Text>
              <Text style={styles.legalText}>{s.privacy}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1, padding: 24 },
  back: { color: C.primary, fontSize: 15, fontWeight: '600', marginBottom: 16 },
  title: { fontSize: 34, fontWeight: '900', color: C.textPrimary, marginBottom: 32 },

  section: { marginBottom: 28 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.textMuted,
    letterSpacing: 2,
    marginBottom: 10,
    marginLeft: 4,
  },

  card: {
    backgroundColor: C.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },

  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  langRowActive: {
    backgroundColor: C.primaryGlow,
  },
  langFlag: { fontSize: 24 },
  langText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: C.textSecondary,
  },
  langTextActive: {
    color: C.primary,
  },
  checkmark: {
    fontSize: 18,
    color: C.primary,
    fontWeight: '900',
  },

  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  legalIcon: { fontSize: 20 },
  legalText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: C.textPrimary,
  },
  chevron: {
    fontSize: 22,
    color: C.textMuted,
    fontWeight: '300',
  },

  divider: {
    height: 1,
    backgroundColor: C.border,
    marginHorizontal: 20,
  },
});
