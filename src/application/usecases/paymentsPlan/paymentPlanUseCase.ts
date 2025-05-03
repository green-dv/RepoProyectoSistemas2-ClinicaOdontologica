import { PaymentPlan, PaymentPlanWithPayments } from '@/domain/entities/PaymentsPlan';
import { CreatePaymentPlanDTO, UpdatePaymentPlanDTO } from '@/domain/dto/paymentPlan';
import { IPaymentPlanRepository } from '@/domain/repositories/PaymentPlanRepository';
import { IPaymentRepository } from '@/domain/repositories/PaymentRepository';
import { Payment } from '@/domain/entities/Payments';

export class PaymentPlanService {
    constructor(
        private paymentPlanRepository: IPaymentPlanRepository,
        private paymentRepository: IPaymentRepository
    ) {}

    async createPaymentPlanWithInstallments(dto: CreatePaymentPlanDTO): Promise<PaymentPlanWithPayments> {
        // Validar la suma cuotas que sea igual con el total
        const totalInstallments = dto.installments.reduce((sum, inst) => sum + inst.montoesperado, 0);
        if (Math.abs(totalInstallments - dto.montotal) > 0.01) {
            throw new Error('La suma de las cuotas no son iguales con el total del plan');
        }

        const paymentPlanData: Omit<PaymentPlan, 'idplanpago'> = {
            fechacreacion: new Date(dto.fechacreacion),
            fechalimite: new Date(dto.fechalimite),
            montotal: dto.montotal,
            descripcion: dto.descripcion,
            estado: 'pendiente',
            idconsulta: dto.idconsulta
        };

        const createdPlan = await this.paymentPlanRepository.create(paymentPlanData);
        
        if (!createdPlan.idplanpago) {
            throw new Error('No se pudo crear el plan de pago o el ID no se ha generado');
        }

        const payments: Payment[] = [];
        for (const installment of dto.installments) {
            const payment: Omit<Payment, 'idpago'> = {
                montoesperado: installment.montoesperado,
                montopagado: 0,
                fechapago: new Date(installment.fechapago),
                estado: 'pendiente',
                enlacecomprobante: null,
                idplanpago: createdPlan.idplanpago
            };

            const createdPayment = await this.paymentRepository.create(payment);
            payments.push(createdPayment);
        }

        return {
            ...createdPlan,
            pagos: payments
        };
    }

    async updatePaymentPlan(dto: UpdatePaymentPlanDTO): Promise<PaymentPlan> {
        const existingPlan = await this.paymentPlanRepository.getById(dto.idplanpago);
        if (!existingPlan) {
        throw new Error('El plan de pago no existe >;');
        }

        const planUpdate: PaymentPlan = {
            idplanpago: dto.idplanpago,
            fechacreacion: dto.fechacreacion ? new Date(dto.fechacreacion) : existingPlan.fechacreacion,
            fechalimite: dto.fechalimite ? new Date(dto.fechalimite) : existingPlan.fechalimite,
            montotal: dto.montotal ?? existingPlan.montotal,
            descripcion: dto.descripcion ?? existingPlan.descripcion,
            estado: dto.estado ?? existingPlan.estado,
            idconsulta: existingPlan.idconsulta
        };

        return this.paymentPlanRepository.update(planUpdate);
    }

    async getPaymentPlanById(id: number): Promise<PaymentPlanWithPayments | null> {
        return this.paymentPlanRepository.getPlanWithPayments(id);
    }

    async getPaymentPlansByConsulta(consultaId: number): Promise<PaymentPlanWithPayments[]> {
        const plans = await this.paymentPlanRepository.getByConsultaId(consultaId);
        return Promise.all(
            plans.map(async plan => {
                if (!plan.idplanpago) {
                    throw new Error(`Plan sin ID válido: ${JSON.stringify(plan)}`);
                }
                return {
                    ...plan,
                    pagos: await this.paymentRepository.getByPlanId(plan.idplanpago)
                };
            })
        );
    }

    async getPaginatedPaymentPlans(page: number, limit: number): Promise<{
        data: PaymentPlan[];
        pagination: {
            page: number;
            limit: number;
            totalItems: number;
            totalPages: number;
        }
    }> {
        const { data, totalCount } = await this.paymentPlanRepository.getPaginated(page, limit);
        
        return {
        data,
        pagination: {
            page,
            limit,
            totalItems: totalCount,
            totalPages: Math.ceil(totalCount / limit)
        }
        };
    }

    async payFullAmount(planId: number, paymentData: {
        montopagado: number;
        fechapago: string;
        enlacecomprobante?: string | null;
    }): Promise<PaymentPlanWithPayments> {
        const plan = await this.paymentPlanRepository.getPlanWithPayments(planId);
        if (!plan) throw new Error('Plan de pago no encontrado');
    
        // Validar monto
        const totalExpected = plan.pagos.reduce((sum, p) => sum + p.montoesperado, 0);
        if (paymentData.montopagado < totalExpected) {
            throw new Error(`Monto insuficiente. Se requiere mínimo ${totalExpected}`);
        }
    
        // Actualizar pagos (en paralelo)
        await Promise.all(plan.pagos.map(payment =>
            this.paymentRepository.update({
                ...payment,
                montopagado: payment.montoesperado,
                estado: 'pagado',
                fechapago: new Date(paymentData.fechapago),
                enlacecomprobante: paymentData.enlacecomprobante ?? null
            })
        ));

        // Actualizar estado del plan
        await this.paymentPlanRepository.update({
            ...plan,
            estado: 'completado'
        });

        const updatedPlan = await this.paymentPlanRepository.getPlanWithPayments(planId);
        if (!updatedPlan) {
            throw new Error('Error al recuperar el plan actualizado');
        }
        return updatedPlan;
    }
}