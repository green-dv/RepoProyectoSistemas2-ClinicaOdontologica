import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/application/usecases/payments/paymentUseCase';
import { PaymentRepository } from '@/infrastructure/repositories/PaymentRepository';
import { PaymentPlanRepository } from '@/infrastructure/repositories/PaymentPlanRepository';
import { UpdatePaymentDTO } from '@/domain/dto/payments';

const paymentRepository = new PaymentRepository();
const paymentPlanRepository = new PaymentPlanRepository();
const paymentService = new PaymentService(paymentRepository, paymentPlanRepository);

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) 
{
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id); 
        
        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }
        
        const payment = await paymentService.getPaymentById(id);
        
        if (!payment) {
            return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 });
        }
        
        return NextResponse.json({ data: payment });
    } catch (error) {
        console.error('Error getting payment:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error al obtener pago' },
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
        
        const paymentData: UpdatePaymentDTO = {
            idpago: id,
            montoesperado: body.montoesperado,
            montopagado: body.montopagado,
            fechapago: body.fechapago,
            estado: body.estado,
            enlacecomprobante: body.enlacecomprobante
        };
        
        const updatedPayment = await paymentService.updatePayment(paymentData);
        return NextResponse.json({ data: updatedPayment });
    } catch (error) {
        console.error('Error updating payment:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error al actualizar pago' },
            { status: 500 }
        );
    }
}