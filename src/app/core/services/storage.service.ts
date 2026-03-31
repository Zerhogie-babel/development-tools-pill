import { Injectable } from '@angular/core';
import { Progress } from '../models/challenge.model';
import { LeaderboardEntry } from '../models/leaderboard.model';

const PROGRESS_KEY = 'devtools_pill_progress';
const LEADERBOARD_KEY = 'devtools_pill_leaderboard';

@Injectable({ providedIn: 'root' })
export class StorageService {
  getProgress(): Progress {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { levels: {} };
    try { return JSON.parse(raw) as Progress; } catch { return { levels: {} }; }
  }

  saveProgress(progress: Progress): void {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }

  resetProgress(): void {
    localStorage.removeItem(PROGRESS_KEY);
  }

  getLeaderboard(): LeaderboardEntry[] {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    try { return JSON.parse(raw) as LeaderboardEntry[]; } catch { return []; }
  }

  addLeaderboardEntry(entry: LeaderboardEntry): void {
    const current = this.getLeaderboard();
    current.push(entry);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(current));
  }
}
