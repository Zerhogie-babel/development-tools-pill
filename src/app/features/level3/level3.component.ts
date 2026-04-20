import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { ChallengeApiService, LEVEL3_REQUIRED_HEADER, LEVEL3_REQUIRED_HEADER_VALUE } from '../../core/services/challenge-api.service';
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
        <strong>🎯 Objetivo:</strong> Este nivel requiere dos overrides: el body de la response
        <em>y</em> añadir un header de respuesta concreto. Ambos deben estar presentes para pasar.
      </div>
      <div class="model-box">
        <strong>📋 Override 1 — Response body:</strong>
        <pre>{{ expectedResponseBody }}</pre>
        <strong>📋 Override 2 — Response header:</strong>
        <pre>{{ requiredHeader }}: {{ requiredHeaderValue }}</pre>
      </div>
      <div class="hint-box">
        <strong>💡 Pista:</strong> DevTools → Sources → Overrides → añade override para
        <code>POST dummyjson.com/posts/add</code>. En el fichero de override pon el body correcto
        en el cuerpo y añade la cabecera <code>{{ requiredHeader }}: {{ requiredHeaderValue }}</code>
        en la sección de headers. Luego pulsa nuevamente "Enviar Request".
      </div>
      <div class="feedback" *ngIf="partialFeedback" [class.error]="true">
        {{ partialFeedback }}
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
  partialFeedback = '';
  success = false;
  completed = false;
  private readonly successResponseBody = { success: true, message: 'override ok' };
  expectedResponseBody = JSON.stringify(this.successResponseBody, null, 2);
  requiredHeader = LEVEL3_REQUIRED_HEADER;
  requiredHeaderValue = LEVEL3_REQUIRED_HEADER_VALUE;

  constructor(
    private api: ChallengeApiService,
    private progressService: ProgressService,
    private router: Router
  ) {}

  sendWrongRequest(): void {
    this.partialFeedback = '';
    this.feedback = '';

    this.api.validateLevel3({}).subscribe({
      next: (res) => {
        if (res.bodySuccess && res.headerPresent) {
          this.handleSuccess();
        } else {
          const missing: string[] = [];
          if (!res.bodySuccess) missing.push('body de la response (success: true)');
          if (!res.headerPresent) missing.push(`header ${LEVEL3_REQUIRED_HEADER}: ${LEVEL3_REQUIRED_HEADER_VALUE}`);
          this.partialFeedback = `❌ Falta: ${missing.join(' · ')}. Completa ambos overrides.`;
          this.success = false;
        }
      },
      error: () => {
        this.feedback = '❌ Error de red. Revisa DevTools y vuelve a enviar.';
        this.success = false;
      }
    });
  }

  private handleSuccess(): void {
    if (this.completed) {
      return;
    }

    this.feedback = '✅ ¡Perfecto! La app recibió una response overrideada válida.';
    this.success = true;
    this.completed = true;
    this.progressService.completeLevel(3);
  }

  goNext(): void {
    this.router.navigate(['/nivel-4']);
  }
}
