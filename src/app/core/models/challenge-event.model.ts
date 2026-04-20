export interface ChallengeEvent {
  type: 'manual-success';
  level: number;
  timestamp: number;
}

export const CHALLENGE_EVENTS_CHANNEL = 'devtools-pill-challenges';
export const CHALLENGE_EVENTS_WINDOW_EVENT = 'devtools-pill:challenge-event';
