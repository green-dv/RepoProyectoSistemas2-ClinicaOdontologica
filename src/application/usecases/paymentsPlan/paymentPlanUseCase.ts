import { PaymentPlan, PaymentPlanWithPayments } from '@/domain/entities/PaymentsPlan';
import { CreatePaymentPlanDTO, UpdatePaymentPlanDTO } from '@/domain/dto/paymentPlan';
import { IPaymentPlanRepository } from '@/domain/repositories/PaymentPlanRepository';
import { IPaymentRepository } from '@/domain/repositories/PaymentRepository';
import { Payment } from '@/domain/entities/Payments';

export class PaymentPlanService {
    constructor(
        private readonly paymentPlanRepository: IPaymentPlanRepository,
        private readonly paymentRepository: IPaymentRepository
    ) {}

    async createPaymentPlanWithInstallments(dto: CreatePaymentPlanDTO): Promise<PaymentPlanWithPayments> {
        this.validatePaymentPlanInput(dto);
        let pagado = false;
        if(dto.pagos.reduce((total, p) => total + (p.montopagado ?? 0), 0) >= dto.montotal){
            pagado = true;
        }
        const paymentPlanData: Omit<PaymentPlan, 'idplanpago'> = {
            fechacreacion: new Date(dto.fechacreacion),
            fechalimite: new Date(dto.fechalimite),
            montotal: dto.montotal,
            descripcion: dto.descripcion,
            idpaciente: dto.idpaciente ?? null,
            estado: pagado ? 'completado' : 'pendiente',
            paciente: null,
            idconsulta: dto.idconsulta != 0 ? dto.idconsulta : null
        };

        const createdPlan = await this.paymentPlanRepository.create(paymentPlanData);
        
        if (!createdPlan.idplanpago) {
            throw new Error('No se pudo crear el plan de pago o el ID no se ha generado');
        }

        const payments: Payment[] = [];
        for (const installment of dto.pagos) {
            const payment: Omit<Payment, 'idpago'> = {
                montoesperado: installment.montoesperado!,
                montopagado: installment.montopagado ?? 0,
                fechapago: installment.fechapago ? new Date(installment.fechapago) : null,
                estado: (installment.montopagado ?? 0) > 0 ? 'completado' : 'pendiente',
                enlacecomprobante: installment.enlacecomprobante,
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

    async updatePaymentPlan(dto: UpdatePaymentPlanDTO): Promise<PaymentPlanWithPayments> {
        const existingPlan = await this.paymentPlanRepository.getById(dto.idplanpago);
        if (!existingPlan) {
            throw new Error('El plan de pago no existe >;');
        }

        this.validatePaymentPlanInput(dto, existingPlan);

        const planUpdate: PaymentPlan = {
            idplanpago: dto.idplanpago,
            fechacreacion: dto.fechacreacion ? new Date(dto.fechacreacion) : existingPlan.fechacreacion,
            fechalimite: dto.fechalimite ? new Date(dto.fechalimite) : existingPlan.fechalimite,
            montotal: dto.montotal ?? existingPlan.montotal,
            descripcion: dto.descripcion ?? existingPlan.descripcion,
            estado: dto.estado ?? existingPlan.estado,
            idpaciente: dto.idpaciente ?? null,
            paciente: null,
            idconsulta: existingPlan.idconsulta
        };

        if (planUpdate.fechacreacion > planUpdate.fechalimite) {
            throw new Error('La fecha de creación no puede ser posterior a la fecha límite');
        }
        
        if (existingPlan.pagos && planUpdate.montotal < existingPlan.pagos.reduce((a, b) => a + (b.montopagado ?? 0), 0)) {
            throw new Error('No puede reducir el monto total por debajo de los pagos ya realizados');
        }

        const updatedPlan = await this.paymentPlanRepository.update(planUpdate);
        await this.paymentRepository.delete(planUpdate.idplanpago);

        const payments: Payment[] = [];
        for (const installment of dto.pagos) {
            const payment: Payment = {
                idpago: installment.idpago ?? 0,
                montoesperado: installment.montoesperado!,
                montopagado: installment.montopagado ?? 0,
                fechapago: installment.fechapago ? new Date(installment.fechapago) : null,
                estado: (installment.montopagado ?? 0) > 0 ? 'completado' : 'pendiente',
                enlacecomprobante: installment.enlacecomprobante,
                idplanpago: dto.idplanpago
            };
            payments.push(await this.paymentRepository.create(payment));
        }

        return {
            ...updatedPlan,
            pagos: payments
        };
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

    async getPaginatedPaymentPlans(page: number, limit: number, estado: string | null, fechainicio: string | null, fechafin: string | null): Promise<{
        data: PaymentPlan[];
        pagination: {
            page: number;
            limit: number;
            totalItems: number;
            totalPages: number;
        }
    }> {
        const { data, totalCount } = await this.paymentPlanRepository.getPaginated(page, limit, estado ?? null, fechainicio ?? null, fechafin ?? null);

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

    /*async payFullAmount(planId: number, paymentData: {
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
    }*/
    async validatePaymentPlanInput(dto: CreatePaymentPlanDTO | UpdatePaymentPlanDTO, existingPlan?: PaymentPlan) {
        const today = new Date();
    
        if (dto.fechalimite && new Date(dto.fechalimite) < today) {
            throw new Error('La fecha límite debe ser posterior a la fecha actual');
        }
    
        if (dto.fechacreacion && new Date(dto.fechacreacion).getMonth() < today.getMonth() - 1) {
            throw new Error('Intruduzca una fecha de creación válida');
        }
    
        if (dto.fechalimite && new Date(dto.fechalimite).getFullYear() > today.getFullYear() + 5) {
            throw new Error('La fecha límite no puede ser posterior a 5 años desde hoy');
        }
    
        if (dto.fechacreacion && dto.fechalimite && new Date(dto.fechacreacion) > new Date(dto.fechalimite)) {
            throw new Error('La fecha de creación no puede ser posterior a la fecha límite');
        }
    
        if (dto.montotal && (dto.montotal <= 0 || dto.montotal > 100000)) {
            throw new Error('Ingrese un monto total válido de entre 0 y 100000');
        }
    
        if (
            dto.montotal && 
            existingPlan?.pagos?.length &&
            dto.montotal < existingPlan.pagos.reduce((sum, p) => sum + (p.montopagado ?? 0), 0)
        ) {
            throw new Error('No puede reducir el monto total por debajo de los pagos ya realizados');
        }
    
        if ('installments' in dto && Math.abs(dto.pagos.reduce((s, i) => s + (i.montoesperado ?? 0), 0) - dto.montotal) > 0.01) {
            throw new Error('La suma de las cuotas no coincide con el monto total del plan');
        }
    }
}