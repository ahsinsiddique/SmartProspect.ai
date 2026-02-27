import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User, AuthResponse, ApiResponse } from '../models';

const API = '/api/v1/auth';
const TOKEN_KEY = 'prospects_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());

  constructor() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      this.loadCurrentUser().subscribe({ error: () => this.clearToken() });
    }
  }

  register(data: { firstName: string; lastName: string; email: string; password: string }): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${API}/register`, data).pipe(
      tap(res => { if (res.success) this.setToken(res.data.token); })
    );
  }

  login(email: string, password: string): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${API}/login`, { email, password }).pipe(
      tap(res => {
        if (res.success) {
          this.setToken(res.data.token);
          this.currentUser.set({
            id: res.data.userId,
            email: res.data.email,
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            role: res.data.role,
            isActive: true,
            createdAt: new Date().toISOString()
          });
        }
      })
    );
  }

  loadCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${API}/me`).pipe(
      tap(res => { if (res.success) this.currentUser.set(res.data); })
    );
  }

  logout(): void {
    this.clearToken();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  private clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
