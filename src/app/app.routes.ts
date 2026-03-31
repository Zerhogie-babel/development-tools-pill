import { Routes } from '@angular/router';
import { progressGuard } from './core/guards/progress.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'nivel-1',
    loadComponent: () => import('./features/level1/level1.component').then(m => m.Level1Component),
    canActivate: [progressGuard],
    data: { level: 1 }
  },
  {
    path: 'nivel-2',
    loadComponent: () => import('./features/level2/level2.component').then(m => m.Level2Component),
    canActivate: [progressGuard],
    data: { level: 2 }
  },
  {
    path: 'nivel-3',
    loadComponent: () => import('./features/level3/level3.component').then(m => m.Level3Component),
    canActivate: [progressGuard],
    data: { level: 3 }
  },
  {
    path: 'nivel-4',
    loadComponent: () => import('./features/level4/level4.component').then(m => m.Level4Component),
    canActivate: [progressGuard],
    data: { level: 4 }
  },
  {
    path: 'final',
    loadComponent: () => import('./features/final/final.component').then(m => m.FinalComponent),
    canActivate: [progressGuard],
    data: { level: 5 }
  },
  { path: '**', redirectTo: 'home' }
];
