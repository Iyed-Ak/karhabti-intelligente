import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Mes Véhicules</h1>
          <p class="text-gray-600">Gérez vos véhicules et leur entretien</p>
        </div>
        <button (click)="showAddModal = true" 
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          + Ajouter un véhicule
        </button>
      </div>

      <!-- Vehicles Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let vehicle of vehicles" 
             class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
          <!-- Vehicle Image/Icon -->
          <div [class]="'h-48 flex items-center justify-center text-white text-6xl ' + vehicle.gradientClass">
            🚗
          </div>

          <!-- Vehicle Info -->
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-xl font-bold text-gray-800">{{vehicle.brand}} {{vehicle.model}}</h3>
                <p class="text-gray-600">{{vehicle.year}}</p>
              </div>
              <span [class]="'px-3 py-1 rounded-full text-sm font-medium ' + vehicle.statusBadge">
                {{vehicle.statusText}}
              </span>
            </div>

            <!-- Details -->
            <div class="space-y-2 mb-4">
              <div class="flex items-center text-gray-600">
                <span class="mr-2">🏷️</span>
                <span>{{vehicle.plate}}</span>
              </div>
              <div class="flex items-center text-gray-600">
                <span class="mr-2">📏</span>
                <span>{{vehicle.mileage}} km</span>
              </div>
              <div class="flex items-center text-gray-600">
                <span class="mr-2">⛽</span>
                <span>{{vehicle.fuel}}</span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mb-4">
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="text-gray-600">Prochain entretien</span>
                <span class="font-medium text-gray-800">{{vehicle.nextMaintenance}} km</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div [style.width.%]="vehicle.maintenanceProgress" 
                     [class]="'h-2 rounded-full ' + vehicle.progressColor"></div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2">
              <button (click)="viewDetails(vehicle)" 
                      class="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                Détails
              </button>
              <button (click)="editVehicle(vehicle)" 
                      class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                ✏️
              </button>
              <button (click)="deleteVehicle(vehicle)" 
                      class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition">
                🗑️
              </button>
            </div>
          </div>
        </div>

        <!-- Add New Card -->
        <div (click)="showAddModal = true" 
             class="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 transition cursor-pointer">
          <div class="h-full flex flex-col items-center justify-center p-6 text-center">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span class="text-4xl text-blue-600">+</span>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Ajouter un véhicule</h3>
            <p class="text-gray-600">Cliquez pour enregistrer un nouveau véhicule</p>
          </div>
        </div>
      </div>

      <!-- Add Vehicle Modal -->
      <div *ngIf="showAddModal" 
           class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <!-- Modal Header -->
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-800">Ajouter un véhicule</h2>
              <button (click)="showAddModal = false" 
                      class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Form -->
            <form (ngSubmit)="addVehicle()" #vehicleForm="ngForm" class="space-y-4">
              <div class="grid md:grid-cols-2 gap-4">
                <!-- Brand -->
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Marque</label>
                  <select name="brand" [(ngModel)]="newVehicle.brand" required
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Sélectionner...</option>
                    <option value="Peugeot">Peugeot</option>
                    <option value="Renault">Renault</option>
                    <option value="Citroën">Citroën</option>
                    <option value="Volkswagen">Volkswagen</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Mercedes">Mercedes</option>
                    <option value="BMW">BMW</option>
                  </select>
                </div>

                <!-- Model -->
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Modèle</label>
                  <input type="text" name="model" [(ngModel)]="newVehicle.model" required
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                         placeholder="208, Clio, Golf...">
                </div>

                <!-- Year -->
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Année</label>
                  <input type="number" name="year" [(ngModel)]="newVehicle.year" required
                         min="1990" max="2025"
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                         placeholder="2020">
                </div>

                <!-- Plate -->
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Matricule</label>
                  <input type="text" name="plate" [(ngModel)]="newVehicle.plate" required
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                         placeholder="TUN 1234">
                </div>

                <!-- Mileage -->
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Kilométrage actuel</label>
                  <input type="number" name="mileage" [(ngModel)]="newVehicle.mileage" required
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                         placeholder="45000">
                </div>

                <!-- Fuel Type -->
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Carburant</label>
                  <select name="fuel" [(ngModel)]="newVehicle.fuel" required
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Sélectionner...</option>
                    <option value="Essence">Essence</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybride">Hybride</option>
                    <option value="Électrique">Électrique</option>
                  </select>
                </div>
              </div>

              <!-- VIN -->
              <div>
                <label class="block text-gray-700 font-medium mb-2">Numéro de série (VIN) - Optionnel</label>
                <input type="text" name="vin" [(ngModel)]="newVehicle.vin"
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                       placeholder="1HGBH41JXMN109186">
              </div>

              <!-- Buttons -->
              <div class="flex space-x-4 pt-4">
                <button type="button" (click)="showAddModal = false"
                        class="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  Annuler
                </button>
                <button type="submit" [disabled]="!vehicleForm.valid"
                        class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300">
                  Ajouter le véhicule
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VehiclesComponent {
  showAddModal = false;
  
  vehicles = [
    {
      brand: 'Peugeot',
      model: '208',
      year: '2019',
      plate: 'TUN 1234',
      mileage: '45000',
      fuel: 'Essence',
      statusText: 'Bon état',
      statusBadge: 'bg-green-100 text-green-800',
      nextMaintenance: '5000',
      maintenanceProgress: 85,
      progressColor: 'bg-orange-500',
      gradientClass: 'bg-gradient-to-br from-blue-500 to-blue-700'
    },
    {
      brand: 'Renault',
      model: 'Clio',
      year: '2021',
      plate: 'TUN 5678',
      mileage: '28000',
      fuel: 'Diesel',
      statusText: 'Excellent',
      statusBadge: 'bg-green-100 text-green-800',
      nextMaintenance: '12000',
      maintenanceProgress: 45,
      progressColor: 'bg-green-500',
      gradientClass: 'bg-gradient-to-br from-purple-500 to-purple-700'
    }
  ];

  newVehicle = {
    brand: '',
    model: '',
    year: 2024,
    plate: '',
    mileage: 0,
    fuel: '',
    vin: ''
  };

  addVehicle() {
    console.log('New vehicle:', this.newVehicle);
    alert('Véhicule ajouté avec succès !');
    this.showAddModal = false;
    this.resetForm();
  }

  resetForm() {
    this.newVehicle = {
      brand: '',
      model: '',
      year: 2024,
      plate: '',
      mileage: 0,
      fuel: '',
      vin: ''
    };
  }

  viewDetails(vehicle: any) {
    alert(`Détails de ${vehicle.brand} ${vehicle.model}`);
  }

  editVehicle(vehicle: any) {
    alert(`Édition de ${vehicle.brand} ${vehicle.model}`);
  }

  deleteVehicle(vehicle: any) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${vehicle.brand} ${vehicle.model} ?`)) {
      alert('Véhicule supprimé');
    }
  }
}