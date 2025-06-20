import { NextRequest, NextResponse } from 'next/server';
import { IAntecedenteRepository } from '@/infrastructure/repositories/AntecedentRepository';
import { AddAtencionMedicaUseCase, RemoveAtencionMedicaUseCase } from '@/application/usecases/antecedents/AddRelationsAntecedentUseCases';
import { GetAtencionesMedicasByAntecedenteIdUseCase } from '@/application/usecases/antecedents/GetMedicationAttentionAntecedentById';

const antecedenteRepository = new IAntecedenteRepository();
const addMedicalAttentionUseCase = new AddAtencionMedicaUseCase(antecedenteRepository);
const removeMedicalAttentionUseCase = new RemoveAtencionMedicaUseCase(antecedenteRepository);
const getAtencionMedicasByAntecedenteId = new GetAtencionesMedicasByAntecedenteIdUseCase(antecedenteRepository);


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
        
        const medicalattentions = await getAtencionMedicasByAntecedenteId.execute(antecedenteId);
        
        return NextResponse.json({
            success: true,
            data: medicalattentions
        }, { status: 200 });
        } catch (error) {
        console.error('Error obteniendo atencion medica:', error);
        return NextResponse.json(
            { message: 'Error al obtener atencion medica', success: false },
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
    const antecedenteId = parseInt(resolvedParams.id); 
    
    if (isNaN(antecedenteId)) {
      return NextResponse.json(
        { message: 'Invalid antecedente ID' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    
    if (!data.idatencionmedica) {
      return NextResponse.json(
        { message: 'ID de atencion medica es requerido' },
        { status: 400 }
      );
    }
    
    const result = await addMedicalAttentionUseCase.execute(antecedenteId, data.idatencionmedica);
    
    if (!result) {
      return NextResponse.json(
        { message: 'Failed to add medical attention to antecedente' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'medical attention added successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding medical attention to antecedente:', error);
    return NextResponse.json(
      { message: 'Error adding medical attention to antecedente' },
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
    
    if (!data.idatencionmedica) {
      return NextResponse.json(
        { message: 'ID de medical attention es requerido' },
        { status: 400 }
      );
    }
    
    const result = await removeMedicalAttentionUseCase.execute(antecedenteId, data.idatencionmedica)
        
    if (!result) {
        return NextResponse.json(
            { message: 'Medical attention not found or already removed from antecedente' },
            { status: 404 }
        );
    }
        
        return NextResponse.json(
        { message: 'Medical attention removed successfully' },
        { status: 200 }
        );
    } catch (error) {
        console.error('Error removing medical attention from antecedente:', error);
        return NextResponse.json(
        { message: 'Error removing medical attention from antecedente' },
        { status: 500 }
        );
    }
}