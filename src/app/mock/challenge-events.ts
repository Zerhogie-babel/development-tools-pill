import {
  CHALLENGE_EVENTS_CHANNEL,
  CHALLENGE_EVENTS_WINDOW_EVENT,
  ChallengeEvent,
} from '../core/models/challenge-event.model';

export function notifyChallengeSolved(level: number): void {
  const event: ChallengeEvent = {
    type: 'manual-success',
    level,
    timestamp: Date.now(),
  };

  notifyBroadcastChannel(event);
  notifyWindow(event);
}

function notifyBroadcastChannel(event: ChallengeEvent): void {
  if (typeof BroadcastChannel === 'undefined') {
    return;
  }

  try {
    const channel = new BroadcastChannel(CHALLENGE_EVENTS_CHANNEL);
    channel.postMessage(event);
    channel.close();
  } catch {
    // Ignore environments where BroadcastChannel is unavailable.
  }
}

function notifyWindow(event: ChallengeEvent): void {
  if (typeof window === 'undefined' || typeof CustomEvent === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(CHALLENGE_EVENTS_WINDOW_EVENT, { detail: event }));
}
