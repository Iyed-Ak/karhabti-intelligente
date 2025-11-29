import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div class="max-w-md w-full">
        <!-- Card -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <!-- Logo & Title -->
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <span class="text-white text-2xl font-bold">K</span>
            </div>
            <h2 class="text-3xl font-bold text-gray-800">Connexion</h2>
            <p class="text-gray-600 mt-2">Accédez à votre compte Karhbti</p>
          </div>

          <!-- Messages -->
          <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600 text-sm">{{errorMessage}}</p>
          </div>

          <!-- Form -->
          <form (ngSubmit)="onLogin()" #loginForm="ngForm">
            <!-- Email -->
            <div class="mb-6">
              <label class="block text-gray-700 font-medium mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                [(ngModel)]="credentials.email"
                required
                email
                #email="ngModel"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="votre@email.com"
              />
              <div *ngIf="email.invalid && email.touched" class="text-red-500 text-sm mt-1">
                Email valide requis
              </div>
            </div>

            <!-- Password -->
            <div class="mb-6">
              <label class="block text-gray-700 font-medium mb-2">Mot de passe</label>
              <input 
                type="password" 
                name="password"
                [(ngModel)]="credentials.password"
                required
                minlength="6"
                #password="ngModel"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
              <div *ngIf="password.invalid && password.touched" class="text-red-500 text-sm mt-1">
                Mot de passe requis (min. 6 caractères)
              </div>
            </div>

            <!-- Remember & Forgot -->
            <div class="flex items-center justify-between mb-6">
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  name="remember"
                  [(ngModel)]="rememberMe"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="ml-2 text-gray-600">Se souvenir de moi</span>
              </label>
              <a href="#" class="text-blue-600 hover:text-blue-700 text-sm">
                Mot de passe oublié ?
              </a>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit"
              [disabled]="!loginForm.valid || isLoading"
              class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <span *ngIf="!isLoading">Se connecter</span>
              <span *ngIf="isLoading">Connexion en cours...</span>
            </button>
          </form>

          <!-- Sign Up Link -->
          <p class="text-center text-gray-600 mt-6">
            Pas encore de compte ?
            <a routerLink="/register" class="text-blue-600 hover:text-blue-700 font-medium">
              S'inscrire
            </a>
          </p>
        </div>

        <!-- Info -->
        <p class="text-center text-gray-500 text-sm mt-6">
          En vous connectant, vous acceptez nos conditions d'utilisation
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  
  rememberMe = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.credentials.email, this.credentials.password).subscribe({
      next: (response) => {
        console.log('Connexion réussie:', response);
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Erreur de connexion:', error);
        this.isLoading = false;
        
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect';
        } else if (error.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur';
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    });
  }
}