import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../src/store';
import { getActivePlayers } from '../../src/engine/gameEngine';
import { C, AVATARS } from '../../src/constants';

export default function VotingScreen() {
  const { game, eliminatePlayer } = useStore();
  const [selected, setSelected] = useState<string | null>(null);

  if (!game) return null;
  const gr = game.config.language === 'gr';
  const active = getActivePlayers(game.players);

  const handleConfirm = () => {
    if (!selected) return;
    const { gameOver, mrWhiteEliminated } = eliminatePlayer(selected);
    if (gameOver) {
      router.replace('/game/gameover');
    } else if (mrWhiteEliminated) {
      router.replace('/game/mrwhiteguess');
    } else {
      router.replace('/game/elimination');
    }
  };

  const selectedPlayer = active.find(p => p.id === selected);

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.phaseLabel}>{gr ? 'ΨΗΦΟΦΟΡΙΑ' : 'VOTING'}</Text>
        <Text style={s.title}>{gr ? 'Ποιος αποκλείεται;' : 'Who gets eliminated?'}</Text>
        <Text style={s.sub}>
          {gr
            ? 'Η ομάδα αποφάσισε — επίλεξε ποιος φεύγει'
            : 'The group has decided — select who gets voted out'}
        </Text>

        <View style={s.candidateList}>
          {active.map(p => {
            const pi = game.players.findIndex(pl => pl.id === p.id);
            const isSel = selected === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                style={[s.candidate, isSel && s.candidateSelected]}
                onPress={() => setSelected(p.id)}
                activeOpacity={0.75}
              >
                <Text style={s.candidateAvatar}>{AVATARS[pi % AVATARS.length]}</Text>
                <Text style={s.candidateName}>{p.name}</Text>
                {isSel && (
                  <View style={s.check}>
                    <Text style={s.checkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[s.btnDanger, !selected && s.btnDisabled]}
          onPress={handleConfirm}
          disabled={!selected}
        >
          <Text style={s.btnText}>
            {selected
              ? `${gr ? 'Αποκλεισμός' : 'Eliminate'} ${selectedPlayer?.name} ❌`
              : gr ? 'Επίλεξε παίκτη' : 'Select a player first'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 24, paddingBottom: 48 },
  phaseLabel: { fontSize: 11, fontWeight: '900', color: C.danger, letterSpacing: 3, marginBottom: 8 },
  title: { fontSize: 30, fontWeight: '900', color: C.textPrimary, marginBottom: 6 },
  sub: { fontSize: 14, color: C.textSecondary, marginBottom: 28, lineHeight: 20 },
  candidateList: { gap: 12, marginBottom: 28 },
  candidate: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: C.bgCard, borderRadius: 16,
    borderWidth: 1, borderColor: C.border,
    paddingHorizontal: 20, paddingVertical: 18,
  },
  candidateSelected: { borderColor: C.danger, backgroundColor: C.dangerGlow },
  candidateAvatar: { fontSize: 32 },
  candidateName: { flex: 1, fontSize: 18, fontWeight: '700', color: C.textPrimary },
  check: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.danger, alignItems: 'center', justifyContent: 'center' },
  checkText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  btnDanger: { backgroundColor: C.danger, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center' },
});
