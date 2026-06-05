import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../src/store';
import { getCategories } from '../src/data/words';
import { C } from '../src/constants';
import { GameConfig } from '../src/types';
import { useSettingsStore } from '../src/store/settingsStore';

function Stepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <View style={s.stepper}>
      <TouchableOpacity
        style={[s.stepBtn, value <= min && s.stepBtnOff]}
        onPress={() => value > min && onChange(value - 1)}
      >
        <Text style={s.stepBtnText}>−</Text>
      </TouchableOpacity>
      <Text style={s.stepVal}>{value}</Text>
      <TouchableOpacity
        style={[s.stepBtn, value >= max && s.stepBtnOff]}
        onPress={() => value < max && onChange(value + 1)}
      >
        <Text style={s.stepBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function SetupScreen() {
  const [playerCount, setPlayerCount] = useState(4);
  const [mrWhiteCount, setMrWhiteCount] = useState(1);
  const [undercoverCount, setUndercoverCount] = useState(0);
  const [categoryId, setCategoryId] = useState('mixed');
  const [mrWhiteHint, setMrWhiteHint] = useState(false);
  const { startGame } = useStore();

  const { language } = useSettingsStore();
  const gr = language === 'gr';

  const maxMrWhite = Math.max(1, Math.floor(playerCount / 3));
  const maxSpecial = Math.floor(playerCount / 2);
  const categories = getCategories(language);
  const hintAvailable = categoryId === 'mixed';

  return (
    <SafeAreaView style={s.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.back}>{gr ? '← Πίσω' : '← Back'}</Text>
        </TouchableOpacity>
        <Text style={s.title}>{gr ? 'Ρυθμίσεις Παιχνιδιού' : 'Game Setup'}</Text>

        <View style={s.langIndicator}>
          <Text style={s.langIndicatorText}>
            {gr ? '🇬🇷 Ελληνικά' : '🇬🇧 English'}
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={s.langChangeHint}>
              {gr ? '(αλλαγή στις ρυθμίσεις)' : '(change on settings)'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Players */}
        <View style={s.card}>
          <Text style={s.cardLabel}>👥 {gr ? 'ΠΑΙΚΤΕΣ' : 'PLAYERS'}</Text>
          <View style={s.row}>
            <Text style={s.rowLabel}>
              {gr ? 'Αριθμός παικτών' : 'Number of players'}
            </Text>
            <Stepper
              value={playerCount}
              min={3}
              max={12}
              onChange={(n) => {
                setPlayerCount(n);
                const newMaxMW = Math.max(1, Math.floor(n / 3));
                const clampedMW = Math.min(mrWhiteCount, newMaxMW);
                setMrWhiteCount(clampedMW);
                setUndercoverCount(
                  Math.min(undercoverCount, Math.floor(n / 2) - clampedMW)
                );
              }}
            />
          </View>
        </View>

        {/* Roles */}
        <View style={s.card}>
          <Text style={s.cardLabel}>🎭 {gr ? 'ΡΟΛΟΙ' : 'ROLES'}</Text>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.rowLabel}>Mr. White</Text>
              <Text style={s.rowSub}>
                {gr ? 'Δεν έχει λέξη — πρέπει να παριστάνει' : 'Gets no word — must bluff'}
              </Text>
            </View>
            <Stepper
              value={mrWhiteCount}
              min={1}
              max={maxMrWhite}
              onChange={(v) => {
                setMrWhiteCount(v);
                setUndercoverCount(
                  Math.min(undercoverCount, maxSpecial - v)
                );
              }}
            />
          </View>
          <View style={s.divider} />
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.rowLabel}>Undercover</Text>
              <Text style={s.rowSub}>
                {gr
                  ? 'Παρόμοια αλλά διαφορετική λέξη'
                  : 'Gets a similar but different word'}
              </Text>
            </View>
            <Stepper
              value={undercoverCount}
              min={0}
              max={Math.max(0, maxSpecial - mrWhiteCount)}
              onChange={setUndercoverCount}
            />
          </View>
        </View>

        {/* Mr. White Hint */}
        <View style={[s.card, !hintAvailable && s.cardDisabled]}>
          <Text style={s.cardLabel}>
            💡 {gr ? 'ΥΠΟΔΕΙΞΗ MR. WHITE' : 'MR. WHITE HINT'}
          </Text>
          <View style={s.row}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text style={[s.rowLabel, !hintAvailable && s.textDisabled]}>
                {gr
                  ? 'Δώσε κατηγορία ως υπόδειξη'
                  : 'Show word category as hint'}
              </Text>
              <Text style={s.rowSub}>
                {hintAvailable
                  ? gr
                    ? 'Ο Mr. White βλέπει την κατηγορία της λέξης'
                    : 'Mr. White sees which category the word is from'
                  : gr
                  ? 'Απενεργοποιείται όταν είναι επιλεγμένη μία κατηγορία'
                  : 'Not available when a single category is selected'}
              </Text>
            </View>
            <Switch
              value={hintAvailable && mrWhiteHint}
              disabled={!hintAvailable}
              onValueChange={setMrWhiteHint}
              trackColor={{ false: C.bgSurface, true: C.primary }}
              thumbColor={C.textPrimary}
            />
          </View>
        </View>

        {/* Category */}
        <View style={s.card}>
          <Text style={s.cardLabel}>
            📦 {gr ? 'ΚΑΤΗΓΟΡΙΑ ΛΕΞΕΩΝ' : 'WORD CATEGORY'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[s.catChip, categoryId === cat.id && s.catChipActive]}
                onPress={() => setCategoryId(cat.id)}
              >
                <Text>{cat.emoji}</Text>
                <Text
                  style={[
                    s.catText,
                    categoryId === cat.id && s.catTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={s.btn}
          onPress={() => {
            const config: GameConfig = {
              playerCount,
              mrWhiteCount,
              undercoverCount,
              categoryId,
              language,
              mrWhiteHint: hintAvailable && mrWhiteHint,
            };
            startGame(Array(playerCount).fill(''), config);
            router.push('/playernames');
          }}
        >
          <Text style={s.btnText}>
            {gr ? 'Συνέχεια →' : 'Continue →'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 24, paddingBottom: 48 },
  back: { color: C.primary, fontSize: 15, fontWeight: '600', marginBottom: 16 },
  title: { fontSize: 34, fontWeight: '900', color: C.textPrimary, marginBottom: 16 },
  langIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.borderActive,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
  },
  langIndicatorText: {
    fontSize: 14,
    fontWeight: '700',
    color: C.primary,
    flex: 1,
  },
  langChangeHint: {
    fontSize: 11,
    color: C.textMuted,
  },
  card: {
    backgroundColor: C.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 20,
    marginBottom: 16,
  },
  cardDisabled: { opacity: 0.5 },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.textMuted,
    letterSpacing: 2,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  rowLabel: { fontSize: 15, color: C.textPrimary, fontWeight: '500' },
  rowSub: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  textDisabled: { color: C.textMuted },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 12 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  stepBtnOff: { opacity: 0.3 },
  stepBtnText: { fontSize: 20, color: C.textPrimary, lineHeight: 22 },
  stepVal: {
    fontSize: 18,
    fontWeight: '700',
    color: C.textPrimary,
    minWidth: 24,
    textAlign: 'center',
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: C.bgSurface,
    borderWidth: 1,
    borderColor: C.border,
    marginRight: 8,
  },
  catChipActive: { backgroundColor: C.primaryGlow, borderColor: C.primary },
  catText: { fontSize: 13, color: C.textSecondary, fontWeight: '500' },
  catTextActive: { color: C.primary },
  btn: {
    backgroundColor: C.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
