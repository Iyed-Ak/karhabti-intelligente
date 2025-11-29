import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../services/vehicle';

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

      <!-- Loading State -->
      <div *ngIf="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Chargement des véhicules...</p>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-600">{{errorMessage}}</p>
      </div>

      <!-- Success Message -->
      <div *ngIf="successMessage" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p class="text-green-600">{{successMessage}}</p>
      </div>

      <!-- Vehicles Grid -->
      <div *ngIf="!isLoading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let vehicle of vehicles" 
             class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
          <!-- Vehicle Image/Icon -->
          <div class="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-6xl">
            🚗
          </div>

          <!-- Vehicle Info -->
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-xl font-bold text-gray-800">{{vehicle.brand}} {{vehicle.model}}</h3>
                <p class="text-gray-600">{{vehicle.year}}</p>
              </div>
              <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Actif
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

            <!-- Actions -->
            <div class="flex space-x-2">
              <button (click)="viewDetails(vehicle)" 
                      class="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                Détails
              </button>
              <button (click)="openEditModal(vehicle)" 
                      class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                ✏️
              </button>
              <button (click)="confirmDelete(vehicle)" 
                      class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition">
                🗑️
              </button>
            </div>
          </div>
        </div>

        <!-- Add New Card -->
        <div (click)="showAddModal = true" 
             class="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 transition cursor-pointer">
          <div class="h-full flex flex-col items-center justify-center p-6 text-center min-h-[400px]">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span class="text-4xl text-blue-600">+</span>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Ajouter un véhicule</h3>
            <p class="text-gray-600">Cliquez pour enregistrer un nouveau véhicule</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && vehicles.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">🚗</div>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Aucun véhicule</h3>
        <p class="text-gray-600 mb-6">Commencez par ajouter votre premier véhicule</p>
        <button (click)="showAddModal = true" 
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + Ajouter un véhicule
        </button>
      </div>

      <!-- Add/Edit Vehicle Modal -->
      <div *ngIf="showAddModal" 
           class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <!-- Modal Header -->
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-800">
                {{isEditMode ? 'Modifier le véhicule' : 'Ajouter un véhicule'}}
              </h2>
              <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Form -->
            <form (ngSubmit)="submitVehicle()" #vehicleForm="ngForm" class="space-y-4">
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Marque *</label>
                  <input type="text" name="brand" [(ngModel)]="vehicleData.brand" required
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                         placeholder="Peugeot, Renault...">
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-2">Modèle *</label>
                  <input type="text" name="model" [(ngModel)]="vehicleData.model" required
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                         placeholder="208, Clio...">
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-2">Année *</label>
                  <input type="number" name="year" [(ngModel)]="vehicleData.year" required
                         min="1990" max="2025"
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                         placeholder="2020">
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-2">Matricule *</label>
                  <input type="text" name="plate" [(ngModel)]="vehicleData.plate" required
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                         placeholder="TUN 1234">
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-2">Kilométrage *</label>
                  <input type="number" name="mileage" [(ngModel)]="vehicleData.mileage" required
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                         placeholder="45000">
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-2">Carburant *</label>
                  <select name="fuel" [(ngModel)]="vehicleData.fuel" required
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Sélectionner...</option>
                    <option value="Essence">Essence</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybride">Hybride</option>
                    <option value="Électrique">Électrique</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">VIN (optionnel)</label>
                <input type="text" name="vin" [(ngModel)]="vehicleData.vin"
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                       placeholder="1HGBH41JXMN109186">
              </div>

              <!-- Buttons -->
              <div class="flex space-x-4 pt-4">
                <button type="button" (click)="closeModal()"
                        class="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  Annuler
                </button>
                <button type="submit" [disabled]="!vehicleForm.valid || isSaving"
                        class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300">
                  <span *ngIf="!isSaving">{{isEditMode ? 'Modifier' : 'Ajouter'}}</span>
                  <span *ngIf="isSaving">Enregistrement...</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VehiclesComponent implements OnInit {
  showAddModal = false;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  
  vehicles: any[] = [];
  currentVehicleId: string | null = null;
  
  vehicleData = {
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    plate: '',  // ← Changé de licensePlate à plate
    mileage: 0,
    fuel: '',   // ← Changé de fuelType à fuel
    vin: ''
  };

  constructor(private vehicleService: VehicleService) {}

  ngOnInit() {
    this.loadVehicles();
    
    // S'abonner aux changements de véhicules
    this.vehicleService.vehicles$.subscribe(vehicles => {
      this.vehicles = vehicles;
    });
  }

  loadVehicles() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.vehicleService.loadVehicles().subscribe({
      next: (response) => {
        console.log('Véhicules chargés:', response);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement:', error);
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement des véhicules';
      }
    });
  }

  submitVehicle() {
    this.isSaving = true;
    this.errorMessage = '';

    if (this.isEditMode && this.currentVehicleId) {
      // Mode édition
      this.vehicleService.updateVehicle(this.currentVehicleId, this.vehicleData).subscribe({
        next: (response) => {
          console.log('Véhicule modifié:', response);
          this.successMessage = 'Véhicule modifié avec succès !';
          this.closeModal();
          this.isSaving = false;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Erreur modification:', error);
          this.errorMessage = error.error?.message || 'Erreur lors de la modification';
          this.isSaving = false;
        }
      });
    } else {
      // Mode ajout
      this.vehicleService.addVehicle(this.vehicleData).subscribe({
        next: (response) => {
          console.log('Véhicule ajouté:', response);
          this.successMessage = 'Véhicule ajouté avec succès !';
          this.closeModal();
          this.isSaving = false;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Erreur ajout:', error);
          this.errorMessage = error.error?.message || 'Erreur lors de l\'ajout';
          this.isSaving = false;
        }
      });
    }
  }

  openEditModal(vehicle: any) {
    this.isEditMode = true;
    this.currentVehicleId = vehicle._id;
    this.vehicleData = {
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      plate: vehicle.plate,
      mileage: vehicle.mileage,
      fuel: vehicle.fuel,
      vin: vehicle.vin || ''
    };
    this.showAddModal = true;
  }

  closeModal() {
    this.showAddModal = false;
    this.isEditMode = false;
    this.currentVehicleId = null;
    this.resetForm();
  }

  resetForm() {
    this.vehicleData = {
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      plate: '',
      mileage: 0,
      fuel: '',
      vin: ''
    };
  }

  viewDetails(vehicle: any) {
    alert(`Détails de ${vehicle.brand} ${vehicle.model}\nMatricule: ${vehicle.plate}\nKilométrage: ${vehicle.mileage} km`);
  }

  confirmDelete(vehicle: any) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${vehicle.brand} ${vehicle.model} ?`)) {
      this.vehicleService.deleteVehicle(vehicle._id).subscribe({
        next: () => {
          this.successMessage = 'Véhicule supprimé avec succès';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Erreur suppression:', error);
          this.errorMessage = 'Erreur lors de la suppression';
        }
      });
    }
  }
}