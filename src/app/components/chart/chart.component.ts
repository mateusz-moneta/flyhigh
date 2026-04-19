import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { Chart } from 'chart.js';
import { Company } from '../../interfaces';

@Component({
  selector: 'app-chart',
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent {
  public readonly companies = input<Company[]>([]);

  protected readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  private chart?: Chart;

  private readonly labels = computed(() => this.companies().map(({ name }) => name));
  private readonly values = computed(() => this.companies().map(({ shares }) => shares));

  constructor() {
    effect(() => {
      const canvas = this.canvas();

      if (canvas) {
        this.initChart(canvas);
      }
    });
  }

  private generateColors(count: number): string[] {
    return Array.from({ length: count }, () => `hsl(${Math.random() * 360}, 70%, 60%)`);
  }

  private initChart(canvas: ElementRef<HTMLCanvasElement>): void {
    const ctx = canvas.nativeElement;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.labels(),
        datasets: [
          {
            data: this.values(),
            backgroundColor: this.generateColors(this.labels().length),
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: 'right',
          },
        },
      },
    });
  }
}
