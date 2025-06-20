import { NextRequest, NextResponse } from 'next/server';
import { IAntecedenteRepository } from '@/infrastructure/repositories/AntecedentRepository';
import { GetAntecedentesByPatientIdUseCase } from '@/application/usecases/antecedents/GetAntecedentByPatientUseCases';
import { CreateAntecedenteUseCase } from '@/application/usecases/antecedents/CreateAntecedentUseCases';


const antecedenteRepository = new IAntecedenteRepository();
const getAntecedentesByPatientIdUseCase = new GetAntecedentesByPatientIdUseCase(antecedenteRepository);
const createAntecedenteUseCase = new CreateAntecedenteUseCase(antecedenteRepository);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const patientId = parseInt(resolvedParams.id); 
        
        if (isNaN(patientId)) {
        return NextResponse.json(
            { message: 'Invalid patient ID' },
            { status: 400 }
        );
        }
        
        const antecedentes = await getAntecedentesByPatientIdUseCase.execute(patientId);
        return NextResponse.json(antecedentes, { status: 200 });
    } catch (error) {
        console.error('Error getting patient antecedentes:', error);
        return NextResponse.json(
        { message: 'Error retrieving patient antecedentes' },
        { status: 500 }
        );
    }
}
export async function POST(request: NextRequest,{ params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const patientId = parseInt(resolvedParams.id); 
    
        if (isNaN(patientId)) {
            return NextResponse.json(
                { message: 'Invalid patient ID' },
                { status: 400 }
            );
        }
    
        const data = await request.json();
    
    
        data.idpaciente = patientId;
    
        const result = await createAntecedenteUseCase.execute(data);
    
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error('Error creating antecedente:', error);
        return NextResponse.json(
            { message: 'Error creating antecedente' },
            { status: 500 }
        );
    }
}