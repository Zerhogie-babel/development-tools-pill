import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Progress } from '../models/challenge.model';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  constructor(private storage: StorageService) {}

  getProgress(): Progress {
    return this.storage.getProgress();
  }

  isLevelCompleted(level: number): boolean {
    const p = this.storage.getProgress();
    return p.levels[level]?.completed === true;
  }

  canAccessLevel(level: number): boolean {
    if (level <= 1) return true;
    return this.isLevelCompleted(level - 1);
  }

  completeLevel(level: number): void {
    const p = this.storage.getProgress();
    p.levels[level] = { completed: true, completedAt: Date.now() };
    this.storage.saveProgress(p);
  }

  getTotalCompleted(): number {
    const p = this.storage.getProgress();
    return Object.values(p.levels).filter(l => l.completed).length;
  }
}
