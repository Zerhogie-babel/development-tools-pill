import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { LeaderboardEntry } from '../models/leaderboard.model';

export interface LeaderboardRepository {
  getEntries(): LeaderboardEntry[];
  addEntry(entry: LeaderboardEntry): void;
}

@Injectable({ providedIn: 'root' })
export class LeaderboardApiService implements LeaderboardRepository {
  constructor(private storage: StorageService) {}

  getEntries(): LeaderboardEntry[] {
    return this.storage.getLeaderboard();
  }

  addEntry(entry: LeaderboardEntry): void {
    this.storage.addLeaderboardEntry(entry);
  }
}
