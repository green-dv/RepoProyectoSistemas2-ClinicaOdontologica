import { Payment } from '../entities/Payments';

export interface IPaymentRepository {
    create(payment: Payment): Promise<Payment>;
    update(payment: Payment): Promise<Payment>;
    getById(id: number): Promise<Payment | null>;
    getByPlanId(planId: number): Promise<Payment[]>;
    getPaginated(page: number, limit: number): Promise<{
      data: Payment[];
      totalCount: number;
    }>;
}