import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CompaniesService, SocketService } from './services';
import { TableModule } from 'primeng/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddDialogComponent, ChartComponent } from './components';
import { Company, SocketData } from './interfaces';
import { calculateGrossFromNet } from './utils';
import { Button } from 'primeng/button';
import { NewCompany } from './models';

@Component({
  selector: 'app-root',
  imports: [AddDialogComponent, Button, ChartComponent, TableModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly companiesService = inject(CompaniesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly socketService = inject(SocketService);

  protected readonly addDialogVisible = signal<boolean>(false);
  protected readonly companies = signal<Company[]>([]);

  public ngOnInit(): void {
    this.initCompanies();
    this.handleSocketData();
  }

  protected onSave(company: NewCompany): void {
    this.companiesService.saveData(company).subscribe((saved: Company) => {
      this.companies.update((companies: Company[]) => {
        const index = companies.findIndex(({ id }) => id === saved.id);

        if (index === -1) {
          return [...companies, saved];
        }

        const copy = [...companies];
        copy[index] = saved;

        return copy;
      });
    });
    this.addDialogVisible.set(false);
  }

  private handleSocketData(): void {
    this.socketService.data$.subscribe((update: SocketData | null) => {
      if (!update) {
        return;
      }

      this.companies.update((companies: Company[]) => {
        const map = new Map(companies.map((company: Company) => [company.id, company]));

        for (const item of update.data) {
          map.set(item.id, {
            ...item,
            price_gross: item?.price_gross
              ? item.price_gross
              : calculateGrossFromNet(item.price_net),
          });
        }

        return Array.from(map.values());
      });
    });
  }

  private initCompanies(): void {
    this.companiesService
      .getData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((companies: Company[]) => {
        this.companies.set(companies);
      });
  }
}
