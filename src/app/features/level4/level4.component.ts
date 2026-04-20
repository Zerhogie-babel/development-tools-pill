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
    <div class="level-card level4-card">
      <div class="level-header">
        <span class="level-badge">Nivel 4</span>
        <h2>🐢 Throttling</h2>
      </div>
      <div class="objective-box">
        <strong>🎯 Objetivo:</strong> Pulsa "Continuar ahora" mientras la request está cargando.
        Esta vez la descarga viene de un dominio público externo, así que el throttling sí afecta de verdad.
      </div>
      <div class="hint-box">
        <strong>💡 Pista:</strong> Abre DevTools → Network → selecciona "Slow 3G" en el desplegable de
        throttling. Luego pulsa "Iniciar", espera a que aparezca la petición contra
        <code>jsonplaceholder.typicode.com</code> y baja hasta el botón fijo del final antes de que termine.
      </div>
      <button class="btn" (click)="startChallenge()" [disabled]="loading || completed">
        {{ loading ? '⏳ Cargando...' : '▶ Iniciar' }}
      </button>
      <div class="feedback" *ngIf="feedback" [class.success]="success" [class.error]="!success">
        {{ feedback }}
      </div>
      <button class="btn btn-success" *ngIf="completed" (click)="goNext()">
        Continuar → Final
      </button>
    </div>
    <div class="bottom-action" *ngIf="loading">
      <button class="btn btn-warning bottom-btn" (click)="continueNow()">
        ⚡ Continuar ahora
      </button>
    </div>
  `,
  styles: [`
    .level4-card {
      min-height: calc(100vh - 130px);
      padding-bottom: 120px;
    }

    .bottom-action {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 16px;
      display: flex;
      justify-content: center;
      pointer-events: none;
      z-index: 20;
    }

    .bottom-btn {
      min-width: 240px;
      pointer-events: auto;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
    }
  `]
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
      next: (response) => {
        this.loading = false;
        if (this.continuePressed) {
          this.showSuccess();
        } else {
          this.feedback = `❌ La descarga desde ${response.data?.url ?? 'el dominio público'} terminó demasiado rápido. Activa Slow 3G e inténtalo de nuevo.`;
          this.success = false;
        }
      },
      error: () => {
        this.loading = false;
        this.feedback = '❌ La petición pública falló. Revisa tu conexión e inténtalo de nuevo.';
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
