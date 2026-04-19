import { Company } from '../interfaces';

export type NewCompany = Pick<Company, 'name' | 'shares'>;
