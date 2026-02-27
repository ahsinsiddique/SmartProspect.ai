import { Component, Input, computed, signal } from '@angular/core';
import { NgClass, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [NgClass, UpperCasePipe],
  template: `<span class="badge" [ngClass]="cssClass()">{{ status | uppercase }}</span>`,
  styles: [`
    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .active, .connected { background: #dcfce7; color: #166534; }
    .draft, .disconnected, .new { background: #f1f5f9; color: #475569; }
    .paused, .warming_up, .pending { background: #fef9c3; color: #854d0e; }
    .suspended, .failed, .bounced { background: #fee2e2; color: #991b1b; }
    .completed, .enriched { background: #dbeafe; color: #1e40af; }
    .archived { background: #e5e7eb; color: #374151; }
    .replied, .interested { background: #f3e8ff; color: #6b21a8; }
    .pending_verification { background: #fef3c7; color: #92400e; }
  `]
})
export class StatusBadgeComponent {
  @Input() status = '';
  cssClass = computed(() => this.status.toLowerCase().replace(/ /g, '_'));
}
