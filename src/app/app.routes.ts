import { Routes } from '@angular/router';
import { SUPERHEROES_ROUTES } from './features/superheroes/superheroes.routes';

export const appRoutes: Routes = [
  {
    path: '',
    children: SUPERHEROES_ROUTES,
  }
];
