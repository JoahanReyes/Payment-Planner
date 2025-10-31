import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home.component/home.component';
import { NotFoundComponent } from './Components/not.found.component/not.found.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
