import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Assistant Intelligent</h1>
        <p class="text-gray-600">Posez vos questions sur votre véhicule et obtenez des conseils personnalisés</p>
      </div>

      <!-- Chat Container -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Quick Actions -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <h3 class="text-white font-bold mb-4">Questions rapides</h3>
          <div class="grid md:grid-cols-4 gap-3">
            <button *ngFor="let quick of quickQuestions" 
                    (click)="sendQuickQuestion(quick)"
                    class="bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-lg hover:bg-white/30 transition text-sm text-left">
              <div class="mb-1">{{quick.icon}}</div>
              <div>{{quick.text}}</div>
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div #messagesContainer class="h-[500px] overflow-y-auto p-6 bg-gray-50">
          <div *ngFor="let message of messages" class="mb-6">
            <!-- User Message -->
            <div *ngIf="message.type === 'user'" class="flex justify-end">
              <div class="bg-blue-600 text-white rounded-2xl rounded-tr-none px-6 py-4 max-w-md">
                <p>{{message.text}}</p>
                <span class="text-xs text-blue-100 mt-2 block">{{message.time}}</span>
              </div>
            </div>

            <!-- Bot Message -->
            <div *ngIf="message.type === 'bot'" class="flex justify-start">
              <div class="flex items-start max-w-2xl">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-xl mr-3 flex-shrink-0">
                  🤖
                </div>
                <div>
                  <div class="bg-white rounded-2xl rounded-tl-none px-6 py-4 shadow-md">
                    <p class="text-gray-800 whitespace-pre-line">{{message.text}}</p>
                    <span class="text-xs text-gray-400 mt-2 block">{{message.time}}</span>
                  </div>
                  <!-- Actions -->
                  <div *ngIf="message.actions" class="flex space-x-2 mt-2">
                    <button *ngFor="let action of message.actions" 
                            (click)="handleAction(action)"
                            class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
                      {{action.label}}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Typing Indicator -->
            <div *ngIf="message.type === 'typing'" class="flex justify-start">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-xl mr-3">
                  🤖
                </div>
                <div class="bg-white rounded-2xl px-6 py-4 shadow-md">
                  <div class="flex space-x-2">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="border-t border-gray-200 p-4 bg-white">
          <form (ngSubmit)="sendMessage()" class="flex items-center space-x-3">
            <input 
              type="text" 
              [(ngModel)]="userInput"
              name="message"
              placeholder="Posez votre question..."
              class="flex-1 px-6 py-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button 
              type="submit"
              [disabled]="!userInput.trim() || isTyping"
              class="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </form>
          <p class="text-xs text-gray-500 mt-2 text-center">
            L'assistant peut faire des erreurs. Vérifiez les informations importantes.
          </p>
        </div>
      </div>

      <!-- Features -->
      <div class="grid md:grid-cols-3 gap-6 mt-8">
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="text-3xl mb-3">🔍</div>
          <h3 class="font-bold text-gray-800 mb-2">Diagnostic intelligent</h3>
          <p class="text-gray-600 text-sm">Décrivez vos symptômes et obtenez un diagnostic préliminaire</p>
        </div>
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="text-3xl mb-3">💡</div>
          <h3 class="font-bold text-gray-800 mb-2">Conseils personnalisés</h3>
          <p class="text-gray-600 text-sm">Recommendations basées sur votre véhicule et son historique</p>
        </div>
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="text-3xl mb-3">📚</div>
          <h3 class="font-bold text-gray-800 mb-2">Base de connaissances</h3>
          <p class="text-gray-600 text-sm">Accès à des milliers de guides et tutoriels</p>
        </div>
      </div>
    </div>
  `
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  userInput = '';
  isTyping = false;
  
  messages: {
    type: string;
    text: string;
    time: string;
    actions?: { label: string; action: string }[];
  }[] = [
    {
      type: 'bot',
      text: 'Bonjour ! Je suis votre assistant automobile intelligent. Comment puis-je vous aider aujourd\'hui ?',
      time: this.getTime()
    }
  ];

  quickQuestions = [
    { icon: '🔧', text: 'Quand faire ma prochaine vidange ?' },
    { icon: '🛞', text: 'Comment vérifier mes pneus ?' },
    { icon: '⚠️', text: 'Voyant moteur allumé' },
    { icon: '💰', text: 'Coût moyen révision' }
  ];

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    // Add user message
    this.messages.push({
      type: 'user',
      text: this.userInput,
      time: this.getTime()
    });

    const question = this.userInput.toLowerCase();
    this.userInput = '';

    // Show typing indicator
    this.isTyping = true;
    this.messages.push({ type: 'typing', text: '', time: '' });

    // Simulate bot response
    setTimeout(() => {
      this.messages.pop(); // Remove typing indicator
      this.isTyping = false;
      
      const response = this.generateResponse(question);
      this.messages.push({
        type: 'bot',
        text: response.text,
        time: this.getTime(),
        actions: response.actions
      });
    }, 1500);
  }

  sendQuickQuestion(quick: any) {
    this.userInput = quick.text;
    this.sendMessage();
  }

  generateResponse(question: string): any {
    // Simple response logic (à remplacer par une vraie IA)
    if (question.includes('vidange')) {
      return {
        text: `D'après les informations de votre Peugeot 208 (45 000 km), votre prochaine vidange est recommandée dans environ 500 km ou dans 5 jours.

Rappel : La vidange moteur est généralement recommandée tous les 10 000-15 000 km ou une fois par an.

Souhaitez-vous que je vous aide à prendre rendez-vous dans un garage partenaire ?`,
        actions: [
          { label: '📍 Trouver un garage', action: 'find_garage' },
          { label: '📅 Planifier', action: 'schedule' }
        ]
      };
    } else if (question.includes('pneu')) {
      return {
        text: `Pour vérifier vos pneus, voici les points essentiels :

✓ Pression : Vérifiez avec un manomètre (recommandé : 2.2-2.5 bars)
✓ Usure : Les témoins d'usure doivent être visibles (minimum 1.6mm)
✓ État général : Pas de coupures, hernies ou déformations
✓ Rotation : Tous les 10 000 km pour une usure uniforme

Voulez-vous que je vous rappelle de vérifier vos pneus régulièrement ?`,
        actions: [
          { label: '🔔 Activer rappel', action: 'set_reminder' }
        ]
      };
    } else if (question.includes('voyant')) {
      return {
        text: `Un voyant moteur allumé peut indiquer plusieurs problèmes. Les causes les plus fréquentes :

⚠️ Problème de sonde lambda
⚠️ Bouchon de réservoir mal fermé
⚠️ Catalyseur défectueux
⚠️ Problème d'allumage

Je vous recommande de faire un diagnostic OBD rapidement. Souhaitez-vous localiser un garage pour un diagnostic ?`,
        actions: [
          { label: '📍 Garages proches', action: 'find_garage' },
          { label: 'ℹ️ En savoir plus', action: 'more_info' }
        ]
      };
    } else if (question.includes('coût') || question.includes('prix') || question.includes('révision')) {
      return {
        text: `Le coût moyen d'une révision complète en Tunisie :

• Révision simple (vidange + filtres) : 120-180 DT
• Révision complète : 300-500 DT
• Grande révision : 500-800 DT

Ces tarifs peuvent varier selon la marque et le modèle de votre véhicule.

Pour votre Peugeot 208, je recommande une révision complète tous les 20 000 km.`,
        actions: [
          { label: '💰 Voir détails', action: 'price_details' }
        ]
      };
    } else {
      return {
        text: `Je suis là pour vous aider avec l'entretien de votre véhicule !

Je peux vous aider à :
• Planifier vos entretiens
• Diagnostiquer des problèmes
• Trouver des garages partenaires
• Estimer les coûts de réparation
• Vous donner des conseils d'entretien

Posez-moi votre question ou choisissez un sujet ci-dessus.`,
        actions: []
      };
    }
  }

  handleAction(action: any) {
    if (action.action === 'find_garage') {
      alert('Redirection vers la page Garages...');
    } else if (action.action === 'schedule') {
      alert('Ouverture du planificateur...');
    } else if (action.action === 'set_reminder') {
      alert('Rappel activé avec succès !');
    }
  }

  getTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = 
        this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}