import { Component, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { ChallengeApiService } from '../../core/services/challenge-api.service';
import { ChallengeEventsService } from '../../core/services/challenge-events.service';
import { ProgressService } from '../../core/services/progress.service';

@Component({
  selector: 'app-level2',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="level-card">
      <div class="level-header">
        <span class="level-badge">Nivel 2</span>
        <h2>✏️ Modificar JSON</h2>
      </div>
      <div class="objective-box">
        <strong>🎯 Objetivo:</strong> El botón envía un body incorrecto. Usa DevTools para enviarlo correcto.
      </div>
      <div class="model-box">
        <strong>📋 Body esperado por el servidor:</strong>
        <pre>{{ expectedBody }}</pre>
      </div>
      <div class="hint-box">
        <strong>💡 Pista:</strong> Abre DevTools → Network → pulsa el botón → clic derecho en la request
        <code>/api/level-2/submit</code> → "Edit and Resend" → cambia el body al modelo correcto → envía.
        Cuando el servidor la acepte, este nivel se completará automáticamente.
      </div>
      <button class="btn" (click)="sendWrongRequest()">
        ▶ Enviar Request
      </button>
      <div class="feedback" *ngIf="feedback" [class.success]="success" [class.error]="!success">
        {{ feedback }}
      </div>
      <button class="btn btn-success" *ngIf="completed" (click)="goNext()">
        Continuar → Nivel 3
      </button>
    </div>
  `
})
export class Level2Component {
  feedback = '';
  success = false;
  completed = false;
  private readonly destroyRef = inject(DestroyRef);
  private readonly correctBody = { username: 'student', code: 'DEVTOOLS-2024', action: 'submit' };
  expectedBody = JSON.stringify(this.correctBody, null, 2);

  constructor(
    private api: ChallengeApiService,
    private challengeEvents: ChallengeEventsService,
    private progressService: ProgressService,
    private router: Router
  ) {
    this.challengeEvents.events$
      .pipe(
        filter((event) => event.level === 2),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.handleSuccess('✅ ¡Perfecto! La request reenviada desde DevTools fue aceptada.');
      });
  }

  sendWrongRequest(): void {
    this.api.submitLevel2({}).subscribe({
      next: (res) => {
        if (res.success) {
          this.handleSuccess('✅ ¡Correcto! El servidor aceptó el body correcto.');
        } else {
          this.feedback = '❌ El body enviado es incorrecto. Corrígelo con "Edit and Resend" desde DevTools.';
          this.success = false;
        }
      },
      error: () => {
        this.feedback = '❌ El body enviado es incorrecto. Corrígelo con "Edit and Resend" desde DevTools.';
        this.success = false;
      }
    });
  }

  private handleSuccess(message: string): void {
    if (this.completed) {
      return;
    }

    this.feedback = message;
    this.success = true;
    this.completed = true;
    this.progressService.completeLevel(2);
  }

  goNext(): void {
    this.router.navigate(['/nivel-3']);
  }
}
