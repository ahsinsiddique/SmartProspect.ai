import { Component, inject, signal, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { Campaign, CampaignStep, ApiResponse } from '../../../core/models';

@Component({
  selector: 'app-campaign-detail',
  standalone: true,
  imports: [
    RouterLink, DatePipe, DecimalPipe, TitleCasePipe,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatChipsModule, MatDividerModule, MatMenuModule,
    StatusBadgeComponent
  ],
  template: `
    <div class="page-container">
      @if (loading()) {
        <div class="loading-center">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (error()) {
        <div class="error-banner">
          <mat-icon>error_outline</mat-icon>
          <span>{{ error() }}</span>
        </div>
      } @else if (campaign()) {
        <div class="page-header">
          <button mat-icon-button routerLink="/dashboard/campaigns">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div class="header-info">
            <div class="title-row">
              <h1>{{ campaign()!.name }}</h1>
              <app-status-badge [status]="campaign()!.status"></app-status-badge>
            </div>
            @if (campaign()!.description) {
              <p class="subtitle">{{ campaign()!.description }}</p>
            }
          </div>
          <div class="header-actions">
            <button mat-stroked-button [matMenuTriggerFor]="statusMenu">
              <mat-icon>tune</mat-icon> Change Status
            </button>
            <mat-menu #statusMenu>
              @for (s of statuses; track s) {
                <button mat-menu-item (click)="changeStatus(s)">{{ s }}</button>
              }
            </mat-menu>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-box">
            <span class="stat-value">{{ campaign()!.totalEnrolled }}</span>
            <span class="stat-label">Enrolled</span>
          </div>
          <div class="stat-box">
            <span class="stat-value">{{ campaign()!.totalConnected }}</span>
            <span class="stat-label">Connected</span>
          </div>
          <div class="stat-box">
            <span class="stat-value">{{ campaign()!.totalReplied }}</span>
            <span class="stat-label">Replied</span>
          </div>
          @if (campaign()!.totalEnrolled > 0) {
            <div class="stat-box">
              <span class="stat-value">
                {{ (campaign()!.totalReplied / campaign()!.totalEnrolled * 100) | number:'1.0-1' }}%
              </span>
              <span class="stat-label">Reply Rate</span>
            </div>
          }
        </div>

        <div class="section-card">
          <h2>Campaign Steps</h2>
          <mat-divider></mat-divider>
          @if (campaign()!.steps.length === 0) {
            <div class="empty-steps">
              <mat-icon>add_task</mat-icon>
              <p>No steps configured yet</p>
            </div>
          } @else {
            <div class="steps-list">
              @for (step of campaign()!.steps; track step.id; let i = $index) {
                <div class="step-item">
                  <div class="step-number">{{ i + 1 }}</div>
                  <div class="step-content">
                    <div class="step-type">{{ step.stepType | titlecase }}</div>
                    @if (step.messageTemplate) {
                      <p class="step-message">{{ step.messageTemplate }}</p>
                    }
                    <div class="step-meta">
                      @if (step.delayDays > 0 || step.delayHours > 0) {
                        <span class="delay-chip">
                          <mat-icon>schedule</mat-icon>
                          Wait {{ step.delayDays }}d {{ step.delayHours }}h
                        </span>
                      }
                      @if (step.aiPersonalize) {
                        <span class="ai-chip">
                          <mat-icon>auto_awesome</mat-icon> AI Personalized
                        </span>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <div class="meta-row">
          <span class="meta">Created {{ campaign()!.createdAt | date:'medium' }}</span>
          @if (campaign()!.linkedInAccountName) {
            <span class="meta">· {{ campaign()!.linkedInAccountName }}</span>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 800px; }
    .loading-center { display: flex; justify-content: center; padding: 60px 0; }
    .error-banner { display: flex; align-items: center; gap: 8px; background: #fee2e2; color: #991b1b; padding: 12px 16px; border-radius: 8px; }
    .page-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 24px; }
    .header-info { flex: 1; }
    .title-row { display: flex; align-items: center; gap: 12px; }
    h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0; }
    .subtitle { color: #64748b; margin: 4px 0 0; font-size: 14px; }
    .header-actions { display: flex; gap: 8px; }
    .stats-row { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
    .stat-box { background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); padding: 20px 28px; display: flex; flex-direction: column; align-items: center; min-width: 100px; }
    .stat-value { font-size: 28px; font-weight: 700; color: #0f172a; line-height: 1; }
    .stat-label { font-size: 12px; color: #64748b; margin-top: 4px; font-weight: 500; }
    .section-card { background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); padding: 24px; margin-bottom: 16px; }
    h2 { font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 16px; }
    .empty-steps { text-align: center; padding: 32px; color: #94a3b8; }
    .empty-steps mat-icon { font-size: 36px; height: 36px; width: 36px; display: block; margin: 0 auto 8px; }
    .steps-list { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
    .step-item { display: flex; gap: 16px; align-items: flex-start; }
    .step-number { width: 32px; height: 32px; border-radius: 50%; background: #eef2ff; color: #4f46e5; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px; }
    .step-content { flex: 1; }
    .step-type { font-weight: 600; color: #0f172a; font-size: 14px; }
    .step-message { color: #475569; font-size: 13px; margin: 4px 0; white-space: pre-wrap; }
    .step-meta { display: flex; gap: 8px; margin-top: 6px; flex-wrap: wrap; }
    .delay-chip, .ai-chip { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; padding: 2px 10px; border-radius: 20px; font-weight: 500; }
    .delay-chip { background: #f1f5f9; color: #475569; }
    .ai-chip { background: #f3e8ff; color: #6b21a8; }
    .delay-chip mat-icon, .ai-chip mat-icon { font-size: 14px; height: 14px; width: 14px; }
    .meta-row { color: #94a3b8; font-size: 13px; display: flex; gap: 4px; }
    .meta { color: #94a3b8; }
  `]
})
export class CampaignDetailComponent implements OnInit {
  @Input() id!: string;

  private http = inject(HttpClient);
  router = inject(Router);

  campaign = signal<Campaign | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  statuses = ['ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED'];

  ngOnInit(): void {
    this.http.get<ApiResponse<Campaign>>(`/api/v1/campaigns/${this.id}`).subscribe({
      next: res => {
        this.campaign.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load campaign');
        this.loading.set(false);
      }
    });
  }

  changeStatus(status: string): void {
    this.http.patch<ApiResponse<Campaign>>(`/api/v1/campaigns/${this.id}/status`, { status }).subscribe({
      next: res => this.campaign.set(res.data),
      error: () => {}
    });
  }
}
