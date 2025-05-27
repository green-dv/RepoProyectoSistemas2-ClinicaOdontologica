import { NextRequest, NextResponse } from 'next/server';
import { IAntecedenteRepository } from '@/infrastructure/repositories/AntecedentRepository';
import { GetAntecedentesUseCase } from '@/application/usecases/antecedents/GetAntecedentsUseCases';
import { CreateAntecedenteUseCase } from '@/application/usecases/antecedents/CreateAntecedentUseCases';
import { AntecedenteCompleto } from '@/domain/entities/Antecedent';

const antecedenteRepository = new IAntecedenteRepository();
const getAntecedentesUseCase = new GetAntecedentesUseCase(antecedenteRepository);
const createAntecedenteUseCase = new CreateAntecedenteUseCase(antecedenteRepository);

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        
        const antecedentes = await getAntecedentesUseCase.execute(page, limit);
        return NextResponse.json(antecedentes, { status: 200 });
    } catch (error) {
        console.error('Error getting antecedentes:', error);
        return NextResponse.json(
        { message: 'Error retrieving antecedentes' }, 
        { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        
        if (!data.idpaciente) {
        return NextResponse.json(
            { message: 'ID del paciente es requerido' },
            { status: 400 }
        );
        }
        
        const antecedente: AntecedenteCompleto = {
            idpaciente: data.idpaciente,
            embarazo: data.embarazo !== undefined ? data.embarazo : false,
            habilitado: data.habilitado !== undefined ? data.habilitado : true,
            fecha: new Date(data.fecha) || new Date(),
            enfermedades: data.enfermedades || [],
            habitos: data.habitos || [],
            medicaciones: data.medicaciones || [],
            atencionesMedicas: data.atencionesMedicas || []
        };
        
        const createdAntecedente = await createAntecedenteUseCase.execute(antecedente);
        return NextResponse.json(createdAntecedente, { status: 201 });
    } catch (error) {
        console.error('Error creating antecedente:', error);
        return NextResponse.json(
            { message: 'Error creating antecedente' },
            { status: 500 }
        );
    }
}
