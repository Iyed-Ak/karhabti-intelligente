import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-garages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Garages Partenaires</h1>
        <p class="text-gray-600">Trouvez les meilleurs garages près de chez vous</p>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="grid md:grid-cols-4 gap-4 mb-4">
          <div class="md:col-span-2">
            <label class="block text-gray-700 font-medium mb-2">Rechercher</label>
            <input type="text" 
                   [(ngModel)]="searchQuery"
                   (input)="applyFilters()"
                   placeholder="Nom du garage, ville..."
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-gray-700 font-medium mb-2">Ville</label>
            <select [(ngModel)]="filters.city" (change)="applyFilters()"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="all">Toutes</option>
              <option value="tunis">Tunis</option>
              <option value="sfax">Sfax</option>
              <option value="sousse">Sousse</option>
              <option value="nabeul">Nabeul</option>
            </select>
          </div>
          <div>
            <label class="block text-gray-700 font-medium mb-2">Spécialité</label>
            <select [(ngModel)]="filters.specialty" (change)="applyFilters()"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="all">Toutes</option>
              <option value="general">Mécanique générale</option>
              <option value="bodywork">Carrosserie</option>
              <option value="electric">Électricité auto</option>
              <option value="tires">Pneumatiques</option>
            </select>
          </div>
        </div>

        <!-- Quick Filters -->
        <div class="flex flex-wrap gap-2">
          <button *ngFor="let quick of quickFilters"
                  (click)="toggleQuickFilter(quick.id)"
                  [class]="'px-4 py-2 rounded-lg border transition ' + 
                          (quick.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500')">
            {{quick.icon}} {{quick.label}}
          </button>
        </div>
      </div>

      <!-- Map Placeholder -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div class="h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
          <div class="text-center">
            <div class="text-6xl mb-4">🗺️</div>
            <p class="text-gray-600 font-medium">Carte des garages à proximité</p>
            <p class="text-gray-500 text-sm">(Intégration Leaflet/Google Maps à venir)</p>
          </div>
        </div>
      </div>

      <!-- Results Count -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-800">
          {{filteredGarages.length}} garage(s) trouvé(s)
        </h2>
        <select [(ngModel)]="sortBy" (change)="applyFilters()"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="distance">Plus proche</option>
          <option value="rating">Mieux notés</option>
          <option value="name">Nom A-Z</option>
        </select>
      </div>

      <!-- Garages Grid -->
      <div class="grid md:grid-cols-2 gap-6">
        <div *ngFor="let garage of filteredGarages" 
             class="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
          <!-- Image -->
          <div [class]="'h-48 flex items-center justify-center text-white text-6xl ' + garage.gradientClass">
            🏢
          </div>

          <!-- Content -->
          <div class="p-6">
            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-800 mb-1">{{garage.name}}</h3>
                <div class="flex items-center text-yellow-500 mb-2">
                  <span *ngFor="let star of [1,2,3,4,5]" 
                        [class]="star <= garage.rating ? 'text-yellow-500' : 'text-gray-300'">
                    ⭐
                  </span>
                  <span class="ml-2 text-gray-600 text-sm">({{garage.reviews}} avis)</span>
                </div>
                <div class="flex flex-wrap gap-2 mb-3">
                  <span *ngFor="let spec of garage.specialties" 
                        class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {{spec}}
                  </span>
                </div>
              </div>
              <span *ngIf="garage.certified" 
                    class="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                ✓ Certifié
              </span>
            </div>

            <!-- Info -->
            <div class="space-y-2 mb-4">
              <div class="flex items-center text-gray-600">
                <span class="mr-3">📍</span>
                <span>{{garage.address}}</span>
              </div>
              <div class="flex items-center text-gray-600">
                <span class="mr-3">📞</span>
                <span>{{garage.phone}}</span>
              </div>
              <div class="flex items-center text-gray-600">
                <span class="mr-3">🕒</span>
                <span>{{garage.hours}}</span>
              </div>
              <div class="flex items-center">
                <span class="mr-3">🚗</span>
                <span class="font-medium text-blue-600">{{garage.distance}} km</span>
              </div>
            </div>

            <!-- Services -->
            <div class="mb-4">
              <div class="text-sm font-medium text-gray-700 mb-2">Services disponibles :</div>
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let service of garage.services" 
                      class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {{service}}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="grid grid-cols-2 gap-3">
              <button (click)="viewGarageDetails(garage)"
                      class="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                📄 Voir détails
              </button>
              <button (click)="contactGarage(garage)"
                      class="px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium">
                📞 Contacter
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="filteredGarages.length === 0" 
           class="bg-white rounded-xl shadow-md p-12 text-center">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Aucun garage trouvé</h3>
        <p class="text-gray-600 mb-6">Essayez de modifier vos critères de recherche</p>
        <button (click)="resetFilters()" 
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Réinitialiser les filtres
        </button>
      </div>

      <!-- CTA Banner -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-xl p-8 mt-12 text-white text-center">
        <h2 class="text-2xl font-bold mb-3">Vous êtes un professionnel ?</h2>
        <p class="mb-6 text-blue-100">Rejoignez notre réseau de garages partenaires et touchez plus de clients</p>
        <button class="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-bold">
          Devenir partenaire
        </button>
      </div>
    </div>
  `
})
export class GaragesComponent {
  searchQuery = '';
  sortBy = 'distance';
  
  filters = {
    city: 'all',
    specialty: 'all'
  };

  quickFilters = [
    { id: 'open', label: 'Ouvert maintenant', icon: '🕒', active: false },
    { id: 'certified', label: 'Certifiés', icon: '✓', active: false },
    { id: 'emergency', label: 'Dépannage', icon: '🚨', active: false },
    { id: 'rated', label: '4★ et +', icon: '⭐', active: false }
  ];

  garages = [
    {
      id: 1,
      name: 'Garage Central Tunis',
      address: '45 Avenue de la Liberté, Tunis 1002',
      city: 'tunis',
      phone: '71 123 456',
      hours: 'Lun-Sam 8h-18h',
      rating: 5,
      reviews: 124,
      distance: 2.5,
      certified: true,
      specialties: ['Mécanique générale', 'Carrosserie'],
      services: ['Vidange', 'Freins', 'Pneus', 'Diagnostic'],
      gradientClass: 'bg-gradient-to-br from-blue-500 to-blue-700'
    },
    {
      id: 2,
      name: 'Auto Service Ben Arous',
      address: '23 Rue de la République, Ben Arous 2013',
      city: 'tunis',
      phone: '71 234 567',
      hours: 'Lun-Sam 8h-17h',
      rating: 4,
      reviews: 87,
      distance: 5.2,
      certified: true,
      specialties: ['Électricité auto'],
      services: ['Diagnostic', 'Batterie', 'Alternateur'],
      gradientClass: 'bg-gradient-to-br from-green-500 to-green-700'
    },
    {
      id: 3,
      name: 'Pneus Pro Ariana',
      address: '12 Avenue Habib Bourguiba, Ariana 2080',
      city: 'tunis',
      phone: '71 345 678',
      hours: 'Lun-Ven 9h-18h',
      rating: 4,
      reviews: 65,
      distance: 7.8,
      certified: false,
      specialties: ['Pneumatiques'],
      services: ['Montage pneus', 'Équilibrage', 'Géométrie'],
      gradientClass: 'bg-gradient-to-br from-purple-500 to-purple-700'
    },
    {
      id: 4,
      name: 'Garage Express Sfax',
      address: '78 Avenue Ali Belhouane, Sfax 3000',
      city: 'sfax',
      phone: '74 456 789',
      hours: 'Lun-Sam 8h-19h',
      rating: 5,
      reviews: 156,
      distance: 245,
      certified: true,
      specialties: ['Mécanique générale', 'Climatisation'],
      services: ['Vidange', 'Clim', 'Révision complète'],
      gradientClass: 'bg-gradient-to-br from-orange-500 to-orange-700'
    }
  ];

  filteredGarages = [...this.garages];

  applyFilters() {
    this.filteredGarages = this.garages.filter(garage => {
      // Search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        const matchName = garage.name.toLowerCase().includes(query);
        const matchCity = garage.city.toLowerCase().includes(query);
        if (!matchName && !matchCity) return false;
      }

      // City filter
      if (this.filters.city !== 'all' && garage.city !== this.filters.city) {
        return false;
      }

      // Quick filters
      const certifiedFilter = this.quickFilters.find(f => f.id === 'certified');
      if (certifiedFilter?.active && !garage.certified) return false;

      const ratedFilter = this.quickFilters.find(f => f.id === 'rated');
      if (ratedFilter?.active && garage.rating < 4) return false;

      return true;
    });

    // Sorting
    if (this.sortBy === 'distance') {
      this.filteredGarages.sort((a, b) => a.distance - b.distance);
    } else if (this.sortBy === 'rating') {
      this.filteredGarages.sort((a, b) => b.rating - a.rating);
    } else if (this.sortBy === 'name') {
      this.filteredGarages.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  toggleQuickFilter(id: string) {
    const filter = this.quickFilters.find(f => f.id === id);
    if (filter) {
      filter.active = !filter.active;
      this.applyFilters();
    }
  }

  resetFilters() {
    this.searchQuery = '';
    this.filters = { city: 'all', specialty: 'all' };
    this.quickFilters.forEach(f => f.active = false);
    this.sortBy = 'distance';
    this.applyFilters();
  }

  viewGarageDetails(garage: any) {
    alert(`Détails de ${garage.name}\n\nNote : ${garage.rating}/5 ⭐\nDistance : ${garage.distance} km\nTéléphone : ${garage.phone}`);
  }

  contactGarage(garage: any) {
    if (confirm(`Contacter ${garage.name} au ${garage.phone} ?`)) {
      alert('Redirection vers l\'application téléphone...');
    }
  }
}