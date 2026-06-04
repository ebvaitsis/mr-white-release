import { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../src/store';
import { C, AVATARS } from '../src/constants';

const FUN_NAMES = ['Shadow','Phantom','Ghost','Viper','Raven','Storm','Blaze','Nova','Cipher','Void','Echo','Frost'];

export default function PlayerNamesScreen() {
  const { game, startGame } = useStore();
  const config = game?.config;
  const count = config?.playerCount ?? 4;
  const [names, setNames] = useState<string[]>(Array(count).fill(''));
  const refs = useRef<TextInput[]>([]);

  const update = (i: number, v: string) => setNames(prev => { const n = [...prev]; n[i] = v; return n; });
  const randomize = (i: number) => update(i, FUN_NAMES[Math.floor(Math.random() * FUN_NAMES.length)]);
  const canStart = names.every(n => n.trim().length > 0);

  const gr = config?.language === 'gr';

  const handleStart = () => {
    if (!canStart || !config) return;
    startGame(names, config);
    router.replace('/game/rolerevealhub');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={s.container}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={s.back}>{gr ? '← Πίσω' : '← Back'}</Text>
          </TouchableOpacity>
          <Text style={s.title}>{gr ? 'Ποιοι παίζουν;' : "Who's Playing?"}</Text>
          <Text style={s.sub}>
            {gr ? `${count} παίκτες — γράψτε τα ονόματά σας` : `${count} players — enter your names`}
          </Text>

          <View style={s.list}>
            {Array.from({ length: count }).map((_, i) => (
              <View key={i} style={s.playerRow}>
                <Text style={s.avatar}>{AVATARS[i % AVATARS.length]}</Text>
                <TextInput
                  ref={r => { if (r) refs.current[i] = r; }}
                  style={s.input}
                  value={names[i]}
                  onChangeText={v => update(i, v)}
                  placeholder={gr ? `Παίκτης ${i + 1}` : `Player ${i + 1}`}
                  placeholderTextColor={C.textMuted}
                  autoCapitalize="words"
                  returnKeyType={i < count - 1 ? 'next' : 'done'}
                  onSubmitEditing={() => refs.current[i + 1]?.focus()}
                  maxLength={16}
                />
                <TouchableOpacity onPress={() => randomize(i)} style={s.dice}>
                  <Text style={{ fontSize: 20 }}>🎲</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[s.btn, !canStart && s.btnDisabled]}
            onPress={handleStart}
            disabled={!canStart}
          >
            <Text style={s.btnText}>
              {canStart
                ? gr ? 'Ας παίξουμε!' : "Let's Play!"
                : gr ? `Συμπλήρωσε ${count} ονόματα` : `Fill all ${count} names`}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 24, paddingBottom: 48 },
  back: { color: C.primary, fontSize: 15, fontWeight: '600', marginBottom: 16 },
  title: { fontSize: 34, fontWeight: '900', color: C.textPrimary, marginBottom: 6 },
  sub: { fontSize: 15, color: C.textSecondary, marginBottom: 24 },
  list: { gap: 10, marginBottom: 32 },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },
  avatar: { fontSize: 24 },
  input: { flex: 1, fontSize: 16, fontWeight: '600', color: C.textPrimary },
  dice: { padding: 4 },
  btn: { backgroundColor: C.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
