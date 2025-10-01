import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PolyInferService } from '../../services/polyinfer.service';
import type { SayResponse } from '../../types';

@Component({
  selector: 'app-ai-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-request.component.html',
  styleUrl: './ai-request.component.css'
})
export class AiRequestComponent {
  prompt = '';
  mode: 'synchronous' | 'concurrent' = 'synchronous';
  response: SayResponse | null = null;

  constructor(private polyInferService: PolyInferService) {}

  get loading(): boolean {
    return this.polyInferService.isLoading;
  }

  get error(): string | null {
    return this.polyInferService.currentError;
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    if (!this.prompt.trim()) return;

    const result = await this.polyInferService.makeSayRequest(this.prompt, this.mode);
    if (result.success) {
      this.response = result;
    }
  }
}
