export enum Track {
  STUDENT = 'Student',
  YOUNG_ADULT = 'Young Adult'
}

export interface PlayerStats {
  savings: number;
  happiness: number;
  financialResilience: number; // Credit score / future security
  knowledge: number;
}

export interface GameOption {
  id: string;
  text: string;
  consequences: {
    savings?: number;
    happiness?: number;
    financialResilience?: number;
    knowledge?: number;
  };
  feedback: string; // Immediate feedback text
}

export interface Scenario {
  id: string;
  type: 'decision' | 'event' | 'scam';
  title: string;
  description: string;
  options: GameOption[];
  imagePrompt?: string; // For generating placeholder images
}

export interface GameState {
  screen: 'onboarding' | 'tutorial' | 'playing' | 'outcome' | 'summary';
  track: Track | null;
  stats: PlayerStats;
  currentMonth: number;
  history: {
    scenarioTitle: string;
    choiceText: string;
    impact: string;
  }[];
  currentScenario: Scenario | null;
  loading: boolean;
  language: 'en' | 'hi';
}
