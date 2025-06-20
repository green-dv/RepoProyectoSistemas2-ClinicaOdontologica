import { NextRequest, NextResponse } from 'next/server';
import { IAntecedenteRepository } from '@/infrastructure/repositories/AntecedentRepository';
import { AddMedicacionUseCase, RemoveMedicacionUseCase } from '@/application/usecases/antecedents/AddRelationsAntecedentUseCases';
import { GetMedicacionesByAntecedenteIdUseCase } from '@/application/usecases/antecedents/GetMedicationAntecedentById';

const antecedenteRepository = new IAntecedenteRepository();
const addMedicationUseCase = new AddMedicacionUseCase(antecedenteRepository);
const removeMedicationUseCase = new RemoveMedicacionUseCase(antecedenteRepository);
const getMedicacionesByAntecedenteIdUseCase = new GetMedicacionesByAntecedenteIdUseCase(antecedenteRepository);

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
        const resolvedParams = await params;
        const antecedenteId = parseInt(resolvedParams.id);
        
        if (isNaN(antecedenteId)) {
            return NextResponse.json(
            { message: 'ID de antecedente inválido' },
            { status: 400 }
            );
        }
        
        const medicaciones = await getMedicacionesByAntecedenteIdUseCase.execute(antecedenteId);
        
        return NextResponse.json({
            success: true,
            data: medicaciones
        }, { status: 200 });
        } catch (error) {
        console.error('Error obteniendo medicaciones:', error);
        return NextResponse.json(
            { message: 'Error al obtener medicaciones', success: false },
            { status: 500 }
        );
    }
}


export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const antecedenteId = parseInt(resolvedParams.id);;
    
    if (isNaN(antecedenteId)) {
      return NextResponse.json(
        { message: 'Invalid antecedente ID' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    
    if (!data.idmedicacion) {
      return NextResponse.json(
        { message: 'ID de medicacion es requerido' },
        { status: 400 }
      );
    }
    
    const result = await addMedicationUseCase.execute(antecedenteId, data.idmedicacion);
    
    if (!result) {
      return NextResponse.json(
        { message: 'Failed to add medication to antecedente' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Medication added successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding medication to antecedente:', error);
    return NextResponse.json(
      { message: 'Error adding medication to antecedente' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const antecedenteId = parseInt(resolvedParams.id);
    
    if (isNaN(antecedenteId)) {
      return NextResponse.json(
        { message: 'Invalid antecedente ID' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    
    if (!data.idmedicacion) {
      return NextResponse.json(
        { message: 'ID de medication es requerido' },
        { status: 400 }
      );
    }
    
    const result = await removeMedicationUseCase.execute(antecedenteId, data.idmedicacion)
        
    if (!result) {
        return NextResponse.json(
            { message: 'Medication not found or already removed from antecedente' },
            { status: 404 }
        );
    }
        
        return NextResponse.json(
        { message: 'Medication removed successfully' },
        { status: 200 }
        );
    } catch (error) {
        console.error('Error removing medication from antecedente:', error);
        return NextResponse.json(
        { message: 'Error removing medication from antecedente' },
        { status: 500 }
        );
    }
}