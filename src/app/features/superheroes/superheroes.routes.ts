import { Routes } from '@angular/router';
import { SuperheroesListComponent } from './pages/superheroes-list/superheroes-list.component';

export const SUPERHEROES_ROUTES: Routes = [
  {
    path: '',
    component: SuperheroesListComponent,
    title: 'Lista de Superhéroes',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
