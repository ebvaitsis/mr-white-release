export type Role = 'civilian' | 'mrwhite' | 'undercover';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  role?: Role;
  word?: string;
  isEliminated: boolean;
  hasViewedRole: boolean;
}

export interface GameConfig {
  playerCount: number;
  mrWhiteCount: number;
  undercoverCount: number;
  categoryId: string;
  language: 'en' | 'gr';
  mrWhiteHint: boolean;
}

export type GamePhase =
  | 'role_reveal'
  | 'role_card'
  | 'discussion'
  | 'voting'
  | 'elimination'
  | 'mrwhite_guess'
  | 'game_over';

export interface Round {
  number: number;
  votes: Record<string, string>;
  eliminatedPlayerId?: string;
}

export interface GameState {
  phase: GamePhase;
  config: GameConfig;
  players: Player[];
  rounds: Round[];
  currentRound: Round;
  currentRevealIndex: number;
  civilianWord: string;
  undercoverWord: string;
  winner?: 'civilians' | 'mrwhite' | 'undercover';
  mrWhiteGuess?: string;
}

export interface WordPair {
  civilian: string;
  undercover: string;
}

export interface WordCategory {
  id: string;
  name: string;
  emoji: string;
  pairs: WordPair[];
}
