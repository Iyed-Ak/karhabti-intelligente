import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation -->
      <nav class="bg-white shadow-lg sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <a routerLink="/" class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span class="text-white text-xl font-bold">K</span>
              </div>
              <span class="text-xl font-bold text-gray-800">Karhbti Intelligente</span>
            </a>

            <!-- Desktop Menu -->
            <div class="hidden md:flex space-x-8">
              <a routerLink="/" routerLinkActive="text-primary" [routerLinkActiveOptions]="{exact: true}"
                 class="text-gray-600 hover:text-primary transition">
                Accueil
              </a>
              <a routerLink="/dashboard" routerLinkActive="text-primary"
                 class="text-gray-600 hover:text-primary transition">
                Tableau de bord
              </a>
              <a routerLink="/vehicles" routerLinkActive="text-primary"
                 class="text-gray-600 hover:text-primary transition">
                Mes Voitures
              </a>
              <a routerLink="/maintenance" routerLinkActive="text-primary"
                 class="text-gray-600 hover:text-primary transition">
                Entretien
              </a>
              <a routerLink="/chatbot" routerLinkActive="text-primary"
                 class="text-gray-600 hover:text-primary transition">
                Assistant
              </a>
            </div>

            <!-- Auth Buttons -->
            <div class="hidden md:flex space-x-4">
              <a routerLink="/login" 
                 class="px-4 py-2 text-primary hover:bg-blue-50 rounded-lg transition">
                Connexion
              </a>
              <a routerLink="/register" 
                 class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition">
                Inscription
              </a>
            </div>

            <!-- Mobile Menu Button -->
            <button (click)="toggleMenu()" class="md:hidden p-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>

          <!-- Mobile Menu -->
          <div *ngIf="menuOpen" class="md:hidden py-4 space-y-2">
            <a routerLink="/" (click)="toggleMenu()"
               class="block px-4 py-2 hover:bg-gray-100 rounded">Accueil</a>
            <a routerLink="/dashboard" (click)="toggleMenu()"
               class="block px-4 py-2 hover:bg-gray-100 rounded">Tableau de bord</a>
            <a routerLink="/vehicles" (click)="toggleMenu()"
               class="block px-4 py-2 hover:bg-gray-100 rounded">Mes Voitures</a>
            <a routerLink="/maintenance" (click)="toggleMenu()"
               class="block px-4 py-2 hover:bg-gray-100 rounded">Entretien</a>
            <a routerLink="/chatbot" (click)="toggleMenu()"
               class="block px-4 py-2 hover:bg-gray-100 rounded">Assistant</a>
            <div class="border-t pt-2 space-y-2">
              <a routerLink="/login" (click)="toggleMenu()"
                 class="block px-4 py-2 text-primary">Connexion</a>
              <a routerLink="/register" (click)="toggleMenu()"
                 class="block px-4 py-2 bg-primary text-white rounded">Inscription</a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Page Content -->
      <main>
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-gray-800 text-white mt-16">
        <div class="max-w-7xl mx-auto px-4 py-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 class="text-lg font-bold mb-4">Karhbti Intelligente</h3>
              <p class="text-gray-400">Votre assistant numérique automobile</p>
            </div>
            <div>
              <h4 class="font-bold mb-4">Liens rapides</h4>
              <ul class="space-y-2 text-gray-400">
                <li><a routerLink="/dashboard" class="hover:text-white">Tableau de bord</a></li>
                <li><a routerLink="/vehicles" class="hover:text-white">Mes véhicules</a></li>
                <li><a routerLink="/garages" class="hover:text-white">Garages partenaires</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-bold mb-4">Contact</h4>
              <p class="text-gray-400">ISET - Projet universitaire</p>
              <p class="text-gray-400">Par Iyed Akrimi</p>
            </div>
          </div>
          <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Karhbti Intelligente. Projet universitaire ISET.</p>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class App {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}