import { Company } from './index';

export interface SocketData {
  type: 'price_update';
  data: Company[];
}
