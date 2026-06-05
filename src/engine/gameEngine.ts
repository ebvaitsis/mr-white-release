import { Player, GameConfig, GameState, Round, Role } from '../types';
import { AVATARS } from '../constants';
import { getRandomPair } from '../data/words';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createGame(playerNames: string[], config: GameConfig): GameState {
  const lang = config.language ?? 'en';
  const pair = getRandomPair(config.categoryId, lang);
  const total = playerNames.length;
  const { mrWhiteCount, undercoverCount } = config;

  const roles: Role[] = [
    ...Array(mrWhiteCount).fill('mrwhite' as Role),
    ...Array(undercoverCount).fill('undercover' as Role),
    ...Array(total - mrWhiteCount - undercoverCount).fill('civilian' as Role),
  ];
  const shuffledRoles = shuffle(roles);
  const shuffledAvatars = shuffle([...AVATARS]);

  const players: Player[] = playerNames.map((name, i) => {
    const role = shuffledRoles[i];
    return {
      id: uid(),
      name,
      avatar: shuffledAvatars[i % shuffledAvatars.length],
      role,
      word: role === 'civilian' ? pair.civilian : role === 'undercover' ? pair.undercover : undefined,
      isEliminated: false,
      hasViewedRole: false,
    };
  });

  return {
    phase: 'role_reveal',
    config,
    players,
    rounds: [],
    currentRound: { number: 1, votes: {} },
    currentRevealIndex: 0,
    civilianWord: pair.civilian,
    undercoverWord: pair.undercover,
  };
}

export function getActivePlayers(players: Player[]) {
  return players.filter(p => !p.isEliminated);
}

export function tallyVotes(votes: Record<string, string>, players: Player[]) {
  const active = getActivePlayers(players);
  const tally: Record<string, number> = {};
  active.forEach(p => { tally[p.id] = 0; });
  Object.values(votes).forEach(tid => { if (tally[tid] !== undefined) tally[tid]++; });
  return Object.entries(tally)
    .map(([id, count]) => ({ id, count, player: players.find(p => p.id === id)! }))
    .sort((a, b) => b.count - a.count);
}

export function getEliminated(eliminatedId: string, players: Player[]) {
  return players.find(p => p.id === eliminatedId) ?? null;
}

export function checkWin(players: Player[]): { over: boolean; winner?: 'civilians' | 'mrwhite' } {
  const active = getActivePlayers(players);
  const activeMW = active.filter(p => p.role === 'mrwhite');
  const activeOthers = active.filter(p => p.role !== 'mrwhite');

  const allMWElim = players.filter(p => p.role === 'mrwhite').every(p => p.isEliminated);
  if (allMWElim) return { over: true, winner: 'civilians' };

  if (activeMW.length > 0 && activeMW.length > activeOthers.length) {
    return { over: true, winner: 'mrwhite' };
  }

  if (active.length <= 2 && activeMW.length > 0) {
    return { over: true, winner: 'mrwhite' };
  }

  return { over: false };
}
