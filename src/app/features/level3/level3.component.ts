import { Component, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { ChallengeApiService } from '../../core/services/challenge-api.service';
import { ChallengeEventsService } from '../../core/services/challenge-events.service';
import { ProgressService } from '../../core/services/progress.service';

@Component({
  selector: 'app-level3',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="level-card">
      <div class="level-header">
        <span class="level-badge">Nivel 3</span>
        <h2>📋 Editar Body y Header</h2>
      </div>
      <div class="objective-box">
        <strong>🎯 Objetivo:</strong> El servidor necesita el body correcto Y el header <code>Cache-Control: no-cache</code>.
      </div>
      <div class="model-box">
        <strong>📋 Body esperado:</strong>
        <pre>{{ expectedBody }}</pre>
        <strong>📋 Header requerido:</strong>
        <pre>Cache-Control: no-cache</pre>
      </div>
      <div class="hint-box">
        <strong>💡 Pista:</strong> Usa DevTools → Network → "Edit and Resend" para modificar el body Y añadir
        el header <code>Cache-Control: no-cache</code> antes de reenviar. Si el servidor la acepta,
        el nivel se completará automáticamente.
      </div>
      <button class="btn" (click)="sendWrongRequest()">
        ▶ Enviar Request
      </button>
      <div class="feedback" *ngIf="feedback" [class.success]="success" [class.error]="!success">
        {{ feedback }}
      </div>
      <button class="btn btn-success" *ngIf="completed" (click)="goNext()">
        Continuar → Nivel 4
      </button>
    </div>
  `
})
export class Level3Component {
  feedback = '';
  success = false;
  completed = false;
  private readonly destroyRef = inject(DestroyRef);
  private readonly correctBody = { token: 'abc123', version: 2 };
  expectedBody = JSON.stringify(this.correctBody, null, 2);

  constructor(
    private api: ChallengeApiService,
    private challengeEvents: ChallengeEventsService,
    private progressService: ProgressService,
    private router: Router
  ) {
    this.challengeEvents.events$
      .pipe(
        filter((event) => event.level === 3),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.handleSuccess();
      });
  }

  sendWrongRequest(): void {
    this.api.validateLevel3({}).subscribe({
      next: (res) => {
        if (res.success) {
          this.handleSuccess();
        } else {
          this.feedback = `❌ ${res.message}. Modifica el body Y añade el header Cache-Control: no-cache.`;
          this.success = false;
        }
      },
      error: () => {
        this.feedback = '❌ La request sigue siendo inválida. Revisa body y header en DevTools y reenvíala.';
        this.success = false;
      }
    });
  }

  private handleSuccess(): void {
    if (this.completed) {
      return;
    }

    this.feedback = '✅ ¡Perfecto! Body y header correctos.';
    this.success = true;
    this.completed = true;
    this.progressService.completeLevel(3);
  }

  goNext(): void {
    this.router.navigate(['/nivel-4']);
  }
}
