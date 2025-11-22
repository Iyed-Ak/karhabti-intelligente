import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'vehicles',
    loadComponent: () => import('./pages/vehicles/vehicles').then(m => m.VehiclesComponent)
  },
  {
    path: 'maintenance',
    loadComponent: () => import('./pages/maintenance/maintenance').then(m => m.MaintenanceComponent)
  },
  {
    path: 'infractions',
    loadComponent: () => import('./pages/infractions/infractions').then(m => m.InfractionsComponent)
  },
  {
    path: 'chatbot',
    loadComponent: () => import('./pages/chatbot/chatbot').then(m => m.ChatbotComponent)
  },
  {
    path: 'garages',
    loadComponent: () => import('./pages/garages/garages').then(m => m.GaragesComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];