import { Payment } from '@/domain/entities/Payments';
import { CreatePaymentDTO, UpdatePaymentDTO } from '@/domain/dto/payments';
import { IPaymentRepository } from '@/domain/repositories/PaymentRepository';
import { IPaymentPlanRepository } from '@/domain/repositories/PaymentPlanRepository';
import { PaymentPlanWithPayments } from '@/domain/entities/PaymentsPlan';

export class PaymentService {
    constructor(
        private paymentRepository: IPaymentRepository,
        private paymentPlanRepository: IPaymentPlanRepository
    ) {}

    async createPayment(paymentData: CreatePaymentDTO): Promise<Payment> {
        const payment: Omit<Payment, 'idpago'> = {
            montoesperado: paymentData.montoesperado,
            montopagado: paymentData.montopagado,
            fechapago: new Date(paymentData.fechapago),
            estado: paymentData.estado,
            enlacecomprobante: paymentData.enlacecomprobante || null,
            idplanpago: paymentData.idplanpago
        };

        // verificaion del un pago si existe
        const paymentPlan = await this.paymentPlanRepository.getById(payment.idplanpago);
        if (!paymentPlan) {
            throw new Error('El plan de pago no existe');
        }

        const createdPayment = await this.paymentRepository.create(payment);

        //para actualizar el estado de pago (opcional)
        if (paymentData.montopagado > 0) {
            await this.handlePaymentImpact(createdPayment.idplanpago);
        }

        return createdPayment;
    }

    // async updatePayment(paymentData: UpdatePaymentDTO): Promise<Payment> {
    //     const existingPayment = await this.paymentRepository.getById(paymentData.idpago);
    //     if (!existingPayment) {
    //         throw new Error('El pago no existe >:');
    //     }
    //     const paymentUpdate: Payment = {
    //         idpago: paymentData.idpago,
    //         montoesperado: paymentData.montoesperado ?? existingPayment.montoesperado,
    //         montopagado: paymentData.montopagado ?? existingPayment.montopagado,
    //         fechapago: paymentData.fechapago ? new Date(paymentData.fechapago) : existingPayment.fechapago,
    //         estado: paymentData.estado ?? existingPayment.estado,
    //         enlacecomprobante: paymentData.enlacecomprobante ?? existingPayment.enlacecomprobante,
    //         idplanpago: existingPayment.idplanpago
    //     };

    //     const updatedPayment = await this.paymentRepository.update(paymentUpdate);

    //     if (paymentData.montopagado && paymentData.montopagado > 0) {
    //         await this.handlePaymentImpact(updatedPayment.idplanpago);
    //     }
    //     return updatedPayment;
    // }
    async updatePayment(paymentData: UpdatePaymentDTO): Promise<Payment> {
        const existingPayment = await this.paymentRepository.getById(paymentData.idpago);
        if (!existingPayment) {
            throw new Error('El pago no existe');
        }
        
        const paymentUpdate: Payment = {
            idpago: paymentData.idpago,
            montoesperado: existingPayment.montoesperado,
            montopagado: existingPayment.montopagado,    
            fechapago: existingPayment.fechapago,        
            estado: paymentData.estado ?? existingPayment.estado,
            enlacecomprobante: paymentData.enlacecomprobante ?? existingPayment.enlacecomprobante,
            idplanpago: existingPayment.idplanpago       
        };
    
        return this.paymentRepository.update(paymentUpdate);
    }

    async getPaymentById(id: number): Promise<Payment | null> {
        return this.paymentRepository.getById(id);
    }

    async getPaymentsByPlanId(planId: number): Promise<Payment[]> {
        return this.paymentRepository.getByPlanId(planId);
    }

    async getPaginatedPayments(page: number, limit: number): Promise<{
        data: Payment[];
        pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        }
    }> {
        const { data, totalCount } = await this.paymentRepository.getPaginated(page, limit);
        
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

    private async handlePaymentImpact(planId: number): Promise<void> {
        const planWithPayments = await this.paymentPlanRepository.getPlanWithPayments(planId);
        if (!planWithPayments) return;
        //total paga
        const totalPaid = planWithPayments.pagos.reduce((sum, p) => sum + p.montopagado, 0);
        const totalExpected = planWithPayments.pagos.reduce((sum, p) => sum + p.montoesperado, 0);
    
        // poner nuevo estado
        let newStatus = planWithPayments.estado;
        const allPaymentsPaid = planWithPayments.pagos.every(p => p.estado === 'pagado');
        
        if (allPaymentsPaid) 
        {
            newStatus = 'completado';
        } 
        else if (totalPaid > 0) 
        {
            newStatus = 'activo';
        } 
        else
        {
            newStatus = 'pendiente';
        }
    
        // Actualizar estado de plan
        if (newStatus !== planWithPayments.estado) {
            await this.paymentPlanRepository.update({
                ...planWithPayments,
                estado: newStatus
            });
        }
    
        // para los pagos excesivos 
        const overpayment = totalPaid - totalExpected;
        if (overpayment > 0) {
            await this.handleOverpayment(planWithPayments, overpayment);
        }
    }

    private async handleOverpayment(plan: PaymentPlanWithPayments, overpaymentAmount: number): Promise<void> {
        // obtner los pagos desde el mas antiguo por fecha
        const pendingPayments = plan.pagos
            .filter(p => p.estado !== 'pagado')
            .sort((a, b) => new Date(a.fechapago).getTime() - new Date(b.fechapago).getTime());
    
        if (pendingPayments.length === 0) {
            return;
        }
        let remainingOverpayment = overpaymentAmount;
    
        // forcito
        for (const payment of pendingPayments) {
            if (remainingOverpayment <= 0) break;
    
            const amountToDeduct = Math.min(remainingOverpayment, payment.montoesperado);
            const newExpectedAmount = payment.montoesperado - amountToDeduct;
    
            await this.paymentRepository.update({
                ...payment,
                montoesperado: newExpectedAmount,
                estado: newExpectedAmount <= 0 ? 'pagado' : 'pendiente'
            });
    
            remainingOverpayment -= amountToDeduct;
        }
    
        //para ver si sigue habiendo excedentes 
        if (remainingOverpayment > 0) {
            const lastPayment = pendingPayments[pendingPayments.length - 1];
            await this.paymentRepository.update({
                ...lastPayment,
                montopagado: lastPayment.montopagado + remainingOverpayment
            });
        }
    }
}