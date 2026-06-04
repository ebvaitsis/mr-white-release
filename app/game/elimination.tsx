import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../src/store';
import { C, AVATARS } from '../../src/constants';

export default function EliminationScreen() {
  const { game, nextRound } = useStore();
  const [revealed, setRevealed] = useState(false);
  if (!game) return null;

  const gr = game.config.language === 'gr';
  const lastRound = game.rounds[game.rounds.length - 1];
  const eliminated = game.players.find(p => p.id === lastRound?.eliminatedPlayerId);
  if (!eliminated) return null;

  const pi = game.players.indexOf(eliminated);
  const isCivilian = eliminated.role === 'civilian';
  const isUndercover = eliminated.role === 'undercover';

  const roleColor = isUndercover ? C.undercover : isCivilian ? C.civilian : C.mrwhite;
  const roleLabel = isUndercover
    ? '🕵️ UNDERCOVER'
    : isCivilian
    ? gr ? '👤 ΠΟΛΙΤΗΣ' : '👤 CIVILIAN'
    : '👁 MR. WHITE';

  return (
    <SafeAreaView style={s.container}>
      <View style={s.inner}>
        <Text style={s.phase}>{gr ? 'ΑΠΟΚΛΕΙΣΜΟΣ' : 'ELIMINATION'}</Text>

        {!revealed ? (
          <>
            <View style={s.mystery}>
              <Text style={s.mysteryEmoji}>🎭</Text>
              <Text style={s.mysteryName}>{eliminated.name}</Text>
              <Text style={s.mysterySub}>
                {gr ? 'αποκλείστηκε από την ομάδα' : 'has been eliminated by the group'}
              </Text>
            </View>
            <TouchableOpacity style={s.btnDanger} onPress={() => setRevealed(true)}>
              <Text style={s.btnText}>{gr ? 'Αποκάλυψη ρόλου 🔍' : 'Reveal Their Role 🔍'}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <LinearGradient colors={[`${roleColor}22`, C.bgCard]} style={s.revealCard}>
              <Text style={{ fontSize: 56 }}>{AVATARS[pi % AVATARS.length]}</Text>
              <Text style={s.revealName}>{eliminated.name}</Text>
              <View style={[s.badge, { borderColor: roleColor }]}>
                <Text style={[s.badgeText, { color: roleColor }]}>{roleLabel}</Text>
              </View>

              {isCivilian && (
                <View style={s.noteBox}>
                  <Text style={s.noteText}>
                    {gr
                      ? '😬 Ήταν αθώος! Η λέξη τους παραμένει μυστική.'
                      : '😬 They were innocent! Their word remains secret.'}
                  </Text>
                </View>
              )}

              {isUndercover && (
                <View style={[s.noteBox, { borderColor: `${C.undercover}40` }]}>
                  <Text style={[s.noteText, { color: C.undercover }]}>
                    {gr
                      ? '🕵️ Ο Undercover αποκλείστηκε!'
                      : '🕵️ The Undercover agent was eliminated!'}
                  </Text>
                </View>
              )}
            </LinearGradient>

            <TouchableOpacity style={s.btn} onPress={() => { nextRound(); router.replace('/game/discussion'); }}>
              <Text style={s.btnText}>{gr ? 'Επόμενος γύρος →' : 'Next Round →'}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  inner: { flex: 1, padding: 24, justifyContent: 'center', gap: 24 },
  phase: { fontSize: 11, fontWeight: '900', color: C.danger, letterSpacing: 3, textAlign: 'center' },
  mystery: { backgroundColor: C.bgCard, borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 40, alignItems: 'center', gap: 12 },
  mysteryEmoji: { fontSize: 64 },
  mysteryName: { fontSize: 36, fontWeight: '900', color: C.textPrimary },
  mysterySub: { fontSize: 15, color: C.textSecondary, textAlign: 'center' },
  revealCard: { borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 32, alignItems: 'center', gap: 16 },
  revealName: { fontSize: 32, fontWeight: '900', color: C.textPrimary },
  badge: { borderWidth: 1.5, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 6 },
  badgeText: { fontSize: 12, fontWeight: '900', letterSpacing: 3 },
  noteBox: { backgroundColor: C.bgSurface, borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingHorizontal: 20, paddingVertical: 12, width: '100%' },
  noteText: { fontSize: 14, color: C.textSecondary, textAlign: 'center', lineHeight: 20 },
  btn: { backgroundColor: C.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  btnDanger: { backgroundColor: C.danger, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
