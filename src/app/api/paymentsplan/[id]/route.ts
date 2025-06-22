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
        const paymentPlan = await paymentPlanService.getPaymentPlanById(id);
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

export async function PUT(request: NextRequest,{ params }: { params: Promise<{ id: string }> }) 
{
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id); 
        
        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        const body = await request.json();

        if (Array.isArray(body.pagos) && body.pagos.reduce((total: number, p: Payment) => total + Number(p.montopagado ?? 0), 0) >= body.montotal) {
            body.estado = 'Completado';
            console.log('Pago completado');
        }
        else{
            console.log('No se pago completamente ' + body.pagos);
        }
        
        const planData: UpdatePaymentPlanDTO = {
            idplanpago: id,
            fechacreacion: body.fechacreacion,
            fechalimite: body.fechalimite,
            montotal: body.montotal,
            descripcion: body.descripcion,
            estado: body.estado,
            idpaciente: body.idpaciente ?? null,
            idconsulta: body.idconsulta ?? null,
            pagos: body.pagos
        };
        
        const updatedPlan = await paymentPlanService.updatePaymentPlan(planData);
        return NextResponse.json({ data: updatedPlan });
    } catch (error) {
        console.error('Error updating payment plan:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error al actualizar plan' },
            { status: 500 }
        );
    }
}

/*export async function POST(request: NextRequest,{ params }: { params: { id: string }}) 
{
    try {
        const id = parseInt(params.id, 10);
        
        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }
        
        const body = await request.json();
        const result = await paymentPlanService.payFullAmount(id, {
            montopagado: body.montopagado,
            fechapago: body.fechapago,
            enlacecomprobante: body.enlacecomprobante
        });
        
        return NextResponse.json({ data: result });
    } catch (error) {
        console.error('Error processing full payment:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error al procesar pago completo' },
            { status: 500 }
        );
    }
}*/