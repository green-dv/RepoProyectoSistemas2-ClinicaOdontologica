import { NextRequest, NextResponse } from 'next/server';
import { PaymentPlanService } from '@/application/usecases/paymentsPlan/paymentPlanUseCase';
import { IRadiographyRepository } from '@/domain/repositories/RadiographyRepository';
import { RadiographyRepository } from '@/infrastructure/repositories/RadiographyRepository';
import { getRadiographyById } from '@/application/usecases/radiographies/getRadiographyById';

const radiographyRepository = new RadiographyRepository();
const getRadiographiesUseCases = new getRadiographyById(radiographyRepository);

export async function GET(request: NextRequest) { 
    try {
        const body = await request.json();
        if(!body.radiografia) return null;
        const response = await getRadiographiesUseCases.execute(body.idradiografia);
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error getting radiographies:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error al obtener radiografias' },
            { status: 500 }
        );
    }
}
