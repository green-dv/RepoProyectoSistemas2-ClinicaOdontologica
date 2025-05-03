import { PaymentPlan, PaymentPlanWithPayments } from '../entities/PaymentsPlan';

export interface IPaymentPlanRepository {
    create(paymentPlan: Omit<PaymentPlan, 'idplanpago'>): Promise<PaymentPlan>;
    update(paymentPlan: PaymentPlan): Promise<PaymentPlan>;
    getById(id: number): Promise<PaymentPlan | null>;
    getPaginated(page: number, limit: number): Promise<{
        data: PaymentPlan[];
        totalCount: number;
    }>;
    getPlanWithPayments(id: number): Promise<PaymentPlanWithPayments | null>;
    getByConsultaId(consultaId: number): Promise<PaymentPlan[]>;
}