import { NextRequest, NextResponse } from 'next/server';
import { IAntecedenteRepository } from '@/infrastructure/repositories/AntecedentRepository';
import { AddEnfermedadUseCase, RemoveEnfermedadUseCase } from '@/application/usecases/antecedents/AddRelationsAntecedentUseCases';
import { GetEnfermedadesByAntecedenteIdUseCase } from '@/application/usecases/antecedents/GetDiseaseAntecedentByID';


const antecedenteRepository = new IAntecedenteRepository();
const addEnfermedadUseCase = new AddEnfermedadUseCase(antecedenteRepository);
const removeEnfermedadUseCase = new RemoveEnfermedadUseCase(antecedenteRepository);
const getEnfermedadesByAntecedenteIdUseCase = new GetEnfermedadesByAntecedenteIdUseCase(antecedenteRepository);



export async function GET(
    request: NextRequest,
   { params }: { params: { id: string } }
  ) {
    try {
        const antecedenteId = parseInt(params.id);
        
        if (isNaN(antecedenteId)) {
            return NextResponse.json(
            { message: 'ID de antecedente inválido' },
            { status: 400 }
            );
        }
        
        const enfermedades = await getEnfermedadesByAntecedenteIdUseCase.execute(antecedenteId);
        
        return NextResponse.json({
            success: true,
            data: enfermedades
        }, { status: 200 });
        } catch (error) {
        console.error('Error obteniendo enfermedades:', error);
        return NextResponse.json(
            { message: 'Error al obtener enfermedades', success: false },
            { status: 500 }
        );
    }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        const antecedenteId = parseInt(params.id);
        
        if (isNaN(antecedenteId)) {
        return NextResponse.json(
            { message: 'Invalid antecedente ID' },
            { status: 400 }
        );
        }
        
        const data = await request.json();
        
        if (!data.idenfermedad) {
        return NextResponse.json(
            { message: 'ID de enfermedad es requerido' },
            { status: 400 }
        );
        }
        
        const result = await addEnfermedadUseCase.execute(antecedenteId, data.idenfermedad);
        
        if (!result) {
        return NextResponse.json(
            { message: 'Failed to add enfermedad to antecedente' },
            { status: 400 }
        );
        }
        
        return NextResponse.json(
        { message: 'Enfermedad added successfully' },
        { status: 201 }
        );
    } catch (error) {
        console.error('Error adding enfermedad to antecedente:', error);
        return NextResponse.json(
        { message: 'Error adding enfermedad to antecedente' },
        { status: 500 }
        );
    }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        const antecedenteId = parseInt(params.id);
        
        if (isNaN(antecedenteId)) {
        return NextResponse.json(
            { message: 'Invalid antecedente ID' },
            { status: 400 }
        );
        }
        
        const data = await request.json();
        
        if (!data.idenfermedad) {
        return NextResponse.json(
            { message: 'ID de enfermedad es requerido' },
            { status: 400 }
        );
        }
        
        const result = await removeEnfermedadUseCase.execute(antecedenteId, data.idenfermedad);
        
        if (!result) {
        return NextResponse.json(
            { message: 'Enfermedad not found or already removed from antecedente' },
            { status: 404 }
        );
        }
        
        return NextResponse.json(
        { message: 'Enfermedad removed successfully' },
        { status: 200 }
        );
    } catch (error) {
        console.error('Error removing enfermedad from antecedente:', error);
        return NextResponse.json(
        { message: 'Error removing enfermedad from antecedente' },
        { status: 500 }
        );
    }
}