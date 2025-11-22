import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
        <div *ngFor="let stat of stats" 
             [class]="'rounded-xl shadow-md p-6 ' + stat.bgClass">
          <div class="flex items-center justify-between mb-3">
            <span class="text-3xl">{{stat.icon}}</span>
            <span [class]="'text-2xl font-bold ' + stat.textClass">{{stat.value}}</span>
          </div>
          <div [class]="stat.textClass">{{stat.label}}</div>
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
            <label class="block text-gray-700 font-medium mb-2">Véhicule</label>
            <select [(ngModel)]="filters.vehicle" (change)="applyFilters()"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="all">Tous</option>
              <option value="peugeot">Peugeot 208</option>
              <option value="renault">Renault Clio</option>
            </select>
          </div>
          <div>
            <label class="block text-gray-700 font-medium mb-2">Tri</label>
            <select [(ngModel)]="filters.sort" (change)="applyFilters()"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="date-desc">Plus récentes</option>
              <option value="date-asc">Plus anciennes</option>
              <option value="amount-desc">Montant décroissant</option>
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

      <!-- Infractions List -->
      <div class="space-y-4">
        <div *ngFor="let infraction of filteredInfractions" 
             [class]="'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border-l-4 ' + infraction.borderClass">
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <span class="text-3xl">{{infraction.icon}}</span>
                  <div>
                    <h3 class="text-xl font-bold text-gray-800">{{infraction.type}}</h3>
                    <p class="text-gray-600">{{infraction.location}}</p>
                  </div>
                </div>
                <div class="grid md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <div class="text-gray-500 text-sm">Date</div>
                    <div class="font-medium text-gray-800">{{infraction.date}}</div>
                  </div>
                  <div>
                    <div class="text-gray-500 text-sm">Véhicule</div>
                    <div class="font-medium text-gray-800">{{infraction.vehicle}}</div>
                  </div>
                  <div>
                    <div class="text-gray-500 text-sm">Référence</div>
                    <div class="font-medium text-gray-800">{{infraction.reference}}</div>
                  </div>
                  <div>
                    <div class="text-gray-500 text-sm">Échéance</div>
                    <div [class]="'font-medium ' + infraction.deadlineClass">
                      {{infraction.deadline}}
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-right ml-6">
                <div class="text-3xl font-bold text-gray-800 mb-2">{{infraction.amount}} DT</div>
                <span [class]="'px-3 py-1 rounded-full text-sm font-medium ' + infraction.statusBadge">
                  {{infraction.statusText}}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
              <div class="flex space-x-2">
                <button *ngIf="infraction.status === 'pending'" 
                        (click)="markAsPaid(infraction)"
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
                <button (click)="deleteInfraction(infraction)"
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
              <h2 class="text-2xl font-bold text-gray-800">Nouvelle Infraction</h2>
              <button (click)="showAddModal = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form (ngSubmit)="addInfraction()" #infractionForm="ngForm" class="space-y-4">
              <div>
                <label class="block text-gray-700 font-medium mb-2">Type d'infraction</label>
                <select name="type" [(ngModel)]="newInfraction.type" required
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Sélectionner...</option>
                  <option value="Excès de vitesse">Excès de vitesse</option>
                  <option value="Stationnement interdit">Stationnement interdit</option>
                  <option value="Feu rouge grillé">Feu rouge grillé</option>
                  <option value="Téléphone au volant">Téléphone au volant</option>
                  <option value="Autre">Autre</option>
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

              <div>
                <label class="block text-gray-700 font-medium mb-2">Véhicule</label>
                <select name="vehicle" [(ngModel)]="newInfraction.vehicle" required
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Sélectionner...</option>
                  <option value="Peugeot 208">Peugeot 208 (TUN 1234)</option>
                  <option value="Renault Clio">Renault Clio (TUN 5678)</option>
                </select>
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">Référence (optionnel)</label>
                <input type="text" name="reference" [(ngModel)]="newInfraction.reference"
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                       placeholder="PV-2025-12345">
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">Date limite de paiement</label>
                <input type="date" name="deadline" [(ngModel)]="newInfraction.deadline" required
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              </div>

              <div class="flex space-x-4 pt-4">
                <button type="button" (click)="showAddModal = false"
                        class="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  Annuler
                </button>
                <button type="submit" [disabled]="!infractionForm.valid"
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
export class InfractionsComponent {
  showAddModal = false;
  
  stats = [
    { icon: '🚨', value: '1', label: 'En cours', bgClass: 'bg-red-50', textClass: 'text-red-600' },
    { icon: '✓', value: '3', label: 'Payées', bgClass: 'bg-green-50', textClass: 'text-green-600' },
    { icon: '💰', value: '450', label: 'Total (DT)', bgClass: 'bg-blue-50', textClass: 'text-blue-600' },
    { icon: '⏰', value: '10j', label: 'Prochaine échéance', bgClass: 'bg-orange-50', textClass: 'text-orange-600' }
  ];

  filters = {
    status: 'all',
    vehicle: 'all',
    sort: 'date-desc'
  };

  infractions = [
    {
      id: 1,
      type: 'Excès de vitesse',
      icon: '🚗',
      location: 'Autoroute Tunis-Sfax, Km 45',
      date: '10 Nov 2025',
      vehicle: 'Peugeot 208',
      reference: 'PV-2025-12345',
      amount: '150',
      deadline: '26 Nov 2025',
      deadlineClass: 'text-red-600',
      status: 'pending',
      statusText: 'En cours',
      statusBadge: 'bg-orange-100 text-orange-800',
      borderClass: 'border-red-500'
    },
    {
      id: 2,
      type: 'Stationnement interdit',
      icon: '🅿️',
      location: 'Avenue Habib Bourguiba, Tunis',
      date: '5 Oct 2025',
      vehicle: 'Renault Clio',
      reference: 'PV-2025-11234',
      amount: '80',
      deadline: '20 Oct 2025',
      deadlineClass: 'text-green-600',
      status: 'paid',
      statusText: 'Payée',
      statusBadge: 'bg-green-100 text-green-800',
      borderClass: 'border-green-500'
    }
  ];

  filteredInfractions = [...this.infractions];

  newInfraction = {
    type: '',
    date: '',
    amount: 0,
    location: '',
    vehicle: '',
    reference: '',
    deadline: ''
  };

  applyFilters() {
    this.filteredInfractions = this.infractions.filter(i => {
      if (this.filters.status !== 'all' && i.status !== this.filters.status) return false;
      return true;
    });
  }

  resetFilters() {
    this.filters = { status: 'all', vehicle: 'all', sort: 'date-desc' };
    this.applyFilters();
  }

  addInfraction() {
    console.log('New infraction:', this.newInfraction);
    alert('Infraction ajoutée avec succès !');
    this.showAddModal = false;
  }

  markAsPaid(infraction: any) {
    if (confirm('Confirmer le paiement de cette infraction ?')) {
      alert('Infraction marquée comme payée');
    }
  }

  editInfraction(infraction: any) {
    alert(`Édition de l'infraction ${infraction.reference}`);
  }

  deleteInfraction(infraction: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette infraction ?')) {
      alert('Infraction supprimée');
    }
  }
}