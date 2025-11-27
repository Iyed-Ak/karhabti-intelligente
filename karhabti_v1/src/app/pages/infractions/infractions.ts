// ============= src/app/pages/infractions/infractions.ts =============
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfractionService } from '../../services/infraction';

@Component({
  selector: 'app-infractions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Mes Infractions</h1>
          <p class="text-gray-600">Suivez vos contraventions et leurs échéances</p>
        </div>
        <button (click)="showAddModal = true" 
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          + Ajouter une infraction
        </button>
      </div>

      <!-- Stats -->
      <div class="grid md:grid-cols-4 gap-6 mb-8">
        <div class="rounded-xl shadow-md p-6 bg-red-50">
          <div class="flex items-center justify-between mb-3">
            <span class="text-3xl">🚨</span>
            <span class="text-2xl font-bold text-red-600">{{getPendingCount()}}</span>
          </div>
          <div class="text-red-600">En cours</div>
        </div>
        <div class="rounded-xl shadow-md p-6 bg-green-50">
          <div class="flex items-center justify-between mb-3">
            <span class="text-3xl">✓</span>
            <span class="text-2xl font-bold text-green-600">{{getPaidCount()}}</span>
          </div>
          <div class="text-green-600">Payées</div>
        </div>
        <div class="rounded-xl shadow-md p-6 bg-blue-50">
          <div class="flex items-center justify-between mb-3">
            <span class="text-3xl">💰</span>
            <span class="text-2xl font-bold text-blue-600">{{getTotalAmount()}}</span>
          </div>
          <div class="text-blue-600">Total (DT)</div>
        </div>
        <div class="rounded-xl shadow-md p-6 bg-orange-50">
          <div class="flex items-center justify-between mb-3">
            <span class="text-3xl">⏰</span>
            <span class="text-2xl font-bold text-orange-600">{{getNextDeadlineDays()}}j</span>
          </div>
          <div class="text-orange-600">Prochaine échéance</div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="grid md:grid-cols-4 gap-4">
          <div>
            <label class="block text-gray-700 font-medium mb-2">Statut</label>
            <select [(ngModel)]="filters.status" (change)="applyFilters()"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="all">Tous</option>
              <option value="pending">En cours</option>
              <option value="paid">Payées</option>
              <option value="overdue">En retard</option>
            </select>
          </div>
          <div>
            <label class="block text-gray-700 font-medium mb-2">Type</label>
            <select [(ngModel)]="filters.type" (change)="applyFilters()"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="all">Tous</option>
              <option value="speeding">Excès de vitesse</option>
              <option value="parking">Stationnement</option>
              <option value="redLight">Feu rouge</option>
              <option value="phone">Téléphone</option>
            </select>
          </div>
          <div>
            <label class="block text-gray-700 font-medium mb-2">Tri</label>
            <select [(ngModel)]="filters.sort" (change)="applyFilters()"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="date-desc">Plus récentes</option>
              <option value="date-asc">Plus anciennes</option>
              <option value="deadline">Échéance proche</option>
            </select>
          </div>
          <div class="flex items-end">
            <button (click)="resetFilters()" 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="text-center py-8">
        <div class="inline-block">
          <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>

      <!-- Infractions List -->
      <div *ngIf="!isLoading" class="space-y-4">
        <div *ngFor="let infraction of filteredInfractions" 
             [class]="'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border-l-4 ' + getStatusBorderClass(infraction.status)">
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <span class="text-3xl">{{getInfractionIcon(infraction.type)}}</span>
                  <div>
                    <h3 class="text-xl font-bold text-gray-800">{{getInfractionLabel(infraction.type)}}</h3>
                    <p class="text-gray-600">{{infraction.location}}</p>
                  </div>
                </div>
                <div class="grid md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <div class="text-gray-500 text-sm">Date</div>
                    <div class="font-medium text-gray-800">{{infraction.date | date:'dd/MM/yyyy'}}</div>
                  </div>
                  <div>
                    <div class="text-gray-500 text-sm">Véhicule</div>
                    <div class="font-medium text-gray-800">{{infraction.vehicleId?.plate}}</div>
                  </div>
                  <div>
                    <div class="text-gray-500 text-sm">Référence</div>
                    <div class="font-medium text-gray-800">{{infraction.reference || 'N/A'}}</div>
                  </div>
                  <div>
                    <div class="text-gray-500 text-sm">Échéance</div>
                    <div [class]="'font-medium ' + getDeadlineClass(infraction.deadline)">
                      {{infraction.deadline | date:'dd/MM/yyyy'}}
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-right ml-6">
                <div class="text-3xl font-bold text-gray-800 mb-2">{{infraction.amount}} DT</div>
                <span [class]="'px-3 py-1 rounded-full text-sm font-medium ' + getStatusBadgeClass(infraction.status)">
                  {{getStatusLabel(infraction.status)}}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
              <div class="flex space-x-2">
                <button *ngIf="infraction.status === 'pending'" 
                        (click)="markAsPaid(infraction._id)"
                        class="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition font-medium">
                  ✓ Marquer comme payée
                </button>
                <button class="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                  📄 Détails
                </button>
              </div>
              <div class="flex space-x-2">
                <button (click)="editInfraction(infraction)"
                        class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  ✏️ Modifier
                </button>
                <button (click)="deleteInfraction(infraction._id)"
                        class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition">
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredInfractions.length === 0" 
             class="bg-white rounded-xl shadow-md p-12 text-center">
          <div class="text-6xl mb-4">🎉</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Aucune infraction</h3>
          <p class="text-gray-600">Vous n'avez aucune infraction correspondant aux filtres sélectionnés</p>
        </div>
      </div>

      <!-- Add Infraction Modal -->
      <div *ngIf="showAddModal" 
           class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-800">
                {{isEditMode ? 'Modifier l\'infraction' : 'Nouvelle Infraction'}}
              </h2>
              <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form (ngSubmit)="saveInfraction()" #infractionForm="ngForm" class="space-y-4">
              <div>
                <label class="block text-gray-700 font-medium mb-2">Type d'infraction</label>
                <select name="type" [(ngModel)]="newInfraction.type" required
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Sélectionner...</option>
                  <option value="speeding">Excès de vitesse</option>
                  <option value="parking">Stationnement interdit</option>
                  <option value="redLight">Feu rouge grillé</option>
                  <option value="phone">Téléphone au volant</option>
                  <option value="seatbelt">Ceinture non attachée</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Date</label>
                  <input type="date" name="date" [(ngModel)]="newInfraction.date" required
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                </div>
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Montant (DT)</label>
                  <input type="number" name="amount" [(ngModel)]="newInfraction.amount" required
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                         placeholder="150">
                </div>
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">Lieu</label>
                <input type="text" name="location" [(ngModel)]="newInfraction.location" required
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                       placeholder="Avenue Habib Bourguiba, Tunis">
              </div>

              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Véhicule</label>
                  <select name="vehicleId" [(ngModel)]="newInfraction.vehicleId" required
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Sélectionner...</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Référence (optionnel)</label>
                  <input type="text" name="reference" [(ngModel)]="newInfraction.reference"
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                         placeholder="PV-2025-12345">
                </div>
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">Date limite de paiement</label>
                <input type="date" name="deadline" [(ngModel)]="newInfraction.deadline" required
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              </div>

              <div class="flex space-x-4 pt-4">
                <button type="button" (click)="closeModal()"
                        class="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  Annuler
                </button>
                <button type="submit" [disabled]="!infractionForm.valid || isSaving"
                        class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300">
                  {{isSaving ? 'En cours...' : (isEditMode ? 'Modifier' : 'Ajouter')}}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InfractionsComponent implements OnInit {
  showAddModal = false;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  editingInfractionId: string | null = null;

  infractions$: any;
  filteredInfractions: any[] = [];

  filters = {
    status: 'all',
    type: 'all',
    sort: 'date-desc'
  };

  newInfraction = {
    type: '',
    date: '',
    amount: 0,
    location: '',
    vehicleId: '',
    reference: '',
    deadline: ''
  };

  constructor(private infractionService: InfractionService) {}

  ngOnInit() {
    this.infractions$ = this.infractionService.infractions$;
    this.loadInfractions();
    this.infractions$.subscribe(() => {
      this.applyFilters();
    });
  }

  loadInfractions() {
    this.isLoading = true;
    this.infractionService.loadInfractions().subscribe({
      next: () => {
        this.isLoading = false;
        this.applyFilters();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    let filtered = this.infractionService.getInfractions();

    if (this.filters.status !== 'all') {
      filtered = filtered.filter(i => i.status === this.filters.status);
    }

    if (this.filters.type !== 'all') {
      filtered = filtered.filter(i => i.type === this.filters.type);
    }

    if (this.filters.sort === 'date-asc') {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (this.filters.sort === 'deadline') {
      filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    this.filteredInfractions = filtered;
  }

  resetFilters() {
    this.filters = { status: 'all', type: 'all', sort: 'date-desc' };
    this.applyFilters();
  }

  saveInfraction() {
    if (this.isEditMode && this.editingInfractionId) {
      this.updateInfraction();
    } else {
      this.addInfraction();
    }
  }

  addInfraction() {
    this.isSaving = true;
    this.infractionService.addInfraction(this.newInfraction).subscribe({
      next: () => {
        this.isSaving = false;
        this.closeModal();
        alert('Infraction ajoutée avec succès !');
      },
      error: (err) => {
        this.isSaving = false;
        alert('Erreur: ' + err.message);
      }
    });
  }

  updateInfraction() {
    if (!this.editingInfractionId) return;
    
    this.isSaving = true;
    // Utiliser le service API si une méthode de mise à jour existe
    alert('Mise à jour non implémentée dans le service');
    this.isSaving = false;
  }

  markAsPaid(id: string) {
    if (confirm('Confirmer le paiement de cette infraction ?')) {
      this.infractionService.markAsPaid(id).subscribe({
        next: () => {
          alert('Infraction marquée comme payée !');
        },
        error: (err) => {
          alert('Erreur: ' + err.message);
        }
      });
    }
  }

  deleteInfraction(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette infraction ?')) {
      this.infractionService.deleteInfraction(id).subscribe({
        next: () => {
          alert('Infraction supprimée !');
        },
        error: (err) => {
          alert('Erreur: ' + err.message);
        }
      });
    }
  }

  editInfraction(infraction: any) {
    this.isEditMode = true;
    this.editingInfractionId = infraction._id;
    this.newInfraction = { ...infraction };
    this.showAddModal = true;
  }

  closeModal() {
    this.showAddModal = false;
    this.isEditMode = false;
    this.editingInfractionId = null;
    this.resetForm();
  }

  resetForm() {
    this.newInfraction = {
      type: '',
      date: '',
      amount: 0,
      location: '',
      vehicleId: '',
      reference: '',
      deadline: ''
    };
  }

  getPendingCount(): number {
    return this.infractionService.getPendingInfractions().length;
  }

  getPaidCount(): number {
    return this.infractionService.getPaidInfractions().length;
  }

  getTotalAmount(): number {
    return this.infractionService.getTotalAmount();
  }

  getNextDeadlineDays(): number {
    const pending = this.infractionService.getPendingInfractions();
    if (pending.length === 0) return 0;
    
    const nextDate = new Date(pending[0].deadline);
    const today = new Date();
    const diff = nextDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getInfractionIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'speeding': '🚗',
      'parking': '🅿️',
      'redLight': '🚦',
      'phone': '📱',
      'seatbelt': '🎽',
      'other': '⚠️'
    };
    return icons[type] || '⚠️';
  }

  getInfractionLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'speeding': 'Excès de vitesse',
      'parking': 'Stationnement interdit',
      'redLight': 'Feu rouge grillé',
      'phone': 'Téléphone au volant',
      'seatbelt': 'Ceinture non attachée',
      'other': 'Autre infraction'
    };
    return labels[type] || type;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'En cours',
      'paid': 'Payée',
      'overdue': 'En retard',
      'disputed': 'Contestée'
    };
    return labels[status] || status;
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pending': 'bg-orange-100 text-orange-800',
      'paid': 'bg-green-100 text-green-800',
      'overdue': 'bg-red-100 text-red-800',
      'disputed': 'bg-blue-100 text-blue-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusBorderClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pending': 'border-orange-500',
      'paid': 'border-green-500',
      'overdue': 'border-red-500',
      'disputed': 'border-blue-500'
    };
    return classes[status] || 'border-gray-500';
  }

  getDeadlineClass(deadline: string): string {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysLeft = (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysLeft < 0) return 'text-red-600';
    if (daysLeft < 7) return 'text-orange-600';
    return 'text-green-600';
  }
}