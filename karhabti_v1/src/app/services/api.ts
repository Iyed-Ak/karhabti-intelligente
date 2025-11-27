// ============= src/app/services/api.service.ts =============/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // Ajouter le header Authorization automatiquement
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // ============= AUTH REQUESTS =============
  register(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {});
  }

  refreshToken(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/refresh`,
      {},
      { headers: this.getHeaders() }
    );
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/auth/me`,
      { headers: this.getHeaders() }
    );
  }

  // ============= USER REQUESTS =============
  getUserProfile(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/users/profile`,
      { headers: this.getHeaders() }
    );
  }

  updateUserProfile(userData: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/users/profile`,
      userData,
      { headers: this.getHeaders() }
    );
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/users/account`,
      { headers: this.getHeaders() }
    );
  }

  // ============= VEHICLE REQUESTS =============
  getVehicles(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/vehicles`,
      { headers: this.getHeaders() }
    );
  }

  getVehicle(id: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/vehicles/${id}`,
      { headers: this.getHeaders() }
    );
  }

  addVehicle(vehicleData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/vehicles`,
      vehicleData,
      { headers: this.getHeaders() }
    );
  }

  updateVehicle(id: string, vehicleData: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/vehicles/${id}`,
      vehicleData,
      { headers: this.getHeaders() }
    );
  }

  deleteVehicle(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/vehicles/${id}`,
      { headers: this.getHeaders() }
    );
  }

  getVehicleStats(id: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/vehicles/${id}/stats`,
      { headers: this.getHeaders() }
    );
  }

  // ============= MAINTENANCE REQUESTS =============
  getMaintenances(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/maintenance`,
      { headers: this.getHeaders() }
    );
  }

  addMaintenance(maintenanceData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/maintenance`,
      maintenanceData,
      { headers: this.getHeaders() }
    );
  }

  updateMaintenance(id: string, maintenanceData: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/maintenance/${id}`,
      maintenanceData,
      { headers: this.getHeaders() }
    );
  }

  deleteMaintenance(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/maintenance/${id}`,
      { headers: this.getHeaders() }
    );
  }

  // ============= INFRACTION REQUESTS =============
  getInfractions(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/infractions`,
      { headers: this.getHeaders() }
    );
  }

  addInfraction(infractionData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/infractions`,
      infractionData,
      { headers: this.getHeaders() }
    );
  }

  markInfractionAsPaid(id: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/infractions/${id}/pay`,
      {},
      { headers: this.getHeaders() }
    );
  }

  deleteInfraction(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/infractions/${id}`,
      { headers: this.getHeaders() }
    );
  }

  // ============= GARAGE REQUESTS =============
  getGarages(city?: string, specialty?: string): Observable<any> {
    let url = `${this.apiUrl}/garages`;
    const params = new URLSearchParams();

    if (city) params.append('city', city);
    if (specialty) params.append('specialty', specialty);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.http.get(url);
  }

  searchGarages(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/garages/search?q=${query}`);
  }

  // ============= HEALTH CHECK =============
  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }
}