import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProgressService } from '../services/progress.service';

export const progressGuard: CanActivateFn = (route) => {
  const progressService = inject(ProgressService);
  const router = inject(Router);
  const level = route.data['level'] as number;
  if (!level || progressService.canAccessLevel(level)) return true;
  return router.createUrlTree(['/']);
};
