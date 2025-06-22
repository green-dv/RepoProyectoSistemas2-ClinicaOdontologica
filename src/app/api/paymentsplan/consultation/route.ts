import { NextRequest, NextResponse } from 'next/server';
import { PaymentPlanService } from '@/application/usecases/paymentsPlan/paymentPlanUseCase';
import { PaymentPlanRepository } from '@/infrastructure/repositories/PaymentPlanRepository';
import { PaymentRepository } from '@/infrastructure/repositories/PaymentRepository';
import { CreatePaymentPlanDTO } from '@/domain/dto/paymentPlan';
import { Payment } from '@/domain/entities/Payments';

const paymentPlanRepository = new PaymentPlanRepository();
const paymentRepository = new PaymentRepository();
const paymentPlanService = new PaymentPlanService(paymentPlanRepository, paymentRepository);


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (Array.isArray(body.pagos) && body.pagos.reduce((total: number, p: Payment) => total + Number(p.montopagado ?? 0), 0) >= body.montotal) {
            body.estado = 'Completado';
            console.log('Pago completado');
        }
        else{
            console.log('No se pago completamente ' + body.pagos);
            body.estado = 'Pendiente';
        }
        
        const planData: CreatePaymentPlanDTO = {
            fechacreacion: body.fechacreacion ?? new Date().toISOString(),
            fechalimite: body.fechalimite,
            montotal: body.montotal,
            descripcion: body.descripcion,
            estado: body.estado ?? 'pendiente',
            idconsulta: body.idconsulta ?? null,
            idpaciente: body.idpaciente ?? null,
            pagos: body.pagos ?? []
        };
        
        if (!planData.fechalimite || !planData.montotal) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos => fechalimite, montotal, idconsulta' },
                { status: 400 }
            );
        }

        if (planData.pagos.length === 0 && planData.montotal <= 0) {
            return NextResponse.json(
                { error: 'Debe proporcionar cuotas o un monto total el cual sea válido' },
                { status: 400 }
            );
        }
        
        const paymentPlan = await paymentPlanService.createPaymentPlanWithInstallmentsByConsultationId(planData);
        return NextResponse.json({ data: paymentPlan }, { status: 201 });
    } catch (error) {
        console.error('Error creating payment plan:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error al crear plan' },
            { status: 500 }
        );
    }
}