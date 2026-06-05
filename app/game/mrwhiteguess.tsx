import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../src/store';
import { C, AVATARS } from '../../src/constants';

export default function MrWhiteGuess() {
  const { game, rematch, resetGame } = useStore();
  if (!game) return null;
  const gr = game.config.language === 'gr';
  const mrWhite = [...game.players].reverse().find(p => p.role === 'mrwhite' && p.isEliminated);
  const mrWhiteIndex = mrWhite ? game.players.indexOf(mrWhite) : 0;

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.heroCard}>
          <Text style={s.heroEmoji}>👁</Text>
          <Text style={s.heroTitle}>{gr ? 'Πιάστηκες!' : 'You Were Caught!'}</Text>
          <Text style={s.heroAvatar}>{mrWhite ? AVATARS[mrWhiteIndex % AVATARS.length] : '👤'}</Text>
          <Text style={s.heroName}>{mrWhite?.name ?? 'Mr. White'}</Text>
          <View style={s.badge}><Text style={s.badgeText}>MR. WHITE</Text></View>
        </View>

        <View style={s.instructCard}>
          <Text style={s.instructTitle}>{gr ? '🎯 Τελευταία ευκαιρία!' : '🎯 Last Chance!'}</Text>
          <Text style={s.instructText}>
            {gr
              ? 'Πες δυνατά στους φίλους σου τη λέξη που νομίζεις ότι είχαν.\n\nΑν τη βρεις, κερδίζεις!\nΑν όχι, κερδίζουν οι Πολίτες.'
              : 'Say out loud to your friends what you think the secret word was.\n\nIf you got it right, you win!\nIf not, the Civilians win.'}
          </Text>
        </View>

        <TouchableOpacity style={s.btnGold} onPress={() => { rematch(); router.replace('/game/rolerevealhub'); }}>
          <Text style={s.btnGoldText}>🔄 {gr ? 'Ξανά με τους ίδιους!' : 'Rematch!'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.btnSecondary} onPress={() => { resetGame(); router.replace('/'); }}>
          <Text style={s.btnSecondaryText}>{gr ? 'Νέο Παιχνίδι' : 'New Game'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 24, paddingBottom: 60, gap: 16 },
  heroCard: { backgroundColor: C.bgCard, borderRadius: 20, borderWidth: 1.5, borderColor: `${C.mrwhite}50`, padding: 28, alignItems: 'center', gap: 10 },
  heroEmoji: { fontSize: 52 },
  heroTitle: { fontSize: 26, fontWeight: '900', color: C.mrwhite, textAlign: 'center' },
  heroAvatar: { fontSize: 48, marginTop: 4 },
  heroName: { fontSize: 24, fontWeight: '800', color: C.textPrimary },
  badge: { backgroundColor: `${C.mrwhite}20`, borderRadius: 999, borderWidth: 1.5, borderColor: C.mrwhite, paddingHorizontal: 18, paddingVertical: 4 },
  badgeText: { color: C.mrwhite, fontWeight: '900', fontSize: 11, letterSpacing: 3 },
  instructCard: { backgroundColor: C.bgSurface, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 24 },
  instructTitle: { fontSize: 17, fontWeight: '800', color: C.gold, textAlign: 'center', marginBottom: 14 },
  instructText: { fontSize: 16, color: C.textPrimary, lineHeight: 28, textAlign: 'center' },
  btnGold: { backgroundColor: C.gold, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  btnGoldText: { color: C.bg, fontSize: 17, fontWeight: '800' },
  btnSecondary: { backgroundColor: C.bgSurface, borderRadius: 16, paddingVertical: 18, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  btnSecondaryText: { color: C.textPrimary, fontSize: 17, fontWeight: '600' },
});
