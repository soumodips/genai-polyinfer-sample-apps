import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiRequestComponent } from './components/ai-request/ai-request.component';
import { MetricsComponent } from './components/metrics/metrics.component';
import { ConfigComponent } from './components/config/config.component';
import { DemoComponent } from './components/demo/demo.component';
import { HealthComponent } from './components/health/health.component';

type Tab = 'ai' | 'metrics' | 'config' | 'demo' | 'health';

interface TabItem {
  id: Tab;
  label: string;
  component: any;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AiRequestComponent,
    MetricsComponent,
    ConfigComponent,
    DemoComponent,
    HealthComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  activeTab: Tab = 'ai';

  tabs: TabItem[] = [
    { id: 'ai', label: 'AI Request', component: AiRequestComponent },
    { id: 'metrics', label: 'Metrics', component: MetricsComponent },
    { id: 'config', label: 'Configuration', component: ConfigComponent },
    { id: 'demo', label: 'Demo', component: DemoComponent },
    { id: 'health', label: 'Health', component: HealthComponent },
  ];

  get activeComponent() {
    return this.tabs.find(tab => tab.id === this.activeTab)?.component || AiRequestComponent;
  }

  setActiveTab(tab: Tab) {
    this.activeTab = tab;
  }
}
