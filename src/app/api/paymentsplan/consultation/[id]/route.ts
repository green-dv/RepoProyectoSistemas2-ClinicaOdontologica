import { NextRequest, NextResponse } from 'next/server';
import { PaymentPlanService } from '@/application/usecases/paymentsPlan/paymentPlanUseCase';
import { PaymentPlanRepository } from '@/infrastructure/repositories/PaymentPlanRepository';
import { PaymentRepository } from '@/infrastructure/repositories/PaymentRepository';
import { UpdatePaymentPlanDTO } from '@/domain/dto/paymentPlan';
import { Payment } from '@/domain/entities/Payments';

const paymentPlanRepository = new PaymentPlanRepository();
const paymentRepository = new PaymentRepository();
const paymentPlanService = new PaymentPlanService(paymentPlanRepository, paymentRepository);

export async function GET(request: NextRequest,{ params }: { params: Promise<{ id: string }> }) 
{
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id); 
        
        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }
        const paymentPlan = await paymentPlanService.getPaymentsPlanByConsultationId(id);
        if (!paymentPlan) {
            return NextResponse.json({ error: 'Plan de pago no encontrado' }, { status: 404 });
        }
        return NextResponse.json({ data: paymentPlan });
    } catch (error) {
        console.error('Error getting payment plan:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error al obtener plan' },
            { status: 500 }
        );
    }
}