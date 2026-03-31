import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { ChallengeApiService } from '../../core/services/challenge-api.service';
import { ProgressService } from '../../core/services/progress.service';

@Component({
  selector: 'app-level1',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="level-card">
      <div class="level-header">
        <span class="level-badge">Nivel 1</span>
        <h2>🚫 Bloquear Request</h2>
      </div>
      <div class="objective-box">
        <strong>🎯 Objetivo:</strong> Evita que la request de tracking llegue al servidor.
      </div>
      <div class="hint-box">
        <strong>💡 Pista:</strong> Abre DevTools → Network → clic derecho en la request
        <code>/api/level-1/tracker</code> → "Block request URL". Luego vuelve a pulsar el botón.
      </div>
      <button class="btn" (click)="runChallenge()" [disabled]="loading">
        {{ loading ? 'Verificando...' : '▶ Ejecutar Challenge' }}
      </button>
      <div class="feedback" *ngIf="feedback" [class.success]="success" [class.error]="!success">
        {{ feedback }}
      </div>
      <button class="btn btn-success" *ngIf="completed" (click)="goNext()">
        Continuar → Nivel 2
      </button>
    </div>
  `
})
export class Level1Component {
  loading = false;
  feedback = '';
  success = false;
  completed = false;

  constructor(
    private api: ChallengeApiService,
    private progressService: ProgressService,
    private router: Router
  ) {}

  runChallenge(): void {
    this.loading = true;
    this.feedback = '';

    // Fire-and-forget: this request is intentionally not blocked by the user,
    // serving as a baseline "success" call the student can observe in DevTools.
    this.api.checkLevel1().subscribe({ next: () => {}, error: () => {} });

    this.api.trackLevel1().subscribe({
      next: () => {
        this.loading = false;
        this.feedback = '❌ La request de tracking fue completada. Bloquéala desde DevTools e inténtalo de nuevo.';
        this.success = false;
      },
      error: () => {
        this.loading = false;
        this.feedback = '✅ ¡Correcto! La request de tracking fue bloqueada.';
        this.success = true;
        this.completed = true;
        this.progressService.completeLevel(1);
      }
    });
  }

  goNext(): void {
    this.router.navigate(['/nivel-2']);
  }
}
