import { NextRequest, NextResponse } from 'next/server';
import { PaymentPlanService } from '@/application/usecases/paymentsPlan/paymentPlanUseCase';
import { IRadiographyRepository } from '@/domain/repositories/RadiographyRepository';
import { RadiographyRepository } from '@/infrastructure/repositories/RadiographyRepository';
import { Radiography, Detection } from '@/domain/entities/Radiography';
import { getAllRadiographies } from '@/application/usecases/radiographies/getAllRadiographies';
import { createRadiography } from '@/application/usecases/radiographies/createRadiography';

const radiographyRepository = new RadiographyRepository();
const getRadiographiesUseCases = new getAllRadiographies(radiographyRepository);
const createRadiographyUseCases = new createRadiography(radiographyRepository);

export async function GET(request: NextRequest) { 
    try {
        
        const response = await getRadiographiesUseCases.execute();
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error getting radiographies:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error al obtener radiografias' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        const radiographyData: Radiography = {
            idradiografia: 0,
            fechasubida: body.fechasubida,
            enlaceradiografia: body.enlaceradiografia,
            idpaciente: body.idpaciente,
            detecciones: body.detecciones,
            paciente: ''
        };
        
        if (!radiographyData.enlaceradiografia || 
            !radiographyData.detecciones || 
            radiographyData.detecciones.length === 0 || 
            !radiographyData.idpaciente || 
            radiographyData.idpaciente === 0) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos => enlace o detecciones o paciente' },
                { status: 400 }
            );
        }

        
        const paymentPlan = await createRadiographyUseCases.execute(radiographyData);
        return NextResponse.json({ data: paymentPlan }, { status: 201 });
    } catch (error) {
        console.error('Error creating payment plan:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error al crear plan' },
            { status: 500 }
        );
    }
}