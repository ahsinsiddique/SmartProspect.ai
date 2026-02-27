import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  template: `
    <mat-card class="stat-card">
      <div class="stat-icon" [style.background]="iconBg">
        <mat-icon [style.color]="iconColor">{{ icon }}</mat-icon>
      </div>
      <div class="stat-body">
        <p class="label">{{ label }}</p>
        <h3 class="value">{{ value }}</h3>
        <span class="change" [class.positive]="changeType==='positive'" [class.negative]="changeType==='negative'">{{ change }}</span>
      </div>
    </mat-card>
  `,
  styles: [`
    :host { display: block; }
    .stat-card {
      padding: 20px !important;
      display: flex;
      gap: 16px;
      align-items: center;
      border-radius: 12px !important;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important;
      transition: box-shadow 0.2s;
    }
    .stat-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.12) !important; }
    .stat-icon {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stat-body { flex: 1; }
    .label { font-size: 13px; color: #64748b; margin: 0; font-weight: 500; }
    .value { font-size: 28px; font-weight: 700; color: #0f172a; margin: 4px 0 2px; line-height: 1; }
    .change { font-size: 12px; color: #94a3b8; }
    .positive { color: #10b981; }
    .negative { color: #ef4444; }
  `]
})
export class StatCardComponent {
  @Input() icon = '';
  @Input() label = '';
  @Input() value = '';
  @Input() change = '';
  @Input() changeType: 'positive' | 'negative' | 'neutral' = 'positive';
  @Input() iconBg = '#eef2ff';
  @Input() iconColor = '#4f46e5';
}
