// ============= src/app/pages/maintenance/maintenance.ts =============
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaintenanceService } from '../../services/maintenance';
import { VehicleService } from '../../services/vehicle';

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
          <button *ngFor="let vehicle of vehicles$ | async" 
                  (click)="selectVehicle(vehicle._id)"
                  [class]="'p-4 rounded-lg border-2 transition ' + 
                          (selectedVehicleId === vehicle._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300')">
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
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between mb-3">
            <span class="text-3xl">🔧</span>
            <span class="text-2xl font-bold text-orange-600">{{getUpcomingCount()}}</span>
          </div>
          <div class="text-gray-600">À venir</div>
        </div>
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between mb-3">
            <span class="text-3xl">✓</span>
            <span class="text-2xl font-bold text-green-600">{{getHistoryCount()}}</span>
          </div>
          <div class="text-gray-600">Terminés</div>
        </div>
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between mb-3">
            <span class="text-3xl">💰</span>
            <span class="text-2xl font-bold text-blue-600">{{getTotalCost()}} DT</span>
          </div>
          <div class="text-gray-600">Dépensés</div>
        </div>
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between mb-3">
            <span class="text-3xl">📅</span>
            <span class="text-2xl font-bold text-red-600">{{getNextMaintenanceDays()}}j</span>
          </div>
          <div class="text-gray-600">Prochain</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-xl shadow-md mb-8">
        <div class="border-b border-gray-200">
          <div class="flex">
            <button (click)="activeTab = 'upcoming'"
                    [class]="'px-6 py-4 font-medium transition ' + 
                            (activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800')">
              À venir <span class="ml-2 px-2 py-1 bg-gray-100 rounded text-sm">{{getUpcomingCount()}}</span>
            </button>
            <button (click)="activeTab = 'history'"
                    [class]="'px-6 py-4 font-medium transition ' + 
                            (activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800')">
              Historique <span class="ml-2 px-2 py-1 bg-gray-100 rounded text-sm">{{getHistoryCount()}}</span>
            </button>
            <button (click)="activeTab = 'recommendations'"
                    [class]="'px-6 py-4 font-medium transition ' + 
                            (activeTab === 'recommendations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800')">
              Recommandations <span class="ml-2 px-2 py-1 bg-gray-100 rounded text-sm">{{recommendations.length}}</span>
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Loading State -->
          <div *ngIf="isLoading" class="text-center py-8">
            <div class="inline-block">
              <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>

          <!-- Upcoming Maintenance -->
          <div *ngIf="!isLoading && activeTab === 'upcoming'" class="space-y-4">
            <div *ngFor="let maintenance of upcomingList" 
                 class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div class="flex items-center justify-between">
                <div class="flex items-center flex-1">
                  <div class="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center text-2xl mr-4">
                    🔧
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-gray-800 text-lg">{{maintenance.type}}</h3>
                    <p class="text-gray-600">{{maintenance.description}}</p>
                    <div class="flex items-center space-x-4 mt-2">
                      <span class="text-sm text-gray-500">📅 {{maintenance.date | date:'dd/MM/yyyy'}}</span>
                      <span class="text-sm text-gray-500">📏 {{maintenance.mileage}} km</span>
                      <span class="text-sm font-medium text-red-600">Urgent</span>
                    </div>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button (click)="markCompleted(maintenance._id)"
                          class="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition">
                    ✓ Fait
                  </button>
                  <button (click)="editMaintenance(maintenance)"
                          class="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                    Modifier
                  </button>
                  <button (click)="deleteMaintenance(maintenance._id)"
                          class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
            <div *ngIf="upcomingList.length === 0" 
                 class="text-center py-8 text-gray-500">
              Aucun entretien prévu
            </div>
          </div>

          <!-- History -->
          <div *ngIf="!isLoading && activeTab === 'history'" class="space-y-4">
            <div *ngFor="let history of historyList" 
                 class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl mr-4">
                  ✓
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-gray-800">{{history.type}}</h3>
                  <p class="text-gray-600 text-sm">{{history.date | date:'dd/MM/yyyy'}} • {{history.mileage}} km</p>
                  <p class="text-gray-500 text-sm mt-1">{{history.garage || 'Garage non spécifié'}}</p>
                </div>
                <div class="text-right">
                  <div class="font-bold text-gray-800">{{history.cost}} DT</div>
                  <button (click)="viewDetails(history)" class="text-blue-600 hover:text-blue-700 text-sm mt-1">
                    Voir détails →
                  </button>
                </div>
              </div>
            </div>
            <div *ngIf="historyList.length === 0" 
                 class="text-center py-8 text-gray-500">
              Aucun historique
            </div>
          </div>

          <!-- Recommendations -->
          <div *ngIf="!isLoading && activeTab === 'recommendations'" class="space-y-4">
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

      <!-- Add/Edit Maintenance Modal -->
      <div *ngIf="showAddModal" 
           class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-800">
                {{isEditMode ? 'Modifier l\'entretien' : 'Nouvel Entretien'}}
              </h2>
              <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form (ngSubmit)="saveMaintenance()" #maintenanceForm="ngForm" class="space-y-4">
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
                  <option value="climatisation">Climatisation</option>
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
                  <label class="block text-gray-700 font-medium mb-2">Kilométrage</label>
                  <input type="number" name="mileage" [(ngModel)]="newMaintenance.mileage" required
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                         placeholder="50000">
                </div>
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">Coût (optionnel)</label>
                <input type="number" name="cost" [(ngModel)]="newMaintenance.cost"
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                       placeholder="150">
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">Garage (optionnel)</label>
                <input type="text" name="garage" [(ngModel)]="newMaintenance.garage"
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                       placeholder="Garage Central Tunis">
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">Notes</label>
                <textarea name="notes" [(ngModel)]="newMaintenance.notes" rows="3"
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Détails supplémentaires..."></textarea>
              </div>

              <div class="flex space-x-4 pt-4">
                <button type="button" (click)="closeModal()"
                        class="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  Annuler
                </button>
                <button type="submit" [disabled]="!maintenanceForm.valid || isSaving"
                        class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300">
                  {{isSaving ? 'En cours...' : (isEditMode ? 'Modifier' : 'Ajouter')}}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
  `,
})
export class MaintenanceComponent implements OnInit {
  showAddModal = false;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  activeTab = 'upcoming';
  selectedVehicleId: string | null = null;
  editingMaintenanceId: string | null = null;

  vehicles$: any;
  maintenances$: any;

  upcomingList: any[] = [];
  historyList: any[] = [];
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
    cost: 0,
    garage: '',
    notes: '',
    vehicleId: ''
  };

  constructor(
    private maintenanceService: MaintenanceService,
    private vehicleService: VehicleService
  ) {
    this.vehicles$ = this.vehicleService.vehicles$;
    this.maintenances$ = this.maintenanceService.maintenances$;
  }

  ngOnInit() {
    this.loadData();
    this.maintenances$.subscribe(() => {
      this.updateLists();
    });
  }

  loadData() {
    this.isLoading = true;
    this.vehicleService.loadVehicles().subscribe({
      next: () => {
        this.maintenanceService.loadMaintenances().subscribe({
          next: () => {
            this.isLoading = false;
            this.updateLists();
          },
          error: () => {
            this.isLoading = false;
          }
        });
      }
    });
  }

  updateLists() {
    this.upcomingList = this.maintenanceService.getUpcomingMaintenances();
    this.historyList = this.maintenanceService.getMaintenanceHistory();
  }

  selectVehicle(vehicleId: string) {
    this.selectedVehicleId = vehicleId;
    this.newMaintenance.vehicleId = vehicleId;
  }

  saveMaintenance() {
    if (this.isEditMode && this.editingMaintenanceId) {
      this.updateMaintenance();
    } else {
      this.addMaintenance();
    }
  }

  addMaintenance() {
    this.isSaving = true;
    this.maintenanceService.addMaintenance(this.newMaintenance).subscribe({
      next: () => {
        this.isSaving = false;
        this.closeModal();
        alert('Entretien ajouté avec succès !');
      },
      error: (err) => {
        this.isSaving = false;
        alert('Erreur: ' + err.message);
      }
    });
  }

  updateMaintenance() {
    if (!this.editingMaintenanceId) return;
    
    this.isSaving = true;
    this.maintenanceService.updateMaintenance(this.editingMaintenanceId, this.newMaintenance).subscribe({
      next: () => {
        this.isSaving = false;
        this.closeModal();
        alert('Entretien modifié avec succès !');
      },
      error: (err) => {
        this.isSaving = false;
        alert('Erreur: ' + err.message);
      }
    });
  }

  markCompleted(id: string) {
    const updateData = { status: 'completed' };
    this.maintenanceService.updateMaintenance(id, updateData).subscribe({
      next: () => {
        alert('Entretien marqué comme complété !');
      },
      error: (err) => {
        alert('Erreur: ' + err.message);
      }
    });
  }

  deleteMaintenance(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet entretien ?')) {
      this.maintenanceService.deleteMaintenance(id).subscribe({
        next: () => {
          alert('Entretien supprimé avec succès !');
        },
        error: (err) => {
          alert('Erreur: ' + err.message);
        }
      });
    }
  }

  editMaintenance(maintenance: any) {
    this.isEditMode = true;
    this.editingMaintenanceId = maintenance._id;
    this.newMaintenance = { ...maintenance };
    this.showAddModal = true;
  }

  closeModal() {
    this.showAddModal = false;
    this.isEditMode = false;
    this.editingMaintenanceId = null;
    this.resetForm();
  }

  resetForm() {
    this.newMaintenance = {
      type: '',
      date: '',
      mileage: 0,
      cost: 0,
      garage: '',
      notes: '',
      vehicleId: this.selectedVehicleId || ''
    };
  }

  getUpcomingCount(): number {
    return this.upcomingList.length;
  }

  getHistoryCount(): number {
    return this.historyList.length;
  }

  getTotalCost(): number {
    return this.historyList.reduce((sum, m) => sum + (m.cost || 0), 0);
  }

  getNextMaintenanceDays(): number {
    if (this.upcomingList.length === 0) return 0;
    
    const nextDate = new Date(this.upcomingList[0].date);
    const today = new Date();
    const diff = nextDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  viewDetails(maintenance: any) {
    alert(`${maintenance.type}\nDate: ${maintenance.date}\nCoût: ${maintenance.cost} DT`);
  }
}