import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { ApiResponse, PageResponse, Campaign, Lead } from '../../../core/models';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule, StatCardComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Dashboard</h1>
          <p class="subtitle">Your outreach overview</p>
        </div>
        <a mat-flat-button color="primary" routerLink="/dashboard/campaigns/create">
          <mat-icon>add</mat-icon> New Campaign
        </a>
      </div>

      @if (loading()) {
        <div class="loading-center">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else {
        <div class="stats-grid">
          <app-stat-card
            icon="campaign"
            label="Total Campaigns"
            [value]="totalCampaigns().toString()"
            change="Active outreach"
            iconBg="#eef2ff"
            iconColor="#4f46e5">
          </app-stat-card>
          <app-stat-card
            icon="people"
            label="Total Leads"
            [value]="totalLeads().toString()"
            change="In your pipeline"
            iconBg="#f0fdf4"
            iconColor="#16a34a">
          </app-stat-card>
          <app-stat-card
            icon="connect_without_contact"
            label="Total Connected"
            [value]="totalConnected().toString()"
            change="LinkedIn connections"
            iconBg="#eff6ff"
            iconColor="#2563eb">
          </app-stat-card>
          <app-stat-card
            icon="forum"
            label="Total Replies"
            [value]="totalReplied().toString()"
            change="Responses received"
            iconBg="#fdf4ff"
            iconColor="#9333ea">
          </app-stat-card>
        </div>

        <div class="quick-links">
          <h2>Quick Actions</h2>
          <div class="link-cards">
            <a class="link-card" routerLink="/dashboard/campaigns/create">
              <mat-icon>add_circle</mat-icon>
              <span>Create Campaign</span>
            </a>
            <a class="link-card" routerLink="/dashboard/leads">
              <mat-icon>person_search</mat-icon>
              <span>View Leads</span>
            </a>
            <a class="link-card" routerLink="/dashboard/linkedin-accounts">
              <mat-icon>manage_accounts</mat-icon>
              <span>LinkedIn Accounts</span>
            </a>
            <a class="link-card" routerLink="/dashboard/campaigns">
              <mat-icon>list</mat-icon>
              <span>All Campaigns</span>
            </a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
    h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0; }
    .subtitle { color: #64748b; margin: 4px 0 0; font-size: 14px; }
    .loading-center { display: flex; justify-content: center; padding: 60px 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin-bottom: 32px; }
    h2 { font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 16px; }
    .link-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
    .link-card { display: flex; flex-direction: column; align-items: center; gap: 8px; background: #fff; border-radius: 12px; padding: 20px; text-decoration: none; color: #475569; font-size: 13px; font-weight: 500; box-shadow: 0 1px 3px rgba(0,0,0,0.08); transition: box-shadow 0.15s, color 0.15s; }
    .link-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.12); color: #4f46e5; }
    .link-card mat-icon { font-size: 28px; height: 28px; width: 28px; color: #4f46e5; }
  `]
})
export class DashboardHomeComponent implements OnInit {
  private http = inject(HttpClient);

  loading = signal(true);
  totalCampaigns = signal(0);
  totalLeads = signal(0);
  totalConnected = signal(0);
  totalReplied = signal(0);

  ngOnInit(): void {
    Promise.all([
      this.http.get<ApiResponse<PageResponse<Campaign>>>('/api/v1/campaigns?size=100').toPromise(),
      this.http.get<ApiResponse<PageResponse<Lead>>>('/api/v1/leads?size=1').toPromise()
    ]).then(([campaigns, leads]) => {
      if (campaigns?.data) {
        this.totalCampaigns.set(campaigns.data.totalElements);
        const connected = campaigns.data.content.reduce((s, c) => s + c.totalConnected, 0);
        const replied = campaigns.data.content.reduce((s, c) => s + c.totalReplied, 0);
        this.totalConnected.set(connected);
        this.totalReplied.set(replied);
      }
      if (leads?.data) {
        this.totalLeads.set(leads.data.totalElements);
      }
      this.loading.set(false);
    }).catch(() => this.loading.set(false));
  }
}
