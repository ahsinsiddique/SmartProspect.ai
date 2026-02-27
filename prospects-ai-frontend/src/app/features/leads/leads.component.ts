import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { Lead, ApiResponse, PageResponse } from '../../core/models';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [
    DatePipe,
    MatTableModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatChipsModule, MatTooltipModule,
    StatusBadgeComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Leads</h1>
          <p class="subtitle">Manage your prospecting leads</p>
        </div>
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
          <table mat-table [dataSource]="leads()">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let lead">
                {{ lead.firstName }} {{ lead.lastName }}
                @if (!lead.firstName && !lead.lastName) { <span class="muted">—</span> }
              </td>
            </ng-container>

            <ng-container matColumnDef="company">
              <th mat-header-cell *matHeaderCellDef>Company</th>
              <td mat-cell *matCellDef="let lead">{{ lead.company || '—' }}</td>
            </ng-container>

            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Title</th>
              <td mat-cell *matCellDef="let lead">{{ lead.title || '—' }}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let lead">{{ lead.email || '—' }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let lead">
                <app-status-badge [status]="lead.status"></app-status-badge>
              </td>
            </ng-container>

            <ng-container matColumnDef="source">
              <th mat-header-cell *matHeaderCellDef>Source</th>
              <td mat-cell *matCellDef="let lead">{{ lead.source }}</td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>Created</th>
              <td mat-cell *matCellDef="let lead">{{ lead.createdAt | date:'mediumDate' }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>

          @if (leads().length === 0) {
            <div class="empty-state">
              <mat-icon>person_search</mat-icon>
              <p>No leads found</p>
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
    .muted { color: #94a3b8; }
    .empty-state { text-align: center; padding: 48px; color: #94a3b8; }
    .empty-state mat-icon { font-size: 48px; height: 48px; width: 48px; }
    .empty-state p { margin: 8px 0 0; }
  `]
})
export class LeadsComponent implements OnInit {
  private http = inject(HttpClient);

  leads = signal<Lead[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  columns = ['name', 'company', 'title', 'email', 'status', 'source', 'createdAt'];

  ngOnInit(): void {
    this.http.get<ApiResponse<PageResponse<Lead>>>('/api/v1/leads?size=50').subscribe({
      next: res => {
        this.leads.set(res.data.content);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load leads');
        this.loading.set(false);
      }
    });
  }
}
