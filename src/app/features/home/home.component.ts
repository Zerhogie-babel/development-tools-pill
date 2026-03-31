import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { ProgressService } from '../../core/services/progress.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgIf],
  template: `
    <div class="level-card">
      <h1>🔧 DevTools Pill</h1>
      <p class="subtitle">Aprende a usar las herramientas de desarrollo del navegador mediante retos prácticos.</p>
      <div class="levels-grid">
        <div class="level-item" [class.completed]="progressService.isLevelCompleted(1)">
          <span class="level-icon">🚫</span>
          <h3>Nivel 1</h3>
          <p>Bloquear Request</p>
          <a routerLink="/nivel-1" class="btn">{{ progressService.isLevelCompleted(1) ? '✅ Completado' : 'Iniciar' }}</a>
        </div>
        <div class="level-item" [class.completed]="progressService.isLevelCompleted(2)" [class.locked]="!progressService.canAccessLevel(2)">
          <span class="level-icon">✏️</span>
          <h3>Nivel 2</h3>
          <p>Modificar JSON</p>
          <a *ngIf="progressService.canAccessLevel(2)" routerLink="/nivel-2" class="btn">{{ progressService.isLevelCompleted(2) ? '✅ Completado' : 'Iniciar' }}</a>
          <span *ngIf="!progressService.canAccessLevel(2)" class="locked-msg">🔒 Completa el Nivel 1</span>
        </div>
        <div class="level-item" [class.completed]="progressService.isLevelCompleted(3)" [class.locked]="!progressService.canAccessLevel(3)">
          <span class="level-icon">📋</span>
          <h3>Nivel 3</h3>
          <p>Editar Body y Header</p>
          <a *ngIf="progressService.canAccessLevel(3)" routerLink="/nivel-3" class="btn">{{ progressService.isLevelCompleted(3) ? '✅ Completado' : 'Iniciar' }}</a>
          <span *ngIf="!progressService.canAccessLevel(3)" class="locked-msg">🔒 Completa el Nivel 2</span>
        </div>
        <div class="level-item" [class.completed]="progressService.isLevelCompleted(4)" [class.locked]="!progressService.canAccessLevel(4)">
          <span class="level-icon">🐢</span>
          <h3>Nivel 4</h3>
          <p>Throttling</p>
          <a *ngIf="progressService.canAccessLevel(4)" routerLink="/nivel-4" class="btn">{{ progressService.isLevelCompleted(4) ? '✅ Completado' : 'Iniciar' }}</a>
          <span *ngIf="!progressService.canAccessLevel(4)" class="locked-msg">🔒 Completa el Nivel 3</span>
        </div>
      </div>
      <div class="final-section" *ngIf="progressService.getTotalCompleted() === 4">
        <a routerLink="/final" class="btn btn-success">🏆 Ver Ranking Final</a>
      </div>
    </div>
  `,
  styles: [`
    .levels-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin: 24px 0;
    }
    .level-item {
      background: #1e2a3a;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
    }
    .level-item.completed { border-color: #4caf50; }
    .level-item.locked { opacity: 0.6; }
    .level-icon { font-size: 2rem; display: block; margin-bottom: 8px; }
    .final-section { text-align: center; margin-top: 24px; }
    .subtitle { color: #94a3b8; margin-bottom: 8px; }
    .locked-msg { color: #94a3b8; font-size: 0.85rem; }
  `]
})
export class HomeComponent {
  constructor(public progressService: ProgressService) {}
}
