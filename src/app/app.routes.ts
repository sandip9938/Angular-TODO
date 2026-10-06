import { Routes } from '@angular/router';
import { requireLogin, redirectLoggedInUser } from './auth/auth.guard';
import { Login } from './login/login';
import { ToDoList } from './to-do-list/to-do-list';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login, canActivate: [redirectLoggedInUser] },
  { path: 'todos', component: ToDoList, canActivate: [requireLogin] },
  { path: '**', redirectTo: 'login' },
];
