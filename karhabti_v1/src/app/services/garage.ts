// ============= src/app/services/garage.service.ts =============
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class GarageService {
  private garagesSubject = new BehaviorSubject<any[]>([]);
  public garages$ = this.garagesSubject.asObservable();

  constructor(private apiService: ApiService) {}

  // Charger les garages
  loadGarages(city?: string, specialty?: string): Observable<any> {
    return this.apiService.getGarages(city, specialty).pipe(
      tap(response => {
        this.garagesSubject.next(response.garages || []);
      })
    );
  }

  // Rechercher les garages
  searchGarages(query: string): Observable<any> {
    return this.apiService.searchGarages(query).pipe(
      tap(response => {
        this.garagesSubject.next(response.garages || []);
      })
    );
  }

  // Obtenir les garages actuels
  getGarages(): any[] {
    return this.garagesSubject.value;
  }

  // Obtenir les garages certifiés
  getCertifiedGarages(): any[] {
    return this.garagesSubject.value.filter(g => g.certified);
  }

  // Obtenir les meilleurs garages (rating >= 4)
  getTopRatedGarages(): any[] {
    return this.garagesSubject.value.filter(g => g.rating >= 4);
  }

  // Trier par distance
  sortByDistance(): any[] {
    return [...this.garagesSubject.value].sort((a, b) => a.distance - b.distance);
  }

  // Trier par rating
  sortByRating(): any[] {
    return [...this.garagesSubject.value].sort((a, b) => b.rating - a.rating);
  }
}