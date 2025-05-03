import { NextRequest, NextResponse } from 'next/server';
import { PaymentPlanService } from '@/application/usecases/paymentsPlan/paymentPlanUseCase';
import { PaymentPlanRepository } from '@/infrastructure/repositories/PaymentPlanRepository';
import { PaymentRepository } from '@/infrastructure/repositories/PaymentRepository';
import { CreatePaymentPlanDTO } from '@/domain/dto/paymentPlan';

const paymentPlanRepository = new PaymentPlanRepository();
const paymentRepository = new PaymentRepository();
const paymentPlanService = new PaymentPlanService(paymentPlanRepository, paymentRepository);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const consultaId = searchParams.get('consultaId');
        
        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return NextResponse.json(
                { error: 'Parámetros de paginación inválidos' },
                { status: 400 }
            );
        }
        
        if (consultaId) {
            const plans = await paymentPlanService.getPaymentPlansByConsulta(parseInt(consultaId, 10));
            return NextResponse.json({ data: plans });
        }
        
        const response = await paymentPlanService.getPaginatedPaymentPlans(page, limit);
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error getting payment plans:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error al obtener planes' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        const planData: CreatePaymentPlanDTO = {
            fechacreacion: body.fechacreacion || new Date().toISOString(),
            fechalimite: body.fechalimite,
            montotal: body.montotal,
            descripcion: body.descripcion,
            estado: body.estado || 'pendiente',
            idconsulta: body.idconsulta,
            installments: body.installments || []
        };
        
        if (!planData.fechalimite || !planData.montotal || !planData.idconsulta) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos => fechalimite, montotal, idconsulta' },
                { status: 400 }
            );
        }

        if (planData.installments.length === 0 && planData.montotal <= 0) {
            return NextResponse.json(
                { error: 'Debe proporcionar cuotas o un monto total el cual sea válido' },
                { status: 400 }
            );
        }
        
        const paymentPlan = await paymentPlanService.createPaymentPlanWithInstallments(planData);
        return NextResponse.json({ data: paymentPlan }, { status: 201 });
    } catch (error) {
        console.error('Error creating payment plan:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error al crear plan' },
            { status: 500 }
        );
    }
}