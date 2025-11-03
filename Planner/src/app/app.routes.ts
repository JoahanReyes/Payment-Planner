import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home.component/home.component';
import { NotFoundComponent } from './Components/not.found.component/not.found.component';
import { DebtComponent } from './Components/debt-component/debt-component';
import { InOutComponent } from './Components/in-out-component/in-out-component';
import { PlannerComponent } from './Components/planner-component/planner-component';
import { SettingsComponent } from './Components/settings-component/settings-component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'Dashboard',
    pathMatch: 'full',
  },
  {
    path: 'Dashboard',
    component: HomeComponent,
  },
  {
    path: 'Deudas',
    component: DebtComponent,
  },
  {
    path: 'Ingresos-Egresos',
    component: InOutComponent,
  },
  {
    path: 'Planificador',
    component: PlannerComponent,
  },
  {
    path: 'Ajustes',
    component: SettingsComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
