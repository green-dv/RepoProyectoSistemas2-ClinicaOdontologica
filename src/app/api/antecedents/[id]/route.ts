import { NextRequest, NextResponse } from 'next/server';
import { IAntecedenteRepository } from '@/infrastructure/repositories/AntecedentRepository';
import { GetAntecedenteByIdUseCase } from '@/application/usecases/antecedents/GetAntecedentByIdUseCases';
import { UpdateAntecedenteUseCase } from '@/application/usecases/antecedents/UpdateAntecedentUseCases';
import { DeleteAntecedenteUseCase } from '@/application/usecases/antecedents/DeleteAntecedentUseCases';
import { AntecedenteCompleto } from '@/domain/entities/Antecedent';

const antecedenteRepository = new IAntecedenteRepository();
const getAntecedenteByIdUseCase = new GetAntecedenteByIdUseCase(antecedenteRepository);
const updateAntecedenteUseCase = new UpdateAntecedenteUseCase(antecedenteRepository);
const deleteAntecedenteUseCase = new DeleteAntecedenteUseCase(antecedenteRepository);

interface RouteParams {
    params: {
        id: string;
    };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
    try {
        const id = parseInt(params.id); 
        
        if (isNaN(id)) {
        return NextResponse.json(
            { message: 'Invalid antecedente ID' },
            { status: 400 }
        );
        }
        
        const antecedente = await getAntecedenteByIdUseCase.execute(id);
        
        if (!antecedente) {
        return NextResponse.json(
            { message: 'Antecedente not found' },
            { status: 404 }
        );
        }
        
        return NextResponse.json(antecedente, { status: 200 });
    } catch (error) {
        console.error('Error getting antecedente:', error);
        return NextResponse.json(
        { message: 'Error retrieving antecedente' },
        { status: 500 }
        );
    }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
    try {
        const id = parseInt(params.id);
        
        if (isNaN(id)) {
        return NextResponse.json(
            { message: 'Invalid antecedente ID' },
            { status: 400 }
        );
        }
        
        const data = await request.json();
        
        // Basic validation
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
        
        const updatedAntecedente = await updateAntecedenteUseCase.execute(id, antecedente);
        
        if (!updatedAntecedente) {
        return NextResponse.json(
            { message: 'Antecedente not found' },
            { status: 404 }
        );
        }
        
        return NextResponse.json(updatedAntecedente, { status: 200 });
    } catch (error) {
        console.error('Error updating antecedente:', error);
        return NextResponse.json(
        { message: 'Error updating antecedente' },
        { status: 500 }
        );
    }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
    try {
        const id = parseInt(params.id);
        
        if (isNaN(id)) {
        return NextResponse.json(
            { message: 'Invalid antecedente ID' },
            { status: 400 }
        );
        }
        
        const result = await deleteAntecedenteUseCase.execute(id);
        
        if (!result) {
        return NextResponse.json(
            { message: 'Antecedente not found or already deleted' },
            { status: 404 }
        );
        }
        
        return NextResponse.json(
        { message: 'Antecedente successfully deleted' },
        { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting antecedente:', error);
        return NextResponse.json(
        { message: 'Error deleting antecedente' },
        { status: 500 }
        );
    }
}