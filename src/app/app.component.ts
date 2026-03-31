import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ProgressService } from './core/services/progress.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="app-header">
      <a routerLink="/home" class="logo">🔧 DevTools Pill</a>
      <span class="progress-info">Completados: {{ progressService.getTotalCompleted() }}/4</span>
    </header>
    <main class="app-main">
      <router-outlet />
    </main>
  `,
  styles: [`
    .app-header {
      background: #1a1a2e;
      color: #e0e0e0;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: monospace;
    }
    .logo {
      font-size: 1.2rem;
      font-weight: bold;
      text-decoration: none;
      color: #4fc3f7;
    }
    .progress-info { font-size: 0.9rem; color: #81c784; }
    .app-main { min-height: calc(100vh - 50px); }
  `]
})
export class AppComponent {
  constructor(public progressService: ProgressService) {}
}
