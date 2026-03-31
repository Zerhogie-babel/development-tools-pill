import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { ChallengeApiService } from '../../core/services/challenge-api.service';
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
        el header <code>Cache-Control: no-cache</code> antes de reenviar.
      </div>
      <button class="btn" (click)="sendWrongRequest()">
        ▶ Enviar Request (incorrecta)
      </button>
      <button class="btn btn-secondary" (click)="checkManual()" style="margin-left:8px">
        🔍 Verificar resultado
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
  private readonly correctBody = { token: 'abc123', version: 2 };
  expectedBody = JSON.stringify(this.correctBody, null, 2);

  constructor(
    private api: ChallengeApiService,
    private progressService: ProgressService,
    private router: Router
  ) {}

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
        this.feedback = '❌ Error en la request. Revisa body y headers en DevTools.';
        this.success = false;
      }
    });
  }

  checkManual(): void {
    const headers = new HttpHeaders({ 'Cache-Control': 'no-cache' });
    this.api.validateLevel3(this.correctBody, headers).subscribe({
      next: (res) => {
        if (res.success) { this.handleSuccess(); }
        else {
          this.feedback = `❌ ${res.message}`;
          this.success = false;
        }
      }
    });
  }

  private handleSuccess(): void {
    this.feedback = '✅ ¡Perfecto! Body y header correctos.';
    this.success = true;
    this.completed = true;
    this.progressService.completeLevel(3);
  }

  goNext(): void {
    this.router.navigate(['/nivel-4']);
  }
}
