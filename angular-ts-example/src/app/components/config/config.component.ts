import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolyInferService } from '../../services/polyinfer.service';
import type { ConfigResponse } from '../../types';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class ConfigComponent implements OnInit {
  config: ConfigResponse | null = null;

  constructor(private polyInferService: PolyInferService) {}

  get loading(): boolean {
    return this.polyInferService.isLoading;
  }

  get error(): string | null {
    return this.polyInferService.currentError;
  }

  ngOnInit() {
    this.fetchConfig();
  }

  async fetchConfig() {
    const result = await this.polyInferService.getConfigData();
    if (result.success) {
      this.config = result;
    }
  }

  refreshConfig() {
    window.location.reload();
  }
}
