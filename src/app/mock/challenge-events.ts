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

  void notifyClients(event);
  notifyBroadcastChannel(event);
  notifyWindow(event);
}

async function notifyClients(event: ChallengeEvent): Promise<void> {
  const clientsApi = getClientsApi();
  if (!clientsApi) {
    return;
  }

  try {
    const clients = await clientsApi.matchAll({ type: 'window', includeUncontrolled: true });
    clients.forEach((client) => {
      client.postMessage(event);
    });
  } catch {
    // Ignore environments where the worker clients API is unavailable.
  }
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

function getClientsApi(): ServiceWorkerClientsApi | undefined {
  const scope = globalThis as typeof globalThis & { clients?: ServiceWorkerClientsApi };
  return scope.clients;
}

interface ServiceWorkerClient {
  postMessage(message: ChallengeEvent): void;
}

interface ServiceWorkerClientsApi {
  matchAll(options: { type: 'window'; includeUncontrolled: boolean }): Promise<ServiceWorkerClient[]>;
}
