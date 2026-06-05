import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../src/constants';
import { useSettingsStore } from '../src/store/settingsStore';

const STEPS_EN = [
  {
    n: '01', emoji: '🎭', title: 'Setup Roles',
    desc: "Each player secretly views their role. Civilians get a word. Mr. White gets nothing.",
  },
  {
    n: '02', emoji: '💬', title: 'Give Clues',
    desc: "Take turns saying ONE word that relates to your word — but don't say it directly!",
  },
  {
    n: '03', emoji: '🗳️', title: 'Discuss & Vote',
    desc: 'Debate who seems suspicious. Everyone votes for who they think is Mr. White.',
  },
  {
    n: '04', emoji: '❌', title: 'Elimination',
    desc: 'The player with most votes is eliminated and their role is revealed.',
  },
  {
    n: '05', emoji: '👁', title: "Mr. White's Last Chance",
    desc: "If caught, Mr. White can guess the civilians' word to steal the win!",
  },
  {
    n: '06', emoji: '🏆', title: 'Win Conditions',
    desc: 'Civilians and Undercover win if all impostors are caught. Mr. White wins by surviving or guessing the word correctly.',
  },
];

const STEPS_GR = [
  {
    n: '01', emoji: '🎭', title: 'Ανάθεση Ρόλων',
    desc: 'Κάθε παίκτης βλέπει κρυφά τον ρόλο του. Οι Πολίτες παίρνουν μια λέξη. Ο Mr. White δεν παίρνει τίποτα.',
  },
  {
    n: '02', emoji: '💬', title: 'Δώσε Υπόδειξη',
    desc: 'Ο καθένας λέει ΜΙΑ λέξη που σχετίζεται με τη δική του — αλλά χωρίς να την πει απευθείας!',
  },
  {
    n: '03', emoji: '🗳️', title: 'Συζήτηση & Ψηφοφορία',
    desc: 'Συζητήστε ποιος φαίνεται ύποπτος. Ψηφίστε όλοι μαζί ποιον θέλετε να αποκλείσετε.',
  },
  {
    n: '04', emoji: '❌', title: 'Αποκλεισμός',
    desc: 'Ο παίκτης με τις περισσότερες ψήφους αποκλείεται και ο ρόλος του αποκαλύπτεται.',
  },
  {
    n: '05', emoji: '👁', title: 'Τελευταία Ευκαιρία Mr. White',
    desc: 'Αν πιαστεί, ο Mr. White μπορεί να μαντέψει τη λέξη των πολιτών για να κερδίσει!',
  },
  {
    n: '06', emoji: '🏆', title: 'Συνθήκες Νίκης',
    desc: 'Πολίτες και Undercover κερδίζουν αν πιάσουν όλους τους απατεώνες. Ο Mr. White κερδίζει αν επιβιώσει ή μαντέψει σωστά τη λέξη.',
  },
];

const ROLES_EN = [
  { label: '👤 Civilian', color: C.civilian, desc: 'Know the word. Vote out impostors.' },
  { label: '👁 Mr. White', color: C.mrwhite, desc: 'No word. Bluff your way through. Guess if caught.' },
  { label: '🕵️ Undercover', color: C.undercover, desc: 'Similar word, blend in and try not to confuse civilians. Vote out impostors.' },
];

const ROLES_GR = [
  { label: '👤 Πολίτης', color: C.civilian, desc: 'Ξέρεις τη λέξη. Ψήφισε εκτός τους απατεώνες.' },
  { label: '👁 Mr. White', color: C.mrwhite, desc: 'Δεν έχεις λέξη. Παρίστανε. Αν σε πιάσουν, μάντεψε!' },
  { label: '🕵️ Undercover', color: C.undercover, desc: 'Παρόμοια λέξη, ανακατεύσου χωρίς να μπερδέψεις τους πολίτες. Ψήφισε εκτός τον Mr. White.' },
];

export default function HowToPlay() {
  const { language } = useSettingsStore();
  const gr = language === 'gr';

  const STEPS = gr ? STEPS_GR : STEPS_EN;
  const ROLES = gr ? ROLES_GR : ROLES_EN;

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.back}>{gr ? '← Πίσω' : '← Back'}</Text>
        </TouchableOpacity>
        <Text style={s.title}>{gr ? 'Πώς να Παίξεις' : 'How to Play'}</Text>
        <Text style={s.sub}>
          {gr ? 'Κατακτήστε την τέχνη της εξαπάτησης' : 'Master the art of deception'}
        </Text>

        {STEPS.map((step, i) => (
          <View key={i} style={s.step}>
            <View style={s.stepMeta}>
              <Text style={s.stepNum}>{step.n}</Text>
              <Text style={s.stepEmoji}>{step.emoji}</Text>
            </View>
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>{step.title}</Text>
              <Text style={s.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}

        <View style={s.rolesCard}>
          <Text style={s.rolesTitle}>
            {gr ? 'Ρόλοι με μια ματιά' : 'Roles at a Glance'}
          </Text>
          {ROLES.map((r, i) => (
            <View key={i} style={s.roleRow}>
              <Text style={[s.roleLabel, { color: r.color }]}>{r.label}</Text>
              <Text style={s.roleDesc}>{r.desc}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 24, paddingBottom: 48 },
  back: { color: C.primary, fontSize: 15, fontWeight: '600', marginBottom: 16 },
  title: { fontSize: 34, fontWeight: '900', color: C.textPrimary, marginBottom: 6 },
  sub: { fontSize: 15, color: C.textSecondary, marginBottom: 24 },
  step: {
    flexDirection: 'row',
    backgroundColor: C.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    marginBottom: 10,
    gap: 16,
    alignItems: 'flex-start',
  },
  stepMeta: { alignItems: 'center', gap: 4, width: 40 },
  stepNum: { fontSize: 10, fontWeight: '900', color: C.primary, letterSpacing: 1 },
  stepEmoji: { fontSize: 22 },
  stepContent: { flex: 1, gap: 4 },
  stepTitle: { fontSize: 16, fontWeight: '700', color: C.textPrimary },
  stepDesc: { fontSize: 13, color: C.textSecondary, lineHeight: 19 },
  rolesCard: {
    backgroundColor: C.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 20,
    gap: 16,
    marginTop: 8,
  },
  rolesTitle: { fontSize: 15, fontWeight: '700', color: C.textPrimary, marginBottom: 4 },
  roleRow: { gap: 2 },
  roleLabel: { fontSize: 14, fontWeight: '700' },
  roleDesc: { fontSize: 13, color: C.textSecondary },
});
