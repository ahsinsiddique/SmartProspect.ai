import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiResponse, Campaign, LinkedInAccount, PageResponse } from '../../../core/models';

@Component({
  selector: 'app-create-campaign',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <button mat-icon-button (click)="router.navigate(['/dashboard/campaigns'])">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h1>New Campaign</h1>
          <p class="subtitle">Set up a new outreach campaign</p>
        </div>
      </div>

      <div class="form-card">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Campaign Name</mat-label>
            <input matInput formControlName="name" placeholder="e.g. Q1 SaaS Outreach">
            @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
              <mat-error>Name is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description (optional)</mat-label>
            <textarea matInput formControlName="description" rows="3"
              placeholder="Briefly describe the purpose of this campaign"></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>LinkedIn Account</mat-label>
            <mat-select formControlName="linkedInAccountId">
              <mat-option [value]="null">None</mat-option>
              @for (account of accounts(); track account.id) {
                <mat-option [value]="account.id">{{ account.linkedinEmail }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          @if (serverError()) {
            <div class="error-banner">
              <mat-icon>error_outline</mat-icon>
              <span>{{ serverError() }}</span>
            </div>
          }

          <div class="form-actions">
            <button mat-stroked-button type="button"
              (click)="router.navigate(['/dashboard/campaigns'])">
              Cancel
            </button>
            <button mat-flat-button color="primary" type="submit"
              [disabled]="form.invalid || submitting()">
              @if (submitting()) {
                <mat-spinner diameter="18" style="display:inline-block"></mat-spinner>
              } @else {
                Create Campaign
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 640px; }
    .page-header { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
    h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0; }
    .subtitle { color: #64748b; margin: 4px 0 0; font-size: 14px; }
    .form-card { background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); padding: 24px; }
    .full-width { width: 100%; margin-bottom: 8px; }
    .error-banner { display: flex; align-items: center; gap: 8px; background: #fee2e2; color: #991b1b; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
  `]
})
export class CreateCampaignComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  router = inject(Router);

  accounts = signal<LinkedInAccount[]>([]);
  submitting = signal(false);
  serverError = signal<string | null>(null);

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    linkedInAccountId: [null as string | null]
  });

  ngOnInit(): void {
    this.http.get<ApiResponse<PageResponse<LinkedInAccount>>>('/api/v1/linkedin-accounts?size=100').subscribe({
      next: res => this.accounts.set(res.data.content),
      error: () => {}
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    this.serverError.set(null);
    this.http.post<ApiResponse<Campaign>>('/api/v1/campaigns', this.form.value).subscribe({
      next: res => {
        this.submitting.set(false);
        this.router.navigate(['/dashboard/campaigns', res.data.id]);
      },
      error: err => {
        this.submitting.set(false);
        this.serverError.set(err?.error?.message || 'Failed to create campaign');
      }
    });
  }
}
