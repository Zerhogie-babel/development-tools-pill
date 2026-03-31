import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaderboardApiService } from '../../core/services/leaderboard-api.service';
import { ProgressService } from '../../core/services/progress.service';
import { StorageService } from '../../core/services/storage.service';
import { LeaderboardEntry } from '../../core/models/leaderboard.model';

@Component({
  selector: 'app-final',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, FormsModule],
  template: `
    <div class="level-card">
      <h2>🏆 ¡Felicidades!</h2>
      <p>Has completado todos los niveles. Introduce tu nombre para el ranking.</p>
      <div class="name-form" *ngIf="!submitted">
        <input class="input" type="text" [(ngModel)]="playerName" placeholder="Tu nombre" maxlength="30" />
        <button class="btn btn-success" (click)="saveScore()" [disabled]="!playerName.trim()">
          💾 Guardar
        </button>
      </div>
      <div *ngIf="submitted" class="feedback success">
        ✅ ¡Guardado! Gracias por participar, {{ playerName }}.
      </div>
      <h3>📋 Ranking</h3>
      <div class="leaderboard">
        <div class="leaderboard-entry" *ngFor="let entry of entries; let i = index">
          <span class="rank">{{ i + 1 }}</span>
          <span class="name">{{ entry.name }}</span>
          <span class="levels">{{ entry.levelsCompleted }}/4 niveles</span>
          <span class="date">{{ entry.completedAt | date:'short' }}</span>
        </div>
        <p *ngIf="entries.length === 0" class="empty">Aún no hay entradas en el ranking.</p>
      </div>
    </div>
  `,
  styles: [`
    .name-form { display: flex; gap: 8px; margin: 16px 0; }
    .input { flex: 1; padding: 8px 12px; background: #1e2a3a; border: 1px solid #334155; color: #e0e0e0; border-radius: 4px; font-size: 1rem; }
    .leaderboard { margin-top: 16px; }
    .leaderboard-entry {
      display: flex; gap: 12px; align-items: center;
      padding: 8px 12px; background: #1e2a3a; border-radius: 4px; margin-bottom: 6px;
    }
    .rank { font-weight: bold; color: #ffd700; min-width: 24px; }
    .name { flex: 1; }
    .levels { color: #81c784; font-size: 0.85rem; }
    .date { color: #94a3b8; font-size: 0.8rem; }
    .empty { color: #94a3b8; }
  `]
})
export class FinalComponent implements OnInit {
  playerName = '';
  submitted = false;
  entries: LeaderboardEntry[] = [];

  constructor(
    private leaderboard: LeaderboardApiService,
    private progressService: ProgressService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    const p = this.storage.getProgress();
    if (p.playerName) {
      this.playerName = p.playerName;
      this.submitted = true;
    }
    this.entries = this.leaderboard.getEntries();
  }

  saveScore(): void {
    const entry: LeaderboardEntry = {
      name: this.playerName.trim(),
      completedAt: Date.now(),
      levelsCompleted: this.progressService.getTotalCompleted()
    };
    this.leaderboard.addEntry(entry);
    const p = this.storage.getProgress();
    p.playerName = this.playerName.trim();
    this.storage.saveProgress(p);
    this.submitted = true;
    this.entries = this.leaderboard.getEntries();
  }
}
