// ============= src/app/services/maintenance.service.ts =============
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private maintenancesSubject = new BehaviorSubject<any[]>([]);
  public maintenances$ = this.maintenancesSubject.asObservable();

  constructor(private apiService: ApiService) {}

  // Charger tous les entretiens
  loadMaintenances(): Observable<any> {
    return this.apiService.getMaintenances().pipe(
      tap(response => {
        this.maintenancesSubject.next(response.maintenances || []);
      })
    );
  }

  // Ajouter un entretien
  addMaintenance(maintenanceData: any): Observable<any> {
    return this.apiService.addMaintenance(maintenanceData).pipe(
      tap(response => {
        const currentMaintenances = this.maintenancesSubject.value;
        this.maintenancesSubject.next([...currentMaintenances, response.maintenance]);
      })
    );
  }

  // Mettre à jour un entretien
  updateMaintenance(id: string, maintenanceData: any): Observable<any> {
    return this.apiService.updateMaintenance(id, maintenanceData).pipe(
      tap(response => {
        const maintenances = this.maintenancesSubject.value.map(m =>
          m._id === id ? response.maintenance : m
        );
        this.maintenancesSubject.next(maintenances);
      })
    );
  }

  // Supprimer un entretien
  deleteMaintenance(id: string): Observable<any> {
    return this.apiService.deleteMaintenance(id).pipe(
      tap(() => {
        const maintenances = this.maintenancesSubject.value.filter(m => m._id !== id);
        this.maintenancesSubject.next(maintenances);
      })
    );
  }

  // Obtenir les entretiens actuels
  getMaintenances(): any[] {
    return this.maintenancesSubject.value;
  }

  // Obtenir les prochains entretiens
  getUpcomingMaintenances(): any[] {
    return this.maintenancesSubject.value.filter(m => m.status === 'planned');
  }

  // Obtenir l'historique des entretiens
  getMaintenanceHistory(): any[] {
    return this.maintenancesSubject.value.filter(m => m.status === 'completed');
  }
}