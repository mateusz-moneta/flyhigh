import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddedCompany, Companies, NewCompany } from '../../models';
import { map, Observable } from 'rxjs';
import { Company } from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private readonly httpClient = inject(HttpClient);

  public getData(): Observable<Company[]> {
    return this.httpClient.get<Companies>('/api/get_data').pipe(map(({ data }: Companies) => data));
  }

  public saveData(company: NewCompany): Observable<Company> {
    return this.httpClient
      .post<AddedCompany>('/api/save_data', company)
      .pipe(map(({ data }: AddedCompany) => data));
  }
}
