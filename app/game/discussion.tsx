import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../src/store';
import { C, AVATARS } from '../../src/constants';

export default function DiscussionScreen() {
  const { game } = useStore();
  const [randomPick, setRandomPick] = useState<string | null>(null);

  if (!game) return null;

  const gr = game.config.language === 'gr';
  const active = game.players.filter(p => !p.isEliminated);
  const round = game.rounds.length + 1;

  const pickRandom = () => {
    const pick = active[Math.floor(Math.random() * active.length)];
    setRandomPick(pick.name);
  };

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.roundBadge}>
          <Text style={s.roundText}>{gr ? 'ΓΥΡΟΣ' : 'ROUND'} {round}</Text>
        </View>
        <Text style={s.title}>{gr ? 'Ώρα Συζήτησης' : 'Discussion Time'}</Text>
        <Text style={s.sub}>
          {gr ? 'Μιλήστε, αμφισβητήστε και συζητήστε!' : 'Talk, question, and debate!'}
        </Text>

        <View style={s.card}>
          <Text style={s.cardLabel}>📋 {gr ? 'ΚΑΝΟΝΕΣ' : 'RULES'}</Text>
          {(gr ? [
            'Συζητήστε ελεύθερα για τη λέξη σας',
            'Μην πείτε τη λέξη σας απευθείας',
            'Ο Mr. White δεν έχει λέξη — πρέπει να παριστάνει!',
            'Μετά ψηφίζετε ποιον θέλετε να αποκλείσετε',
          ] : [
            'Discuss freely about your word',
            "Don't say your word directly",
            'Mr. White has no word — he must bluff!',
            'Then vote for who you want to eliminate',
          ]).map((r, i) => (
            <View key={i} style={s.rule}>
              <View style={s.dot} />
              <Text style={s.ruleText}>{r}</Text>
            </View>
          ))}
        </View>

        <View style={s.starterCard}>
          <Text style={s.starterTitle}>
            {gr ? '🎲 Ποιος μιλά πρώτος;' : '🎲 Who speaks first?'}
          </Text>
          <TouchableOpacity style={s.starterBtn} onPress={pickRandom}>
            <Text style={s.starterBtnText}>
              {gr ? 'Επιλογή τυχαίου παίκτη' : 'Pick a random player'}
            </Text>
          </TouchableOpacity>
          {randomPick && (
            <View style={s.pickedBox}>
              <Text style={s.pickedText}>
                🗣️ <Text style={s.pickedName}>{randomPick}</Text>
                {gr ? ' λέει την πρώτη λέξη!' : ' says the first word!'}
              </Text>
            </View>
          )}
        </View>

        <View style={s.card}>
          <Text style={s.cardLabel}>{gr ? 'ΕΝΕΡΓΟΙ ΠΑΙΚΤΕΣ' : 'ACTIVE PLAYERS'} ({active.length})</Text>
          <View style={s.playerGrid}>
            {active.map((p) => {
              const idx = game.players.indexOf(p);
              return (
                <View key={p.id} style={s.chip}>
                  <Text style={{ fontSize: 18 }}>{AVATARS[idx % AVATARS.length]}</Text>
                  <Text style={s.chipName} numberOfLines={1}>{p.name}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={s.btn} onPress={() => router.replace('/game/voting')}>
          <Text style={s.btnText}>{gr ? 'Ψηφίστε τώρα 🗳️' : 'Go to Vote 🗳️'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 24, paddingBottom: 48 },
  roundBadge: { alignSelf: 'flex-start', backgroundColor: C.primaryGlow, borderRadius: 999, borderWidth: 1, borderColor: C.borderActive, paddingHorizontal: 16, paddingVertical: 4, marginBottom: 12 },
  roundText: { fontSize: 11, fontWeight: '900', color: C.primary, letterSpacing: 3 },
  title: { fontSize: 34, fontWeight: '900', color: C.textPrimary, marginBottom: 8 },
  sub: { fontSize: 15, color: C.textSecondary, marginBottom: 24 },
  card: { backgroundColor: C.bgCard, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 20, marginBottom: 16 },
  cardLabel: { fontSize: 11, fontWeight: '700', color: C.textMuted, letterSpacing: 2, marginBottom: 16 },
  rule: { flexDirection: 'row', gap: 12, marginBottom: 10, alignItems: 'flex-start' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.primary, marginTop: 6, flexShrink: 0 },
  ruleText: { flex: 1, fontSize: 14, color: C.textSecondary, lineHeight: 20 },
  starterCard: { backgroundColor: C.bgCard, borderRadius: 16, borderWidth: 1, borderColor: C.borderActive, padding: 20, marginBottom: 16, gap: 14 },
  starterTitle: { fontSize: 15, fontWeight: '700', color: C.textPrimary, textAlign: 'center' },
  starterBtn: { backgroundColor: C.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  starterBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  pickedBox: { backgroundColor: C.primaryGlow, borderRadius: 12, padding: 16, alignItems: 'center' },
  pickedText: { fontSize: 16, color: C.textPrimary, textAlign: 'center', lineHeight: 24 },
  pickedName: { fontWeight: '900', color: C.primary, fontSize: 18 },
  playerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.bgSurface, borderRadius: 999, borderWidth: 1, borderColor: C.border, paddingHorizontal: 12, paddingVertical: 6 },
  chipName: { fontSize: 13, color: C.textPrimary, fontWeight: '500', maxWidth: 80 },
  btn: { backgroundColor: C.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
