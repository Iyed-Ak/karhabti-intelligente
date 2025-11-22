import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 class="text-5xl font-bold mb-6">
              Votre Assistant Automobile Intelligent
            </h1>
            <p class="text-xl mb-8 text-blue-100">
              Gérez l'entretien de votre véhicule, suivez vos infractions et 
              bénéficiez de conseils personnalisés avec Karhbti Intelligente.
            </p>
            <div class="flex space-x-4">
              <a routerLink="/register" 
                 class="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition">
                Commencer gratuitement
              </a>
              <a routerLink="/login" 
                 class="px-8 py-4 border-2 border-white rounded-lg font-bold hover:bg-white hover:text-blue-600 transition">
                Se connecter
              </a>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-white/20 rounded-full"></div>
                  <div class="flex-1 h-4 bg-white/20 rounded"></div>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-white/20 rounded-full"></div>
                  <div class="flex-1 h-4 bg-white/20 rounded"></div>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-white/20 rounded-full"></div>
                  <div class="flex-1 h-4 bg-white/20 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-800 mb-4">
            Fonctionnalités Principales
          </h2>
          <p class="text-xl text-gray-600">
            Tout ce dont vous avez besoin pour gérer votre véhicule
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div *ngFor="let feature of features" 
               class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <span class="text-3xl">{{feature.icon}}</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-4">{{feature.title}}</h3>
            <p class="text-gray-600">{{feature.description}}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="bg-blue-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div class="text-5xl font-bold mb-2">200+</div>
            <div class="text-blue-100">Utilisateurs actifs</div>
          </div>
          <div>
            <div class="text-5xl font-bold mb-2">85%</div>
            <div class="text-blue-100">Satisfaction client</div>
          </div>
          <div>
            <div class="text-5xl font-bold mb-2">30%</div>
            <div class="text-blue-100">Réduction des oublis</div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-800 mb-4">
            Comment ça marche ?
          </h2>
        </div>

        <div class="grid md:grid-cols-4 gap-8">
          <div *ngFor="let step of steps; let i = index" class="text-center">
            <div class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {{i + 1}}
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">{{step.title}}</h3>
            <p class="text-gray-600">{{step.description}}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gray-800 text-white py-20">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold mb-6">
          Prêt à commencer ?
        </h2>
        <p class="text-xl text-gray-300 mb-8">
          Rejoignez des centaines de conducteurs qui font confiance à Karhbti Intelligente
        </p>
        <a routerLink="/register" 
           class="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
          Créer un compte gratuit
        </a>
      </div>
    </section>
  `
})
export class HomeComponent {
  features = [
    {
      icon: '🔧',
      title: 'Suivi d\'entretien',
      description: 'Suivez tous vos entretiens et recevez des rappels automatiques avant chaque échéance.'
    },
    {
      icon: '🚨',
      title: 'Gestion des infractions',
      description: 'Enregistrez et suivez vos contraventions pour ne jamais oublier une échéance.'
    },
    {
      icon: '🤖',
      title: 'Chatbot intelligent',
      description: 'Obtenez des diagnostics et des conseils personnalisés pour votre véhicule.'
    },
    {
      icon: '📊',
      title: 'Tableau de bord',
      description: 'Visualisez vos dépenses, statistiques et l\'état de votre véhicule en un coup d\'œil.'
    },
    {
      icon: '📍',
      title: 'Garages partenaires',
      description: 'Trouvez les meilleurs garages près de chez vous avec géolocalisation.'
    },
    {
      icon: '🔔',
      title: 'Notifications',
      description: 'Recevez des alertes pour ne jamais manquer un entretien important.'
    }
  ];

  steps = [
    {
      title: 'Inscrivez-vous',
      description: 'Créez votre compte en quelques secondes'
    },
    {
      title: 'Ajoutez votre voiture',
      description: 'Enregistrez les informations de votre véhicule'
    },
    {
      title: 'Suivez l\'entretien',
      description: 'Planifiez et suivez vos maintenances'
    },
    {
      title: 'Restez informé',
      description: 'Recevez des alertes et conseils personnalisés'
    }
  ];
}