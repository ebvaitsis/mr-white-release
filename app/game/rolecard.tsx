import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../src/store';
import { C } from '../../src/constants';
import { Role } from '../../src/types';
import { getCategories } from '../../src/data/words';

const ROLE_INFO: Record<Role, { label: string; emoji: string; color: string; bg: [string, string]; desc: string }> = {
  civilian: { label: 'Civilian', emoji: '👤', color: C.civilian, bg: ['#1A3A2A', '#0D2018'], desc: 'Discuss the word without saying it. Vote out Mr. White!' },
  mrwhite: { label: 'Mr. White', emoji: '👁', color: C.mrwhite, bg: ['#3A1A1A', '#200D0D'], desc: "You have NO word. Listen carefully, blend in. If caught, guess the word to win!" },
  undercover: { label: 'Undercover', emoji: '🕵️', color: C.undercover, bg: ['#3A2A0D', '#201A00'], desc: 'Your word is similar but different. Vote out Mr. White!' },
};

const ROLE_INFO_GR: Record<Role, { label: string; desc: string }> = {
  civilian: { label: 'Πολίτης', desc: 'Συζήτα για τη λέξη σου χωρίς να την πεις. Ψήφισε εκτός τον Mr. White!' },
  mrwhite: { label: 'Mr. White', desc: 'Δεν έχεις λέξη. Άκου προσεκτικά και παρίστανε. Αν σε πιάσουν, μάντεψε τη λέξη για να κερδίσεις!' },
  undercover: { label: 'Undercover', desc: 'Η λέξη σου είναι παρόμοια με τους πολίτες αλλά διαφορετική. Ψήφισε εκτός τον Mr. White!' },
};

export default function RoleCard() {
  const { game, markViewed, advanceReveal } = useStore();
  const [revealed, setRevealed] = useState(false);

  if (!game) return null;
  const player = game.players[game.currentRevealIndex];
  if (!player) return null;

  const role = player.role!;
  const info = ROLE_INFO[role];
  const gr = game.config.language === 'gr';
  const label = gr ? ROLE_INFO_GR[role].label : info.label;
  const desc = gr ? ROLE_INFO_GR[role].desc : info.desc;

  const hintCategory = (() => {
    if (role !== 'mrwhite' || !game.config.mrWhiteHint) return null;
    const cats = getCategories(game.config.language);
    const match = cats.find(c => c.id !== 'mixed' && c.pairs.some(p => p.civilian === game.civilianWord));
    return match ?? null;
  })();

  const handleDone = () => {
    markViewed(player.id);
    advanceReveal();
    router.replace('/game/rolerevealhub');
  };

  if (!revealed) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.center}>
          <Text style={s.lockHint}>
            {gr ? '🔒 Βεβαιώσου ότι κανείς άλλος δεν κοιτάει' : '🔒 Make sure no one else is watching'}
          </Text>
          <TouchableOpacity style={s.tapCard} onPress={() => setRevealed(true)} activeOpacity={0.85}>
            <Text style={s.tapEmoji}>👁</Text>
            <Text style={s.tapTitle}>
              {gr ? 'Πάτα για να δεις τον ρόλο σου' : 'Tap to reveal your role'}
            </Text>
            <Text style={s.tapSub}>
              {gr ? `Μόνο για τον/τη ${player.name}` : `Private — only for ${player.name}`}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <LinearGradient colors={info.bg} style={s.gradient}>
        <View style={s.inner}>
          <View style={[s.badge, { borderColor: info.color }]}>
            <Text style={[s.badgeText, { color: info.color }]}>{label.toUpperCase()}</Text>
          </View>

          <Text style={s.roleEmoji}>{info.emoji}</Text>

          {role === 'mrwhite' ? (
            <View style={s.wordBox}>
              <Text style={[s.mrwhiteTitle, { color: info.color }]}>MR. WHITE</Text>
              <Text style={s.noWord}>{gr ? 'Δεν έχεις λέξη' : 'You have no word'}</Text>
              {hintCategory && (
                <View style={s.hintBox}>
                  <Text style={s.hintLabel}>
                    {gr ? '💡 Κατηγορία:' : '💡 Category hint:'}
                  </Text>
                  <Text style={s.hintValue}>
                    {hintCategory.emoji}  {hintCategory.name}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={s.wordBox}>
              <Text style={s.wordLabel}>{gr ? 'Η ΛΕΞΗ ΣΟΥ ΕΙΝΑΙ' : 'YOUR WORD IS'}</Text>
              <Text style={[s.word, { color: info.color }]}>{player.word}</Text>
              {role === 'undercover' && (
                <Text style={s.wordNote}>
                  {gr ? '⚠️ Παρόμοια με τη λέξη των πολιτών' : "⚠️ Similar to civilians' word"}
                </Text>
              )}
            </View>
          )}

          <Text style={s.desc}>{desc}</Text>
          <TouchableOpacity style={[s.btn, { backgroundColor: info.color }]} onPress={handleDone}>
            <Text style={s.btnText}>
              {gr ? 'Έτοιμος — Πέρνα το κινητό 📲' : 'Done — Pass the Phone 📲'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  gradient: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 24 },
  lockHint: { fontSize: 13, color: C.textMuted, textAlign: 'center' },
  tapCard: { width: '100%', backgroundColor: C.bgCard, borderRadius: 24, borderWidth: 1, borderColor: C.borderActive, padding: 48, alignItems: 'center', gap: 16 },
  tapEmoji: { fontSize: 64 },
  tapTitle: { fontSize: 22, fontWeight: '800', color: C.textPrimary, textAlign: 'center' },
  tapSub: { fontSize: 14, color: C.textSecondary, textAlign: 'center' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'space-between', padding: 32, paddingTop: 60 },
  badge: { borderWidth: 1.5, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 6 },
  badgeText: { fontSize: 12, fontWeight: '900', letterSpacing: 3 },
  roleEmoji: { fontSize: 80 },
  wordBox: { alignItems: 'center', gap: 10 },
  wordLabel: { fontSize: 12, color: C.textSecondary, letterSpacing: 2, fontWeight: '700' },
  word: { fontSize: 52, fontWeight: '900', textAlign: 'center' },
  wordNote: { fontSize: 13, color: C.undercover, textAlign: 'center' },
  mrwhiteTitle: { fontSize: 42, fontWeight: '900', letterSpacing: 2 },
  noWord: { fontSize: 16, color: C.textSecondary },
  hintBox: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,71,87,0.35)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
  },
  hintLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  hintValue: {
    fontSize: 22,
    fontWeight: '800',
    color: C.mrwhite,
    textAlign: 'center',
  },
  desc: { fontSize: 14, color: C.textSecondary, textAlign: 'center', lineHeight: 22, paddingHorizontal: 8 },
  btn: { width: '100%', borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
