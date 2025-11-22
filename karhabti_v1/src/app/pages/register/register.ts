import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div class="max-w-md w-full">
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <!-- Logo & Title -->
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <span class="text-white text-2xl font-bold">K</span>
            </div>
            <h2 class="text-3xl font-bold text-gray-800">Inscription</h2>
            <p class="text-gray-600 mt-2">Créez votre compte gratuitement</p>
          </div>

          <!-- Form -->
          <form (ngSubmit)="onRegister()" #registerForm="ngForm">
            <!-- Name -->
            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">
                Nom complet
              </label>
              <input 
                type="text" 
                name="name"
                [(ngModel)]="user.name"
                required
                minlength="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Iyed Akrimi"
              />
            </div>

            <!-- Email -->
            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input 
                type="email" 
                name="email"
                [(ngModel)]="user.email"
                required
                email
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="votre@email.com"
              />
            </div>

            <!-- Phone -->
            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">
                Téléphone
              </label>
              <input 
                type="tel" 
                name="phone"
                [(ngModel)]="user.phone"
                required
                pattern="[0-9]{8}"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="12345678"
              />
            </div>

            <!-- Password -->
            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">
                Mot de passe
              </label>
              <input 
                type="password" 
                name="password"
                [(ngModel)]="user.password"
                required
                minlength="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
              <p class="text-sm text-gray-500 mt-1">Minimum 6 caractères</p>
            </div>

            <!-- Confirm Password -->
            <div class="mb-6">
              <label class="block text-gray-700 font-medium mb-2">
                Confirmer le mot de passe
              </label>
              <input 
                type="password" 
                name="confirmPassword"
                [(ngModel)]="confirmPassword"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
              <p *ngIf="confirmPassword && user.password !== confirmPassword" 
                 class="text-sm text-red-500 mt-1">
                Les mots de passe ne correspondent pas
              </p>
            </div>

            <!-- Terms -->
            <div class="mb-6">
              <label class="flex items-start">
                <input 
                  type="checkbox" 
                  name="terms"
                  [(ngModel)]="acceptTerms"
                  required
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                <span class="ml-2 text-gray-600 text-sm">
                  J'accepte les 
                  <a href="#" class="text-blue-600 hover:text-blue-700">conditions d'utilisation</a>
                  et la 
                  <a href="#" class="text-blue-600 hover:text-blue-700">politique de confidentialité</a>
                </span>
              </label>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit"
              [disabled]="!registerForm.valid || user.password !== confirmPassword"
              class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Créer mon compte
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-gray-500">Ou s'inscrire avec</span>
            </div>
          </div>

          <!-- Social Login -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <button class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <svg class="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          <!-- Login Link -->
          <p class="text-center text-gray-600">
            Vous avez déjà un compte ?
            <a routerLink="/login" class="text-blue-600 hover:text-blue-700 font-medium">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    phone: '',
    password: ''
  };
  
  confirmPassword = '';
  acceptTerms = false;

  onRegister() {
    if (this.user.password !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    
    console.log('Register:', this.user);
    // TODO: Implement registration service
    alert('Inscription réussie ! (À implémenter avec le backend)');
  }
}