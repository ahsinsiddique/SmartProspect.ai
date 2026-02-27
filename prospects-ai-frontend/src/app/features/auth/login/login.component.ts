import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="logo">
          <mat-icon>rocket_launch</mat-icon>
          <span>Prospects.ai</span>
        </div>
        <h1>Welcome back</h1>
        <p class="subtitle">Sign in to your account</p>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" placeholder="you@example.com" autocomplete="email">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" [type]="showPassword() ? 'text' : 'password'" autocomplete="current-password">
            <button mat-icon-button matSuffix type="button" (click)="showPassword.set(!showPassword())">
              <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>

          @if (error()) {
            <div class="error-banner">
              <mat-icon>error_outline</mat-icon>
              <span>{{ error() }}</span>
            </div>
          }

          <button mat-flat-button color="primary" type="submit" class="submit-btn"
            [disabled]="form.invalid || loading()">
            @if (loading()) {
              <mat-spinner diameter="20" style="display:inline-block"></mat-spinner>
            } @else {
              Sign in
            }
          </button>
        </form>

        <p class="footer-link">Don't have an account? <a routerLink="/register">Sign up</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; padding: 24px; }
    .auth-card { background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); padding: 40px; width: 100%; max-width: 400px; }
    .logo { display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 700; color: #4f46e5; margin-bottom: 24px; }
    .logo mat-icon { color: #4f46e5; }
    h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0 0 4px; }
    .subtitle { color: #64748b; font-size: 14px; margin: 0 0 24px; }
    .full-width { width: 100%; margin-bottom: 4px; }
    .error-banner { display: flex; align-items: center; gap: 8px; background: #fee2e2; color: #991b1b; padding: 10px 14px; border-radius: 8px; font-size: 14px; margin-bottom: 12px; }
    .submit-btn { width: 100%; margin-top: 8px; height: 44px; font-size: 15px; }
    .footer-link { text-align: center; font-size: 14px; color: #64748b; margin: 16px 0 0; }
    .footer-link a { color: #4f46e5; text-decoration: none; font-weight: 500; }
    .footer-link a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Invalid email or password');
      }
    });
  }
}
