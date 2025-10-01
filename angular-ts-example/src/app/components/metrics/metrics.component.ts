import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolyInferService } from '../../services/polyinfer.service';
import type { MetricsResponse } from '../../types';

@Component({
  selector: 'app-metrics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metrics.component.html',
  styleUrl: './metrics.component.css'
})
export class MetricsComponent implements OnInit {
  metrics: MetricsResponse | null = null;

  constructor(private polyInferService: PolyInferService) {}

  get loading(): boolean {
    return this.polyInferService.isLoading;
  }

  get error(): string | null {
    return this.polyInferService.currentError;
  }

  ngOnInit() {
    this.fetchMetrics();
  }

  async fetchMetrics() {
    const result = await this.polyInferService.getMetricsData();
    if (result.success) {
      this.metrics = result;
    }
  }

  async handleResetMetrics() {
    if (window.confirm('Are you sure you want to reset all metrics?')) {
      await this.polyInferService.resetMetricsData();
      await this.fetchMetrics(); // Refresh metrics after reset
    }
  }

  async handleClearCache() {
    if (window.confirm('Are you sure you want to clear the cache?')) {
      await this.polyInferService.clearCacheData();
    }
  }
}
