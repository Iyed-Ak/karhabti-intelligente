import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Carnet d'Entretien</h1>
          <p class="text-gray-600">Suivez et planifiez l'entretien de vos véhicules</p>
        </div>
        <button (click)="showAddModal = true" 
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          + Nouvel entretien
        </button>
      </div>

      <!-- Vehicle Selector -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <label class="block text-gray-700 font-medium mb-3">Sélectionner un véhicule</label>
        <div class="grid md:grid-cols-3 gap-4">
          <button *ngFor="let vehicle of vehicles" 
                  (click)="selectedVehicle = vehicle"
                  [class]="'p-4 rounded-lg border-2 transition ' + 
                          (selectedVehicle.id === vehicle.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300')">
            <div class="flex items-center">
              <span class="text-3xl mr-3">🚗</span>
              <div class="text-left">
                <div class="font-bold text-gray-800">{{vehicle.brand}} {{vehicle.model}}</div>
                <div class="text-gray-600 text-sm">{{vehicle.plate}}</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid md:grid-cols-4 gap-6 mb-8">
        <div *ngFor="let stat of stats" class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between mb-3">
            <span class="text-3xl">{{stat.icon}}</span>
            <span [class]="'text-2xl font-bold ' + stat.colorClass">{{stat.value}}</span>
          </div>
          <div class="text-gray-600">{{stat.label}}</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-xl shadow-md mb-8">
        <div class="border-b border-gray-200">
          <div class="flex">
            <button *ngFor="let tab of tabs" 
                    (click)="activeTab = tab.id"
                    [class]="'px-6 py-4 font-medium transition ' + 
                            (activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800')">
              {{tab.label}} <span class="ml-2 px-2 py-1 bg-gray-100 rounded text-sm">{{tab.count}}</span>
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Upcoming Maintenance -->
          <div *ngIf="activeTab === 'upcoming'">
            <div class="space-y-4">
              <div *ngFor="let maintenance of upcomingMaintenance" 
                   class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div class="flex items-center justify-between">
                  <div class="flex items-center flex-1">
                    <div [class]="'w-14 h-14 rounded-lg flex items-center justify-center text-2xl mr-4 ' + maintenance.colorClass">
                      {{maintenance.icon}}
                    </div>
                    <div class="flex-1">
                      <h3 class="font-bold text-gray-800 text-lg">{{maintenance.title}}</h3>
                      <p class="text-gray-600">{{maintenance.description}}</p>
                      <div class="flex items-center space-x-4 mt-2">
                        <span class="text-sm text-gray-500">📅 {{maintenance.date}}</span>
                        <span class="text-sm text-gray-500">📏 {{maintenance.mileage}} km</span>
                        <span [class]="'text-sm font-medium ' + maintenance.urgencyClass">
                          {{maintenance.urgency}}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button class="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition">
                      ✓ Fait
                    </button>
                    <button class="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                      Modifier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- History -->
          <div *ngIf="activeTab === 'history'">
            <div class="space-y-4">
              <div *ngFor="let history of maintenanceHistory" 
                   class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl mr-4">
                    ✓
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-gray-800">{{history.title}}</h3>
                    <p class="text-gray-600 text-sm">{{history.date}} • {{history.mileage}} km</p>
                    <p class="text-gray-500 text-sm mt-1">{{history.garage}}</p>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-gray-800">{{history.cost}} DT</div>
                    <button class="text-blue-600 hover:text-blue-700 text-sm mt-1">
                      Voir détails →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recommendations -->
          <div *ngIf="activeTab === 'recommendations'">
            <div class="space-y-4">
              <div *ngFor="let rec of recommendations" 
                   [class]="'border-l-4 rounded-lg p-4 ' + rec.borderClass + ' ' + rec.bgClass">
                <div class="flex items-start">
                  <span class="text-2xl mr-3">{{rec.icon}}</span>
                  <div class="flex-1">
                    <h3 class="font-bold text-gray-800">{{rec.title}}</h3>
                    <p class="text-gray-600 mt-1">{{rec.description}}</p>
                    <button class="mt-3 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
                      Planifier maintenant
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Maintenance Modal -->
      <div *ngIf="showAddModal" 
           class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-800">Nouvel Entretien</h2>
              <button (click)="showAddModal = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form (ngSubmit)="addMaintenance()" #maintenanceForm="ngForm" class="space-y-4">
              <div>
                <label class="block text-gray-700 font-medium mb-2">Type d'entretien</label>
                <select name="type" [(ngModel)]="newMaintenance.type" required
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Sélectionner...</option>
                  <option value="vidange">Vidange moteur</option>
                  <option value="filtres">Changement filtres</option>
                  <option value="pneus">Rotation/Changement pneus</option>
                  <option value="freins">Révision freins</option>
                  <option value="batterie">Contrôle batterie</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Date prévue</label>
                  <input type="date" name="date" [(ngModel)]="newMaintenance.date" required
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                </div>
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Kilométrage prévu</label>
                  <input type="number" name="mileage" [(ngModel)]="newMaintenance.mileage" required
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                         placeholder="50000">
                </div>
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">Notes</label>
                <textarea name="notes" [(ngModel)]="newMaintenance.notes" rows="3"
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Détails supplémentaires..."></textarea>
              </div>

              <div class="flex space-x-4 pt-4">
                <button type="button" (click)="showAddModal = false"
                        class="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  Annuler
                </button>
                <button type="submit" [disabled]="!maintenanceForm.valid"
                        class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MaintenanceComponent {
  showAddModal = false;
  activeTab = 'upcoming';
  
  vehicles = [
    { id: 1, brand: 'Peugeot', model: '208', plate: 'TUN 1234' },
    { id: 2, brand: 'Renault', model: 'Clio', plate: 'TUN 5678' }
  ];
  
  selectedVehicle = this.vehicles[0];

  stats = [
    { icon: '🔧', value: '3', label: 'À venir', colorClass: 'text-orange-600' },
    { icon: '✓', value: '12', label: 'Terminés', colorClass: 'text-green-600' },
    { icon: '💰', value: '2.4k', label: 'Dépensés (DT)', colorClass: 'text-blue-600' },
    { icon: '📅', value: '5j', label: 'Prochain', colorClass: 'text-red-600' }
  ];

  tabs = [
    { id: 'upcoming', label: 'À venir', count: 3 },
    { id: 'history', label: 'Historique', count: 12 },
    { id: 'recommendations', label: 'Recommandations', count: 2 }
  ];

  upcomingMaintenance = [
    {
      icon: '🔧',
      title: 'Vidange moteur',
      description: 'Changement huile moteur + filtre à huile',
      date: 'Dans 5 jours',
      mileage: '50000',
      urgency: 'Urgent',
      urgencyClass: 'text-red-600',
      colorClass: 'bg-orange-100'
    },
    {
      icon: '🛞',
      title: 'Rotation pneus',
      description: 'Permutation des pneus avant/arrière',
      date: 'Dans 2 semaines',
      mileage: '51000',
      urgency: 'Bientôt',
      urgencyClass: 'text-orange-600',
      colorClass: 'bg-blue-100'
    }
  ];

  maintenanceHistory = [
    {
      title: 'Vidange complète',
      date: '15 Oct 2025',
      mileage: '45000',
      garage: 'Garage Central Tunis',
      cost: '150'
    },
    {
      title: 'Changement plaquettes de frein',
      date: '20 Sep 2025',
      mileage: '43000',
      garage: 'Auto Service Ben Arous',
      cost: '280'
    }
  ];

  recommendations = [
    {
      icon: '💡',
      title: 'Contrôle climatisation recommandé',
      description: 'Il est conseillé de vérifier le système de climatisation avant l\'été',
      borderClass: 'border-blue-500',
      bgClass: 'bg-blue-50'
    },
    {
      icon: '⚠️',
      title: 'Vérification batterie',
      description: 'Votre batterie a plus de 3 ans, un contrôle est recommandé',
      borderClass: 'border-orange-500',
      bgClass: 'bg-orange-50'
    }
  ];

  newMaintenance = {
    type: '',
    date: '',
    mileage: 0,
    notes: ''
  };

  addMaintenance() {
    console.log('New maintenance:', this.newMaintenance);
    alert('Entretien ajouté avec succès !');
    this.showAddModal = false;
  }
}