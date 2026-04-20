import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { ChallengeApiService } from '../../core/services/challenge-api.service';
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
        <strong>🎯 Objetivo:</strong> El botón envía una request incorrecta. Debes overridear la response en DevTools para devolver <code>success: true</code>.
      </div>
      <div class="model-box">
        <strong>📋 Response esperada por la app:</strong>
        <pre>{{ expectedResponse }}</pre>
      </div>
      <div class="hint-box">
        <strong>💡 Pista:</strong> Abre DevTools → Network → pulsa el botón → selecciona la request
        <code>https://jsonplaceholder.typicode.com/posts</code> → usa local overrides para modificar la response y que devuelva
        <code>success: true, message: override ok</code>. Luego pulsa de nuevo "Enviar Request".
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
  private readonly successResponse = { success: true, message: 'override ok' };
  expectedResponse = JSON.stringify(this.successResponse, null, 2);

  constructor(
    private api: ChallengeApiService,
    private progressService: ProgressService,
    private router: Router
  ) {}

  sendWrongRequest(): void {
    this.api.submitLevel2({}).subscribe({
      next: (res) => {
        if (res.success) {
          this.handleSuccess('✅ ¡Correcto! La app recibió una response overrideada válida.');
        } else {
          this.feedback = '❌ Response no overrideada todavía. Modifica la response en DevTools y vuelve a enviar.';
          this.success = false;
        }
      },
      error: () => {
        this.feedback = '❌ Error de red. Revisa DevTools y vuelve a enviar.';
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
