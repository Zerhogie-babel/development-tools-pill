import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { ChallengeApiService } from '../../core/services/challenge-api.service';
import { ProgressService } from '../../core/services/progress.service';

@Component({
  selector: 'app-level4',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="level-card">
      <div class="level-header">
        <span class="level-badge">Nivel 4</span>
        <h2>🐢 Throttling</h2>
      </div>
      <div class="objective-box">
        <strong>🎯 Objetivo:</strong> Pulsa "Continuar ahora" mientras la request está cargando.
        Necesitas usar Throttling en DevTools para ralentizar la conexión.
      </div>
      <div class="hint-box">
        <strong>💡 Pista:</strong> Abre DevTools → Network → selecciona "Slow 3G" en el desplegable de
        throttling. Luego pulsa "Iniciar" y rápidamente pulsa "Continuar ahora" antes de que termine.
      </div>
      <button class="btn" (click)="startChallenge()" [disabled]="loading || completed">
        {{ loading ? '⏳ Cargando...' : '▶ Iniciar' }}
      </button>
      <button class="btn btn-warning" *ngIf="loading" (click)="continueNow()" style="margin-left:8px">
        ⚡ Continuar ahora
      </button>
      <div class="feedback" *ngIf="feedback" [class.success]="success" [class.error]="!success">
        {{ feedback }}
      </div>
      <button class="btn btn-success" *ngIf="completed" (click)="goNext()">
        Continuar → Final
      </button>
    </div>
  `
})
export class Level4Component {
  loading = false;
  feedback = '';
  success = false;
  completed = false;
  private continuePressed = false;

  constructor(
    private api: ChallengeApiService,
    private progressService: ProgressService,
    private router: Router
  ) {}

  startChallenge(): void {
    this.loading = true;
    this.continuePressed = false;
    this.feedback = '';

    this.api.pingLevel4().subscribe({
      next: () => {
        this.loading = false;
        if (this.continuePressed) {
          this.showSuccess();
        } else {
          this.feedback = '❌ La request terminó demasiado rápido. Activa Slow 3G en DevTools e inténtalo de nuevo.';
          this.success = false;
        }
      },
      error: () => {
        this.loading = false;
        this.feedback = '❌ Error en la request.';
        this.success = false;
      }
    });
  }

  continueNow(): void {
    this.continuePressed = true;
    this.feedback = '⏳ Esperando respuesta del servidor...';
  }

  private showSuccess(): void {
    this.feedback = '✅ ¡Perfecto! Usaste el throttling correctamente.';
    this.success = true;
    this.completed = true;
    this.progressService.completeLevel(4);
  }

  goNext(): void {
    this.router.navigate(['/final']);
  }
}
