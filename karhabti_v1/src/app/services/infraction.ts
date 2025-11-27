// ============= src/app/services/infraction.service.ts =============
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class InfractionService {
  private infractionsSubject = new BehaviorSubject<any[]>([]);
  public infractions$ = this.infractionsSubject.asObservable();

  constructor(private apiService: ApiService) {}

  // Charger toutes les infractions
  loadInfractions(): Observable<any> {
    return this.apiService.getInfractions().pipe(
      tap(response => {
        this.infractionsSubject.next(response.infractions || []);
      })
    );
  }

  // Ajouter une infraction
  addInfraction(infractionData: any): Observable<any> {
    return this.apiService.addInfraction(infractionData).pipe(
      tap(response => {
        const currentInfractions = this.infractionsSubject.value;
        this.infractionsSubject.next([...currentInfractions, response.infraction]);
      })
    );
  }

  // Marquer comme payée
  markAsPaid(id: string): Observable<any> {
    return this.apiService.markInfractionAsPaid(id).pipe(
      tap(response => {
        const infractions = this.infractionsSubject.value.map(i =>
          i._id === id ? response.infraction : i
        );
        this.infractionsSubject.next(infractions);
      })
    );
  }

  // Supprimer une infraction
  deleteInfraction(id: string): Observable<any> {
    return this.apiService.deleteInfraction(id).pipe(
      tap(() => {
        const infractions = this.infractionsSubject.value.filter(i => i._id !== id);
        this.infractionsSubject.next(infractions);
      })
    );
  }

  // Obtenir les infractions actuelles
  getInfractions(): any[] {
    return this.infractionsSubject.value;
  }

  // Obtenir les infractions en attente
  getPendingInfractions(): any[] {
    return this.infractionsSubject.value.filter(i => i.status === 'pending');
  }

  // Obtenir les infractions payées
  getPaidInfractions(): any[] {
    return this.infractionsSubject.value.filter(i => i.status === 'paid');
  }

  // Obtenir le total des amendes
  getTotalAmount(): number {
    return this.infractionsSubject.value.reduce((sum, i) => sum + i.amount, 0);
  }
}
