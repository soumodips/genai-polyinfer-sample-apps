import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PolyInferService } from '../../services/polyinfer.service';
import type { DemoResponse } from '../../types';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export class DemoComponent {
  prompt = 'What is the capital of France?';
  demoResult: DemoResponse | null = null;

  examplePrompts = [
    'What is the capital of France?',
    'Explain quantum computing in simple terms',
    'Write a haiku about artificial intelligence',
    'What is 2 + 2?',
    'Tell me a joke about programming',
  ];

  constructor(private polyInferService: PolyInferService) {}

  get loading(): boolean {
    return this.polyInferService.isLoading;
  }

  get error(): string | null {
    return this.polyInferService.currentError;
  }

  async handleRunDemo() {
    if (!this.prompt.trim()) return;

    const result = await this.polyInferService.runDemo(this.prompt);
    if (result.success) {
      this.demoResult = result;
    }
  }

  setPrompt(prompt: string) {
    this.prompt = prompt;
  }
}
