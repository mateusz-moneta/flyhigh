import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CompaniesService } from './companies.service';
import { Company } from '../../interfaces';
import { AddedCompany, NewCompany } from '../../models';

describe(CompaniesService.name, () => {
  let service: CompaniesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CompaniesService],
    });

    service = TestBed.inject(CompaniesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch companies and map response data', () => {
    const mockResponse = {
      data: [
        { id: 1, name: 'A', shares: 10, price_net: 100, price_gross: 123 },
        { id: 2, name: 'B', shares: 20, price_net: 200, price_gross: 246 },
      ],
    };

    let result: Company[] | undefined;

    service.getData().subscribe((res) => {
      result = res;
    });

    const req = httpMock.expectOne('/api/get_data');
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);

    expect(result).toEqual(mockResponse.data);
  });

  it('should send company and return mapped response', () => {
    const newCompany: NewCompany = {
      name: 'Company C',
      shares: 30,
    };

    const mockResponse: AddedCompany = {
      success: true,
      data: {
        id: 3,
        name: 'Company C',
        price_net: 100,
        price_gross: 123,
        shares: 30,
      },
    };

    let result: Company | undefined;

    service.saveData(newCompany).subscribe((res) => {
      result = res;
    });

    const req = httpMock.expectOne('/api/save_data');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCompany);

    req.flush(mockResponse);

    expect(result).toEqual(mockResponse.data);
  });

  it('should handle error on getData', () => {
    let error: any;

    service.getData().subscribe({
      next: () => fail('should have failed'),
      error: (err) => (error = err),
    });

    const req = httpMock.expectOne('/api/get_data');
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(error).toBeTruthy();
    expect(error.status).toBe(500);
  });
});
