import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../src/store';
import { C, AVATARS } from '../../src/constants';

const WINNER_EN = {
  civilians: { emoji: '🎉', title: 'Civilians Win!', sub: 'Mr. White has been caught!', color: C.civilian, bg: ['#1A3A2A', '#0D2018'] as [string,string] },
  mrwhite:   { emoji: '👁',  title: 'Mr. White Wins!', sub: 'He survived till the end!', color: C.mrwhite, bg: ['#3A1A1A', '#200D0D'] as [string,string] },
};
const WINNER_GR = {
  civilians: { emoji: '🎉', title: 'Νίκη Πολιτών!', sub: 'Ο Mr. White πιάστηκε!', color: C.civilian, bg: ['#1A3A2A', '#0D2018'] as [string,string] },
  mrwhite:   { emoji: '👁',  title: 'Νίκη Mr. White!', sub: 'Επέζησε μέχρι το τέλος!', color: C.mrwhite, bg: ['#3A1A1A', '#200D0D'] as [string,string] },
};

export default function GameOverScreen() {
  const { game, rematch, resetGame } = useStore();
  if (!game) return null;

  const gr = game.config.language === 'gr';
  const winner = (game.winner === 'undercover' ? 'civilians' : game.winner) ?? 'civilians';
  const WINNER = gr ? WINNER_GR : WINNER_EN;
  const w = WINNER[winner as 'civilians' | 'mrwhite'];
  const mrWhiteWon = winner === 'mrwhite';

  const mrWhites = game.players.filter(p => p.role === 'mrwhite');
  const undercovers = game.players.filter(p => p.role === 'undercover');
  const civilians = game.players.filter(p => p.role === 'civilian');

  const roundSummary = game.rounds.map((round, i) => {
    const votedOut = game.players.find(p => p.id === round.eliminatedPlayerId);
    return { roundNum: i + 1, player: votedOut };
  });

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <LinearGradient colors={w.bg} style={s.heroCard}>
          <Text style={s.heroEmoji}>{w.emoji}</Text>
          <Text style={[s.heroTitle, { color: w.color }]}>{w.title}</Text>
          <Text style={s.heroSub}>{w.sub}</Text>
          <View style={s.wordBox}>
            <Text style={s.wordLabel}>{gr ? 'Η ΛΕΞΗ ΗΤΑΝ' : 'THE WORD WAS'}</Text>
            <Text style={[s.word, { color: w.color }]}>{game.civilianWord}</Text>
            {game.config.undercoverCount > 0 && (
              <Text style={[s.undercoverWord, { color: C.undercover }]}>
                Undercover: {game.undercoverWord}
              </Text>
            )}
          </View>
        </LinearGradient>

        {roundSummary.length > 0 && (
          <View style={s.roundsCard}>
            <Text style={s.sectionLabel}>{gr ? 'ΤΙ ΕΓΙΝΕ ΣΕ ΚΑΘΕ ΓΥΡΟ' : 'WHAT HAPPENED EACH ROUND'}</Text>
            {roundSummary.map(({ roundNum, player }) => {
              if (!player) return null;
              const pi = game.players.indexOf(player);
              const roleColor = player.role === 'mrwhite' ? C.mrwhite : player.role === 'undercover' ? C.undercover : C.civilian;
              const roleTag = player.role === 'mrwhite' ? '👁 Mr. White' : player.role === 'undercover' ? '🕵️ Undercover' : gr ? '👤 Πολίτης' : '👤 Civilian';
              return (
                <View key={roundNum} style={s.roundRow}>
                  <View style={s.roundNumBox}>
                    <Text style={s.roundNum}>{roundNum}</Text>
                  </View>
                  <Text style={s.roundAvatar}>{AVATARS[pi % AVATARS.length]}</Text>
                  <View style={s.roundInfo}>
                    <Text style={s.roundPlayerName}>{player.name}</Text>
                    <Text style={[s.roundRole, { color: roleColor }]}>{roleTag}</Text>
                  </View>
                  <Text style={s.votedOutTag}>{gr ? 'Ψηφίστηκε εκτός' : 'Voted out'}</Text>
                </View>
              );
            })}
          </View>
        )}

        {!mrWhiteWon && (
          <View style={s.summaryCard}>
            <Text style={s.sectionLabel}>{gr ? 'ΡΟΛΟΙ ΠΑΙΧΤΩΝ' : 'PLAYER ROLES'}</Text>

            {mrWhites.length > 0 && (
              <View style={s.roleGroup}>
                <Text style={[s.roleTitle, { color: C.mrwhite }]}>👁 Mr. White</Text>
                {mrWhites.map(p => {
                  const i = game.players.indexOf(p);
                  return (
                    <View key={p.id} style={s.playerRow}>
                      <Text style={{ fontSize: 20 }}>{AVATARS[i % AVATARS.length]}</Text>
                      <Text style={[s.playerName, p.isEliminated && s.eliminated]}>{p.name}</Text>
                      <Text style={s.status}>{p.isEliminated ? gr ? '❌ Ψηφίστηκε εκτός' : '❌ Voted out' : gr ? '✓ Επέζησε' : '✓ Survived'}</Text>
                    </View>
                  );
                })}
              </View>
            )}

            {undercovers.length > 0 && (
              <View style={s.roleGroup}>
                <Text style={[s.roleTitle, { color: C.undercover }]}>🕵️ Undercover ({game.undercoverWord})</Text>
                {undercovers.map(p => {
                  const i = game.players.indexOf(p);
                  return (
                    <View key={p.id} style={s.playerRow}>
                      <Text style={{ fontSize: 20 }}>{AVATARS[i % AVATARS.length]}</Text>
                      <Text style={[s.playerName, p.isEliminated && s.eliminated]}>{p.name}</Text>
                      <Text style={s.status}>{p.isEliminated ? gr ? '❌ Ψηφίστηκε εκτός' : '❌ Voted out' : gr ? '✓ Επέζησε' : '✓ Survived'}</Text>
                    </View>
                  );
                })}
              </View>
            )}

            <View style={s.roleGroup}>
              <Text style={[s.roleTitle, { color: C.civilian }]}>
                👤 {gr ? 'Πολίτες' : 'Civilians'} ({game.civilianWord})
              </Text>
              {civilians.map(p => {
                const i = game.players.indexOf(p);
                return (
                  <View key={p.id} style={s.playerRow}>
                    <Text style={{ fontSize: 20 }}>{AVATARS[i % AVATARS.length]}</Text>
                    <Text style={[s.playerName, p.isEliminated && s.eliminated]}>{p.name}</Text>
                    <Text style={s.status}>{p.isEliminated ? gr ? '❌ Ψηφίστηκε εκτός' : '❌ Voted out' : gr ? '✓ Ασφαλής' : '✓ Safe'}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {!mrWhiteWon && (
          <View style={s.stats}>
            <View style={s.stat}>
              <Text style={s.statVal}>{game.rounds.length}</Text>
              <Text style={s.statLbl}>{gr ? 'Γύροι' : 'Rounds'}</Text>
            </View>
            <View style={s.statDiv} />
            <View style={s.stat}>
              <Text style={s.statVal}>{game.players.length}</Text>
              <Text style={s.statLbl}>{gr ? 'Παίκτες' : 'Players'}</Text>
            </View>
            <View style={s.statDiv} />
            <View style={s.stat}>
              <Text style={s.statVal}>{game.players.filter(p => p.isEliminated).length}</Text>
              <Text style={s.statLbl}>{gr ? 'Αποκλ.' : 'Voted out'}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity style={s.btnGold} onPress={() => { rematch(); router.replace('/game/rolerevealhub'); }}>
          <Text style={s.btnGoldText}>🔄 {gr ? 'Ξανά!' : 'Rematch!'}</Text>
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
  scroll: { padding: 24, paddingBottom: 48, gap: 16 },
  heroCard: { borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 32, alignItems: 'center', gap: 12 },
  heroEmoji: { fontSize: 64 },
  heroTitle: { fontSize: 36, fontWeight: '900', textAlign: 'center' },
  heroSub: { fontSize: 15, color: C.textSecondary, textAlign: 'center' },
  wordBox: { alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14, gap: 4 },
  wordLabel: { fontSize: 11, color: C.textMuted, letterSpacing: 2, fontWeight: '700' },
  word: { fontSize: 32, fontWeight: '900' },
  undercoverWord: { fontSize: 14, fontWeight: '600' },
  roundsCard: { backgroundColor: C.bgCard, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 20, gap: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: C.textMuted, letterSpacing: 2, marginBottom: 4 },
  roundRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  roundNumBox: { width: 28, height: 28, borderRadius: 8, backgroundColor: C.bgSurface, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  roundNum: { fontSize: 12, fontWeight: '800', color: C.textSecondary },
  roundAvatar: { fontSize: 22 },
  roundInfo: { flex: 1 },
  roundPlayerName: { fontSize: 14, fontWeight: '700', color: C.textPrimary },
  roundRole: { fontSize: 11, fontWeight: '600' },
  votedOutTag: { fontSize: 11, color: C.danger, fontWeight: '700' },
  summaryCard: { backgroundColor: C.bgCard, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 20, gap: 20 },
  roleGroup: { gap: 10 },
  roleTitle: { fontSize: 14, fontWeight: '700' },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  playerName: { flex: 1, fontSize: 15, color: C.textPrimary, fontWeight: '500' },
  eliminated: { textDecorationLine: 'line-through', color: C.textMuted },
  status: { fontSize: 13, color: C.textSecondary },
  stats: { flexDirection: 'row', backgroundColor: C.bgCard, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 20 },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statVal: { fontSize: 28, fontWeight: '900', color: C.textPrimary },
  statLbl: { fontSize: 11, color: C.textMuted, letterSpacing: 1, textTransform: 'uppercase' },
  statDiv: { width: 1, backgroundColor: C.border, marginVertical: 4 },
  btnGold: { backgroundColor: C.gold, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  btnGoldText: { color: C.bg, fontSize: 17, fontWeight: '800' },
  btnSecondary: { backgroundColor: C.bgCard, borderRadius: 16, paddingVertical: 18, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  btnSecondaryText: { color: C.textPrimary, fontSize: 17, fontWeight: '600' },
});
