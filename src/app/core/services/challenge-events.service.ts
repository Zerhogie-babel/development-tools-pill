import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  CHALLENGE_EVENTS_CHANNEL,
  CHALLENGE_EVENTS_WINDOW_EVENT,
  ChallengeEvent,
} from '../models/challenge-event.model';

@Injectable({ providedIn: 'root' })
export class ChallengeEventsService implements OnDestroy {
  private readonly eventsSubject = new Subject<ChallengeEvent>();
  readonly events$: Observable<ChallengeEvent> = this.eventsSubject.asObservable();

  private readonly broadcastChannel = this.createBroadcastChannel();
  private lastEventKey = '';
  private readonly serviceWorkerListener = (event: MessageEvent<unknown>): void => {
    this.publish(event.data);
  };
  private readonly windowListener = (event: Event): void => {
    this.publish((event as CustomEvent<ChallengeEvent>).detail);
  };

  constructor() {
    if (this.broadcastChannel) {
      this.broadcastChannel.onmessage = (event: MessageEvent<unknown>) => {
        this.publish(event.data);
      };
    }

    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', this.serviceWorkerListener);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener(CHALLENGE_EVENTS_WINDOW_EVENT, this.windowListener as EventListener);
    }
  }

  ngOnDestroy(): void {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.removeEventListener('message', this.serviceWorkerListener);
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener(CHALLENGE_EVENTS_WINDOW_EVENT, this.windowListener as EventListener);
    }

    this.broadcastChannel?.close();
    this.eventsSubject.complete();
  }

  private publish(data: unknown): void {
    if (!isChallengeEvent(data)) {
      return;
    }

    const eventKey = `${data.type}:${data.level}:${data.timestamp}`;
    if (eventKey === this.lastEventKey) {
      return;
    }

    this.lastEventKey = eventKey;
    this.eventsSubject.next(data);
  }

  private createBroadcastChannel(): BroadcastChannel | undefined {
    if (typeof BroadcastChannel === 'undefined') {
      return undefined;
    }

    try {
      return new BroadcastChannel(CHALLENGE_EVENTS_CHANNEL);
    } catch {
      return undefined;
    }
  }
}

function isChallengeEvent(value: unknown): value is ChallengeEvent {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const event = value as Partial<ChallengeEvent>;

  return (
    event.type === 'manual-success' &&
    typeof event.level === 'number' &&
    typeof event.timestamp === 'number'
  );
}
