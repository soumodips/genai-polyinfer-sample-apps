import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolyInferService } from '../../services/polyinfer.service';
import type { HealthResponse } from '../../types';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health.component.html',
  styleUrl: './health.component.css'
})
export class HealthComponent implements OnInit {
  health: HealthResponse | null = null;

  constructor(private polyInferService: PolyInferService) {}

  get loading(): boolean {
    return this.polyInferService.isLoading;
  }

  get error(): string | null {
    return this.polyInferService.currentError;
  }

  ngOnInit() {
    this.checkHealth();
  }

  async checkHealth() {
    const result = await this.polyInferService.getHealthStatus();
    if (result.success) {
      this.health = result;
    }
  }
}
