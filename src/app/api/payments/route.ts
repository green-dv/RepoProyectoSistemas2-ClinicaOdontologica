import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/application/usecases/payments/paymentUseCase';
import { PaymentRepository } from '@/infrastructure/repositories/PaymentRepository';
import { PaymentPlanRepository } from '@/infrastructure/repositories/PaymentPlanRepository';
import { CreatePaymentDTO } from '@/domain/dto/payments';

// Llamado a los serviciosd
const paymentRepository = new PaymentRepository();
const paymentPlanRepository = new PaymentPlanRepository();
const paymentService = new PaymentService(paymentRepository, paymentPlanRepository);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') ?? '1', 10);
        const limit = parseInt(searchParams.get('limit') ?? '10', 10);
        const planId = searchParams.get('planId');
        
        // para la paginacion
        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return NextResponse.json(
                { error: 'Parámetros de paginación son inválidos' }, 
                { status: 400 }
            );
        }
        
        if (planId) {
            const payments = await paymentService.getPaymentsByPlanId(parseInt(planId, 10));
            return NextResponse.json({ data: payments });
        }
        
        const response = await paymentService.getPaginatedPayments(page, limit);
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error getting payments:', error);
        return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Error al obtener pagos' },
        { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        const paymentData: CreatePaymentDTO = {
        montoesperado: body.montoesperado,
        montopagado: body.montopagado ?? 0,
        fechapago: body.fechapago,
        estado: body.estado ?? 'pendiente',
        enlacecomprobante: body.enlacecomprobante ?? null,
        idplanpago: body.idplanpago
        };
        
        if (!paymentData.montoesperado || !paymentData.fechapago || !paymentData.idplanpago) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos: montoesperado, fechapago, idplanpago' },
                { status: 400 }
            );
        }
        
        const createdPayment = await paymentService.createPayment(paymentData);
        return NextResponse.json({ data: createdPayment }, { status: 201 });
    } catch (error) {
        console.error('Error creating payment:', error);
        return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Error al crear pago' },
        { status: 500 }
        );
    }
}