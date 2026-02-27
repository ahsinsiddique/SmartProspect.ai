import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="landing">
      <nav class="nav">
        <div class="logo">
          <mat-icon>rocket_launch</mat-icon>
          <span>Prospects.ai</span>
        </div>
        <div class="nav-actions">
          <a mat-button routerLink="/login">Log in</a>
          <a mat-flat-button color="primary" routerLink="/register">Get Started</a>
        </div>
      </nav>

      <section class="hero">
        <h1>AI-Powered LinkedIn Outreach<br>at Scale</h1>
        <p class="hero-sub">Automate your prospecting with intelligent campaigns, personalized messaging, and real-time analytics.</p>
        <div class="hero-cta">
          <a mat-flat-button color="primary" routerLink="/register" class="cta-btn">Start for free</a>
          <a mat-stroked-button routerLink="/login">Sign in</a>
        </div>
      </section>

      <section class="features">
        <div class="feature-card">
          <mat-icon class="feature-icon">people</mat-icon>
          <h3>Smart Lead Management</h3>
          <p>Import, organize, and track your leads with powerful filtering and segmentation.</p>
        </div>
        <div class="feature-card">
          <mat-icon class="feature-icon">campaign</mat-icon>
          <h3>Automated Campaigns</h3>
          <p>Build multi-step outreach sequences with connection requests, follow-ups, and messages.</p>
        </div>
        <div class="feature-card">
          <mat-icon class="feature-icon">auto_awesome</mat-icon>
          <h3>AI Personalization</h3>
          <p>Let AI craft personalized messages for each prospect to maximize response rates.</p>
        </div>
        <div class="feature-card">
          <mat-icon class="feature-icon">insights</mat-icon>
          <h3>Real-time Analytics</h3>
          <p>Track connection rates, reply rates, and campaign performance in one dashboard.</p>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .landing { min-height: 100vh; background: #f8fafc; }
    .nav { display: flex; justify-content: space-between; align-items: center; padding: 16px 48px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .logo { display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 700; color: #4f46e5; }
    .logo mat-icon { color: #4f46e5; }
    .nav-actions { display: flex; align-items: center; gap: 8px; }
    .hero { text-align: center; padding: 96px 24px 64px; }
    h1 { font-size: 48px; font-weight: 800; color: #0f172a; line-height: 1.15; margin: 0 0 20px; }
    .hero-sub { font-size: 18px; color: #64748b; max-width: 560px; margin: 0 auto 36px; line-height: 1.6; }
    .hero-cta { display: flex; justify-content: center; gap: 12px; }
    .cta-btn { font-size: 15px; padding: 0 24px; height: 44px; }
    .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; max-width: 960px; margin: 0 auto; padding: 0 24px 80px; }
    .feature-card { background: #fff; border-radius: 12px; padding: 28px 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .feature-icon { font-size: 32px; height: 32px; width: 32px; color: #4f46e5; display: block; margin-bottom: 12px; }
    h3 { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 8px; }
    p { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0; }
  `]
})
export class LandingPageComponent {}
