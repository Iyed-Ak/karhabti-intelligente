// ============= src/app/services/vehicle.service.ts =============
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private vehiclesSubject = new BehaviorSubject<any[]>([]);
  public vehicles$ = this.vehiclesSubject.asObservable();

  constructor(private apiService: ApiService) {}

  // Charger tous les véhicules
  loadVehicles(): Observable<any> {
    return this.apiService.getVehicles().pipe(
      tap(response => {
        this.vehiclesSubject.next(response.vehicles || []);
      })
    );
  }

  // Ajouter un véhicule
  addVehicle(vehicleData: any): Observable<any> {
    return this.apiService.addVehicle(vehicleData).pipe(
      tap(response => {
        const currentVehicles = this.vehiclesSubject.value;
        this.vehiclesSubject.next([...currentVehicles, response.vehicle]);
      })
    );
  }

  // Mettre à jour un véhicule
  updateVehicle(id: string, vehicleData: any): Observable<any> {
    return this.apiService.updateVehicle(id, vehicleData).pipe(
      tap(response => {
        const vehicles = this.vehiclesSubject.value.map(v =>
          v._id === id ? response.vehicle : v
        );
        this.vehiclesSubject.next(vehicles);
      })
    );
  }

  // Supprimer un véhicule
  deleteVehicle(id: string): Observable<any> {
    return this.apiService.deleteVehicle(id).pipe(
      tap(() => {
        const vehicles = this.vehiclesSubject.value.filter(v => v._id !== id);
        this.vehiclesSubject.next(vehicles);
      })
    );
  }

  // Obtenir les véhicules actuels
  getVehicles(): any[] {
    return this.vehiclesSubject.value;
  }

  // Obtenir un véhicule spécifique
  getVehicleById(id: string): any {
    return this.vehiclesSubject.value.find(v => v._id === id);
  }

  // Obtenir les stats d'un véhicule
  getVehicleStats(id: string): Observable<any> {
    return this.apiService.getVehicleStats(id);
  }
}