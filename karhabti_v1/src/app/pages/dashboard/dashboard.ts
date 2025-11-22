import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Tableau de bord</h1>
        <p class="text-gray-600">Bienvenue, Iyed Akrimi</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid md:grid-cols-4 gap-6 mb-8">
        <div *ngFor="let stat of stats" 
             class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div class="flex items-center justify-between mb-4">
            <div class="text-3xl">{{stat.icon}}</div>
            <span [class]="'px-3 py-1 rounded-full text-sm font-medium ' + stat.badgeClass">
              {{stat.badge}}
            </span>
          </div>
          <div class="text-3xl font-bold text-gray-800 mb-1">{{stat.value}}</div>
          <div class="text-gray-600">{{stat.label}}</div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Left Column (2/3) -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Mes Véhicules -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-800">Mes Véhicules</h2>
              <a routerLink="/vehicles" 
                 class="text-blue-600 hover:text-blue-700 font-medium">
                Voir tout →
              </a>
            </div>
            
            <div class="space-y-4">
              <div *ngFor="let vehicle of vehicles" 
                   class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition cursor-pointer">
                <div class="flex items-center">
                  <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                    🚗
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-gray-800">{{vehicle.brand}} {{vehicle.model}}</h3>
                    <p class="text-gray-600 text-sm">{{vehicle.year}} • {{vehicle.plate}}</p>
                    <div class="flex items-center mt-2 space-x-2">
                      <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {{vehicle.mileage}} km
                      </span>
                      <span [class]="'px-2 py-1 text-xs rounded ' + (vehicle.status === 'ok' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800')">
                        {{vehicle.statusText}}
                      </span>
                    </div>
                  </div>
                  <div class="text-right">
                    <button class="text-gray-400 hover:text-gray-600">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button routerLink="/vehicles" 
                    class="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition">
              + Ajouter un véhicule
            </button>
          </div>

          <!-- Prochains Entretiens -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-800">Prochains Entretiens</h2>
              <a routerLink="/maintenance" 
                 class="text-blue-600 hover:text-blue-700 font-medium">
                Voir tout →
              </a>
            </div>

            <div class="space-y-4">
              <div *ngFor="let maintenance of upcomingMaintenance" 
                   class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div [class]="'w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-4 ' + maintenance.colorClass">
                  {{maintenance.icon}}
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-gray-800">{{maintenance.title}}</h3>
                  <p class="text-gray-600 text-sm">{{maintenance.vehicle}}</p>
                </div>
                <div class="text-right">
                  <div [class]="'font-bold ' + maintenance.urgencyClass">{{maintenance.date}}</div>
                  <div class="text-gray-500 text-sm">{{maintenance.distance}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column (1/3) -->
        <div class="space-y-8">
          <!-- Alertes -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Alertes</h2>
            <div class="space-y-3">
              <div *ngFor="let alert of alerts" 
                   [class]="'p-4 rounded-lg ' + alert.bgClass">
                <div class="flex items-start">
                  <span class="text-2xl mr-3">{{alert.icon}}</span>
                  <div>
                    <h3 class="font-bold text-gray-800 text-sm mb-1">{{alert.title}}</h3>
                    <p class="text-gray-600 text-xs">{{alert.description}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dépenses du mois -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Dépenses du mois</h2>
            <div class="text-center mb-6">
              <div class="text-4xl font-bold text-blue-600 mb-2">450 DT</div>
              <div class="text-gray-600">Novembre 2025</div>
            </div>
            <div class="space-y-3">
              <div *ngFor="let expense of expenses" 
                   class="flex items-center justify-between">
                <div class="flex items-center">
                  <div [class]="'w-10 h-10 rounded-lg flex items-center justify-center mr-3 ' + expense.colorClass">
                    {{expense.icon}}
                  </div>
                  <div>
                    <div class="font-medium text-gray-800">{{expense.category}}</div>
                    <div class="text-gray-500 text-sm">{{expense.date}}</div>
                  </div>
                </div>
                <div class="font-bold text-gray-800">{{expense.amount}} DT</div>
              </div>
            </div>
          </div>

          <!-- Actions Rapides -->
          <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-md p-6 text-white">
            <h2 class="text-xl font-bold mb-4">Actions Rapides</h2>
            <div class="space-y-3">
              <button routerLink="/chatbot" 
                      class="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition">
                <div class="flex items-center">
                  <span class="text-2xl mr-3">🤖</span>
                  <span class="font-medium">Assistant IA</span>
                </div>
              </button>
              <button routerLink="/garages" 
                      class="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition">
                <div class="flex items-center">
                  <span class="text-2xl mr-3">📍</span>
                  <span class="font-medium">Trouver un garage</span>
                </div>
              </button>
              <button routerLink="/infractions" 
                      class="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition">
                <div class="flex items-center">
                  <span class="text-2xl mr-3">🚨</span>
                  <span class="font-medium">Mes infractions</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  stats = [
    { icon: '🚗', value: '2', label: 'Véhicules', badge: 'Actifs', badgeClass: 'bg-green-100 text-green-800' },
    { icon: '🔧', value: '3', label: 'Entretiens', badge: 'À venir', badgeClass: 'bg-orange-100 text-orange-800' },
    { icon: '🚨', value: '1', label: 'Infractions', badge: 'En cours', badgeClass: 'bg-red-100 text-red-800' },
    { icon: '💰', value: '450', label: 'Dépenses (DT)', badge: 'Ce mois', badgeClass: 'bg-blue-100 text-blue-800' }
  ];

  vehicles = [
    {
      brand: 'Peugeot',
      model: '208',
      year: '2019',
      plate: 'TUN 1234',
      mileage: '45000',
      status: 'ok',
      statusText: 'Bon état'
    },
    {
      brand: 'Renault',
      model: 'Clio',
      year: '2021',
      plate: 'TUN 5678',
      mileage: '28000',
      status: 'warning',
      statusText: 'Entretien proche'
    }
  ];

  upcomingMaintenance = [
    {
      icon: '🔧',
      title: 'Vidange moteur',
      vehicle: 'Peugeot 208',
      date: 'Dans 5 jours',
      distance: '500 km',
      colorClass: 'bg-orange-100',
      urgencyClass: 'text-orange-600'
    },
    {
      icon: '🛞',
      title: 'Rotation pneus',
      vehicle: 'Renault Clio',
      date: 'Dans 2 semaines',
      distance: '1200 km',
      colorClass: 'bg-blue-100',
      urgencyClass: 'text-blue-600'
    },
    {
      icon: '🔋',
      title: 'Contrôle batterie',
      vehicle: 'Peugeot 208',
      date: 'Dans 1 mois',
      distance: '2500 km',
      colorClass: 'bg-green-100',
      urgencyClass: 'text-green-600'
    }
  ];

  alerts = [
    {
      icon: '⚠️',
      title: 'Vidange proche',
      description: 'Votre vidange est due dans 500 km',
      bgClass: 'bg-orange-50'
    },
    {
      icon: '🚨',
      title: 'Infraction impayée',
      description: 'Échéance dans 10 jours',
      bgClass: 'bg-red-50'
    }
  ];

  expenses = [
    {
      icon: '🔧',
      category: 'Vidange',
      date: '10 Nov',
      amount: '120',
      colorClass: 'bg-blue-100'
    },
    {
      icon: '⛽',
      category: 'Carburant',
      date: '15 Nov',
      amount: '180',
      colorClass: 'bg-green-100'
    },
    {
      icon: '🚨',
      category: 'Amende',
      date: '12 Nov',
      amount: '150',
      colorClass: 'bg-red-100'
    }
  ];
}