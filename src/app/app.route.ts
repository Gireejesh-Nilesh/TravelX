import { inject } from '@angular/core';
import { CanActivateFn, Routes, Router } from '@angular/router';
import { AuthService } from './shared/auth.service';
import { DestinationsViewAllComponent } from './destinations/destinations-view-all';

const requireAuth: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.user) {
    return true;
  }
  sessionStorage.setItem('auth_return', state.url);
  return router.createUrlTree(['/signin']);
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app-empty-route').then((m) => m.AppEmptyRoute),
    pathMatch: 'full',
  },
  {
    path: 'destinations',
    loadComponent: () => import('./app-empty-route').then((m) => m.AppEmptyRoute),
    pathMatch: 'full',
  },
  {
    path: 'destinations/all',
    loadComponent: () =>
      import('./destinations/destinations-view-all').then((m) => m.DestinationsViewAllComponent),
  },
  {
    path: 'destination/:id',
    loadComponent: () =>
      import('./destinations/destination-detail').then((m) => m.DestinationDetail),
  },
  {
    path: 'activities',
    loadComponent: () => import('./activities/activities-page').then((m) => m.ActivitiesPage),
    canActivate: [requireAuth],
  },
  {
    path: 'book-tour',
    loadComponent: () => import('./book-tour/book-tour-page').then((m) => m.BookTourPage),
  },
  {
    path: 'book-tour/:id',
    loadComponent: () => import('./book-tour/book-tour-page').then((m) => m.BookTourPage),
  },

  {
    path: 'signin',
    loadComponent: () => import('./app-empty-route').then((m) => m.AppEmptyRoute),
  },
  {
    path: 'signup',
    loadComponent: () => import('./app-empty-route').then((m) => m.AppEmptyRoute),
  },

  {
    path: '**',
    loadComponent: () => import('./destinations/placeholder').then((m) => m.Placeholder),
  },
];
