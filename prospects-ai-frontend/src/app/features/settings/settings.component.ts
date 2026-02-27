import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatDividerModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Settings</h1>
        <p class="subtitle">Manage your account preferences</p>
      </div>

      <div class="settings-card">
        <h2>Profile</h2>
        <mat-divider></mat-divider>

        @if (auth.currentUser(); as user) {
          <div class="profile-section">
            <div class="avatar">{{ user.firstName[0] }}{{ user.lastName[0] }}</div>
            <div class="profile-info">
              <p class="name">{{ user.firstName }} {{ user.lastName }}</p>
              <p class="email">{{ user.email }}</p>
              <p class="role">{{ user.role }}</p>
            </div>
          </div>
        }

        <mat-divider></mat-divider>

        <h2 style="margin-top: 20px;">Change Password</h2>
        <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="form-section">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Current Password</mat-label>
            <input matInput formControlName="currentPassword" type="password" autocomplete="current-password">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>New Password</mat-label>
            <input matInput formControlName="newPassword" type="password" autocomplete="new-password">
            @if (passwordForm.get('newPassword')?.hasError('minlength') && passwordForm.get('newPassword')?.touched) {
              <mat-error>Password must be at least 8 characters</mat-error>
            }
          </mat-form-field>

          @if (passwordSuccess()) {
            <div class="success-banner">
              <mat-icon>check_circle</mat-icon>
              <span>Password updated successfully</span>
            </div>
          }
          @if (passwordError()) {
            <div class="error-banner">
              <mat-icon>error_outline</mat-icon>
              <span>{{ passwordError() }}</span>
            </div>
          }

          <div class="form-actions">
            <button mat-flat-button color="primary" type="submit"
              [disabled]="passwordForm.invalid || changingPassword()">
              @if (changingPassword()) {
                <mat-spinner diameter="18" style="display:inline-block"></mat-spinner>
              } @else {
                Update Password
              }
            </button>
          </div>
        </form>

        <mat-divider></mat-divider>

        <div class="danger-zone">
          <h2>Account</h2>
          <button mat-stroked-button color="warn" (click)="auth.logout()">
            <mat-icon>logout</mat-icon>
            Sign out
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 640px; }
    .page-header { margin-bottom: 24px; }
    h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0; }
    .subtitle { color: #64748b; margin: 4px 0 0; font-size: 14px; }
    .settings-card { background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); padding: 24px; }
    h2 { font-size: 15px; font-weight: 600; color: #0f172a; margin: 0 0 16px; }
    .profile-section { display: flex; align-items: center; gap: 16px; padding: 16px 0; }
    .avatar { width: 56px; height: 56px; border-radius: 50%; background: #4f46e5; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; flex-shrink: 0; }
    .name { font-weight: 600; color: #0f172a; font-size: 16px; margin: 0 0 2px; }
    .email { color: #64748b; font-size: 14px; margin: 0 0 2px; }
    .role { color: #94a3b8; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
    .form-section { padding: 16px 0; display: flex; flex-direction: column; gap: 4px; }
    .full-width { width: 100%; }
    .error-banner { display: flex; align-items: center; gap: 8px; background: #fee2e2; color: #991b1b; padding: 10px 14px; border-radius: 8px; font-size: 14px; }
    .success-banner { display: flex; align-items: center; gap: 8px; background: #f0fdf4; color: #166534; padding: 10px 14px; border-radius: 8px; font-size: 14px; }
    .form-actions { display: flex; justify-content: flex-end; margin-top: 4px; }
    .danger-zone { padding-top: 20px; }
  `]
})
export class SettingsComponent {
  auth = inject(AuthService);
  private fb = inject(FormBuilder);

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]]
  });

  changingPassword = signal(false);
  passwordError = signal<string | null>(null);
  passwordSuccess = signal(false);

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    this.changingPassword.set(true);
    this.passwordError.set(null);
    this.passwordSuccess.set(false);
    // Password change API call would go here
    setTimeout(() => {
      this.changingPassword.set(false);
      this.passwordSuccess.set(true);
      this.passwordForm.reset();
    }, 800);
  }
}
