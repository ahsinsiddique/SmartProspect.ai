import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { Campaign, ApiResponse, PageResponse } from '../../../core/models';

@Component({
  selector: 'app-campaigns-list',
  standalone: true,
  imports: [
    RouterLink, DatePipe,
    MatTableModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule,
    StatusBadgeComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Campaigns</h1>
          <p class="subtitle">Manage your outreach campaigns</p>
        </div>
        <button mat-flat-button color="primary" routerLink="/dashboard/campaigns/create">
          <mat-icon>add</mat-icon> New Campaign
        </button>
      </div>

      @if (loading()) {
        <div class="loading-center">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (error()) {
        <div class="error-banner">
          <mat-icon>error_outline</mat-icon>
          <span>{{ error() }}</span>
        </div>
      } @else {
        <div class="table-card">
          <table mat-table [dataSource]="campaigns()">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Campaign</th>
              <td mat-cell *matCellDef="let c">
                <a class="campaign-link" [routerLink]="['/dashboard/campaigns', c.id]">{{ c.name }}</a>
                @if (c.description) {
                  <p class="description">{{ c.description }}</p>
                }
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let c">
                <app-status-badge [status]="c.status"></app-status-badge>
              </td>
            </ng-container>

            <ng-container matColumnDef="enrolled">
              <th mat-header-cell *matHeaderCellDef>Enrolled</th>
              <td mat-cell *matCellDef="let c">{{ c.totalEnrolled }}</td>
            </ng-container>

            <ng-container matColumnDef="connected">
              <th mat-header-cell *matHeaderCellDef>Connected</th>
              <td mat-cell *matCellDef="let c">{{ c.totalConnected }}</td>
            </ng-container>

            <ng-container matColumnDef="replied">
              <th mat-header-cell *matHeaderCellDef>Replied</th>
              <td mat-cell *matCellDef="let c">{{ c.totalReplied }}</td>
            </ng-container>

            <ng-container matColumnDef="account">
              <th mat-header-cell *matHeaderCellDef>LinkedIn Account</th>
              <td mat-cell *matCellDef="let c">{{ c.linkedInAccountName || '—' }}</td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>Created</th>
              <td mat-cell *matCellDef="let c">{{ c.createdAt | date:'mediumDate' }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;" class="clickable-row"
                (click)="router.navigate(['/dashboard/campaigns', row.id])"></tr>
          </table>

          @if (campaigns().length === 0) {
            <div class="empty-state">
              <mat-icon>campaign</mat-icon>
              <p>No campaigns yet</p>
              <button mat-flat-button color="primary" routerLink="/dashboard/campaigns/create">
                Create your first campaign
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0; }
    .subtitle { color: #64748b; margin: 4px 0 0; font-size: 14px; }
    .loading-center { display: flex; justify-content: center; padding: 60px 0; }
    .error-banner { display: flex; align-items: center; gap: 8px; background: #fee2e2; color: #991b1b; padding: 12px 16px; border-radius: 8px; }
    .table-card { background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); overflow: hidden; }
    table { width: 100%; }
    th { color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .campaign-link { font-weight: 600; color: #4f46e5; text-decoration: none; }
    .campaign-link:hover { text-decoration: underline; }
    .description { color: #64748b; font-size: 12px; margin: 2px 0 0; }
    .clickable-row { cursor: pointer; }
    .clickable-row:hover { background: #f8fafc; }
    .empty-state { text-align: center; padding: 48px; color: #94a3b8; }
    .empty-state mat-icon { font-size: 48px; height: 48px; width: 48px; display: block; margin: 0 auto 8px; }
    .empty-state p { margin: 0 0 16px; }
  `]
})
export class CampaignsListComponent implements OnInit {
  private http = inject(HttpClient);
  router = inject(Router);

  campaigns = signal<Campaign[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  columns = ['name', 'status', 'enrolled', 'connected', 'replied', 'account', 'createdAt'];

  ngOnInit(): void {
    this.http.get<ApiResponse<PageResponse<Campaign>>>('/api/v1/campaigns?size=50').subscribe({
      next: res => {
        this.campaigns.set(res.data.content);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load campaigns');
        this.loading.set(false);
      }
    });
  }
}
