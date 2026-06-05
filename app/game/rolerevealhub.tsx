import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../src/store';
import { C, AVATARS } from '../../src/constants';

export default function RoleRevealHub() {
  const { game, advanceReveal } = useStore();
  if (!game) return null;

  const allDone = game.currentRevealIndex >= game.players.length;
  const gr = game.config.language === 'gr';

  if (allDone) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.center}>
          <Text style={s.emoji}>🕵️</Text>
          <Text style={s.title}>{gr ? 'Όλοι είναι έτοιμοι!' : "Everyone's Ready!"}</Text>
          <Text style={s.sub}>
            {gr
              ? 'Όλοι οι παίκτες είδαν τον ρόλο τους.\nΏρα για συζήτηση!'
              : "All players have seen their roles.\nTime to discuss!"}
          </Text>
          <TouchableOpacity style={s.btn} onPress={() => router.replace('/game/discussion')}>
            <Text style={s.btnText}>{gr ? 'Έναρξη Συζήτησης 🗣️' : 'Start Discussion 🗣️'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const player = game.players[game.currentRevealIndex];
  const avatarIndex = game.currentRevealIndex;

  return (
    <SafeAreaView style={s.container}>
      <View style={s.center}>
        <Text style={s.passText}>{gr ? 'Πέρνα το κινητό στον/στην...' : 'Pass the phone to...'}</Text>
        <View style={s.card}>
          <Text style={s.cardAvatar}>{AVATARS[avatarIndex % AVATARS.length]}</Text>
          <Text style={s.playerName}>{player.name}</Text>
          <Text style={s.cardSub}>{gr ? 'Μόνο εσύ να βλέπεις την οθόνη' : 'Only you should see the screen'}</Text>
          <View style={s.divider} />
          <Text style={s.counter}>{game.currentRevealIndex + 1} {gr ? 'από' : 'of'} {game.players.length} {gr ? 'παίκτες' : 'players'}</Text>
        </View>
        <TouchableOpacity style={s.btn} onPress={() => router.push('/game/rolecard')}>
          <Text style={s.btnText}>
            {gr ? `Είμαι ο/η ${player.name} — Δείξε τον ρόλο μου 👁` : `I'm ${player.name} — Show My Role 👁`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 24 },
  emoji: { fontSize: 72 },
  title: { fontSize: 30, fontWeight: '900', color: C.textPrimary, textAlign: 'center' },
  sub: { fontSize: 15, color: C.textSecondary, textAlign: 'center', lineHeight: 22 },
  passText: { fontSize: 18, color: C.textSecondary, fontWeight: '500' },
  card: { width: '100%', backgroundColor: C.bgCard, borderRadius: 20, borderWidth: 1, borderColor: C.borderActive, padding: 36, alignItems: 'center', gap: 12 },
  cardAvatar: { fontSize: 56 },
  playerName: { fontSize: 36, fontWeight: '900', color: C.textPrimary },
  cardSub: { fontSize: 14, color: C.textSecondary },
  divider: { width: 40, height: 1, backgroundColor: C.border },
  counter: { fontSize: 13, color: C.textMuted },
  btn: { width: '100%', backgroundColor: C.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center' },
});
