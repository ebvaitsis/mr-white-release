import { create } from 'zustand';
import { GameState, GameConfig, Player } from '../types';
import { createGame, getEliminated, checkWin, getActivePlayers } from '../engine/gameEngine';

interface Store {
  game: GameState | null;
  startGame: (names: string[], config: GameConfig) => void;
  resetGame: () => void;
  rematch: () => void;
  markViewed: (id: string) => void;
  advanceReveal: () => void;
  eliminatePlayer: (targetId: string) => { gameOver: boolean; mrWhiteEliminated: boolean };
  submitGuess: (guess: string) => boolean;
  nextRound: () => void;
}

export const useStore = create<Store>((set, get) => ({
  game: null,

  startGame: (names, config) => set({ game: createGame(names, config) }),

  resetGame: () => set({ game: null }),

  rematch: () => {
    const g = get().game;
    if (!g) return;
    set({ game: createGame(g.players.map(p => p.name), g.config) });
  },

  markViewed: (id) => set(s => ({
    game: s.game ? {
      ...s.game,
      players: s.game.players.map(p => p.id === id ? { ...p, hasViewedRole: true } : p),
    } : null,
  })),

  advanceReveal: () => set(s => ({
    game: s.game ? { ...s.game, currentRevealIndex: s.game.currentRevealIndex + 1 } : null,
  })),

  eliminatePlayer: (targetId) => {
    const g = get().game;
    if (!g) return { gameOver: false, mrWhiteEliminated: false };

    const eliminated = getEliminated(targetId, g.players);
    if (!eliminated) return { gameOver: false, mrWhiteEliminated: false };

    const updatedPlayers = g.players.map(p =>
      p.id === eliminated.id ? { ...p, isEliminated: true } : p
    );
    const completedRound = { ...g.currentRound, eliminatedPlayerId: eliminated.id };

    if (eliminated.role === 'mrwhite') {
      const allMrWhitesGone = updatedPlayers
        .filter(p => p.role === 'mrwhite')
        .every(p => p.isEliminated);

      if (allMrWhitesGone) {
        set({ game: { ...g, players: updatedPlayers, rounds: [...g.rounds, completedRound], phase: 'mrwhite_guess' } });
        return { gameOver: false, mrWhiteEliminated: true };
      } else {
        const win = checkWin(updatedPlayers);
        if (win.over) {
          set({ game: { ...g, players: updatedPlayers, rounds: [...g.rounds, completedRound], phase: 'game_over', winner: win.winner } });
          return { gameOver: true, mrWhiteEliminated: true };
        }
        set({ game: { ...g, players: updatedPlayers, rounds: [...g.rounds, completedRound], phase: 'elimination' } });
        return { gameOver: false, mrWhiteEliminated: false };
      }
    }

    const win = checkWin(updatedPlayers);
    if (win.over) {
      set({ game: { ...g, players: updatedPlayers, rounds: [...g.rounds, completedRound], phase: 'game_over', winner: win.winner } });
      return { gameOver: true, mrWhiteEliminated: false };
    }

    set({ game: { ...g, players: updatedPlayers, rounds: [...g.rounds, completedRound], phase: 'elimination' } });
    return { gameOver: false, mrWhiteEliminated: false };
  },

  submitGuess: (guess) => {
    const g = get().game;
    if (!g) return false;
    const correct = guess === "__correct__" || guess.trim().toLowerCase() === g.civilianWord.trim().toLowerCase();
    set({ game: { ...g, mrWhiteGuess: guess, phase: 'game_over', winner: correct ? 'mrwhite' : 'civilians' } });
    return correct;
  },

  nextRound: () => set(s => ({
    game: s.game ? {
      ...s.game,
      phase: 'discussion',
      currentRound: { number: s.game.rounds.length + 1, votes: {} },
    } : null,
  })),
}));
