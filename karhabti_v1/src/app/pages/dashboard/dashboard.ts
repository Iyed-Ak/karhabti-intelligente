import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { VehicleService } from '../../services/vehicle';
import { MaintenanceService } from '../../services/maintenance';
import { InfractionService } from '../../services/infraction';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Tableau de bord</h1>
        <p class="text-gray-600">Bienvenue, {{currentUser?.name || 'Utilisateur'}}</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div class="flex items-center justify-between mb-4">
            <div class="text-3xl">🚗</div>
            <span class="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Actifs
            </span>
          </div>
          <div class="text-3xl font-bold text-gray-800 mb-1">{{vehicles.length}}</div>
          <div class="text-gray-600">Véhicules</div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div class="flex items-center justify-between mb-4">
            <div class="text-3xl">🔧</div>
            <span class="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
              À venir
            </span>
          </div>
          <div class="text-3xl font-bold text-gray-800 mb-1">{{upcomingMaintenances.length}}</div>
          <div class="text-gray-600">Entretiens</div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div class="flex items-center justify-between mb-4">
            <div class="text-3xl">🚨</div>
            <span class="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              En cours
            </span>
          </div>
          <div class="text-3xl font-bold text-gray-800 mb-1">{{pendingInfractions.length}}</div>
          <div class="text-gray-600">Infractions</div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div class="flex items-center justify-between mb-4">
            <div class="text-3xl">💰</div>
            <span class="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Total
            </span>
          </div>
          <div class="text-3xl font-bold text-gray-800 mb-1">{{totalInfractionAmount}}</div>
          <div class="text-gray-600">Amendes (DT)</div>
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
              <a routerLink="/vehicles" class="text-blue-600 hover:text-blue-700 font-medium">
                Voir tout →
              </a>
            </div>
            
            <div *ngIf="vehicles.length === 0" class="text-center py-8">
              <div class="text-4xl mb-2">🚗</div>
              <p class="text-gray-600">Aucun véhicule enregistré</p>
              <a routerLink="/vehicles" class="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block">
                Ajouter un véhicule
              </a>
            </div>

            <div class="space-y-4">
              <div *ngFor="let vehicle of vehicles.slice(0, 3)" 
                   class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition cursor-pointer">
                <div class="flex items-center">
                  <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                    🚗
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-gray-800">{{vehicle.brand}} {{vehicle.model}}</h3>
                    <p class="text-gray-600 text-sm">{{vehicle.year}} • {{vehicle.licensePlate}}</p>
                    <div class="flex items-center mt-2 space-x-2">
                      <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {{vehicle.mileage}} km
                      </span>
                      <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        Bon état
                      </span>
                    </div>
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
              <a routerLink="/maintenance" class="text-blue-600 hover:text-blue-700 font-medium">
                Voir tout →
              </a>
            </div>

            <div *ngIf="upcomingMaintenances.length === 0" class="text-center py-8">
              <div class="text-4xl mb-2">🔧</div>
              <p class="text-gray-600">Aucun entretien planifié</p>
            </div>

            <div class="space-y-4">
              <div *ngFor="let maintenance of upcomingMaintenances.slice(0, 3)" 
                   class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl mr-4">
                  🔧
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-gray-800">{{maintenance.type}}</h3>
                  <p class="text-gray-600 text-sm">{{maintenance.vehicleId?.brand}} {{maintenance.vehicleId?.model}}</p>
                </div>
                <div class="text-right">
                  <div class="font-bold text-orange-600">{{formatDate(maintenance.scheduledDate)}}</div>
                  <div class="text-gray-500 text-sm">{{maintenance.estimatedMileage}} km</div>
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
              <div *ngIf="pendingInfractions.length > 0" class="p-4 rounded-lg bg-red-50">
                <div class="flex items-start">
                  <span class="text-2xl mr-3">🚨</span>
                  <div>
                    <h3 class="font-bold text-gray-800 text-sm mb-1">Infractions impayées</h3>
                    <p class="text-gray-600 text-xs">{{pendingInfractions.length}} infraction(s) en attente</p>
                  </div>
                </div>
              </div>

              <div *ngIf="upcomingMaintenances.length > 0" class="p-4 rounded-lg bg-orange-50">
                <div class="flex items-start">
                  <span class="text-2xl mr-3">⚠️</span>
                  <div>
                    <h3 class="font-bold text-gray-800 text-sm mb-1">Entretien proche</h3>
                    <p class="text-gray-600 text-xs">{{upcomingMaintenances.length}} entretien(s) à venir</p>
                  </div>
                </div>
              </div>

              <div *ngIf="pendingInfractions.length === 0 && upcomingMaintenances.length === 0" 
                   class="text-center py-4 text-gray-500">
                <div class="text-3xl mb-2">✅</div>
                <p class="text-sm">Aucune alerte</p>
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
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  vehicles: any[] = [];
  upcomingMaintenances: any[] = [];
  pendingInfractions: any[] = [];
  totalInfractionAmount: number = 0;

  constructor(
    private authService: AuthService,
    private vehicleService: VehicleService,
    private maintenanceService: MaintenanceService,
    private infractionService: InfractionService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadDashboardData();
  }

  loadUserData() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  loadDashboardData() {
    // Charger les véhicules
    this.vehicleService.loadVehicles().subscribe({
      next: () => {
        this.vehicleService.vehicles$.subscribe(vehicles => {
          this.vehicles = vehicles;
        });
      },
      error: (error) => console.error('Erreur chargement véhicules:', error)
    });

    // Charger les entretiens
    this.maintenanceService.loadMaintenances().subscribe({
      next: () => {
        this.upcomingMaintenances = this.maintenanceService.getUpcomingMaintenances();
      },
      error: (error) => console.error('Erreur chargement entretiens:', error)
    });

    // Charger les infractions
    this.infractionService.loadInfractions().subscribe({
      next: () => {
        this.pendingInfractions = this.infractionService.getPendingInfractions();
        this.totalInfractionAmount = this.infractionService.getTotalAmount();
      },
      error: (error) => console.error('Erreur chargement infractions:', error)
    });
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return 'Aujourd\'hui';
    if (diff === 1) return 'Demain';
    if (diff > 1 && diff < 7) return `Dans ${diff} jours`;
    
    return d.toLocaleDateString('fr-FR');
  }
}