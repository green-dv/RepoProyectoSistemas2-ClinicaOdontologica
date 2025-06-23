import { PaymentPlan, PaymentPlanWithPayments } from '../entities/PaymentsPlan';

export interface IPaymentPlanRepository {
    create(paymentPlan: Omit<PaymentPlan, 'idplanpago'>): Promise<PaymentPlan>;
    update(paymentPlan: PaymentPlan): Promise<PaymentPlan>;
    getById(id: number): Promise<PaymentPlan | null>;
    getPaginated(page: number, limit: number, estado: string | null, fechainicio: string | null, fechafin:string | null): Promise<{
        data: PaymentPlan[];
        totalCount: number;
    }>;
    getPlanWithPayments(id: number): Promise<PaymentPlanWithPayments | null>;
    getByConsultaId(consultaId: number): Promise<PaymentPlan[]>;
    findByConsultationId(): Promise<number>;
    getPaymentsPlanByConsultationId(idConsulta: number): Promise<PaymentPlan | null>;
}