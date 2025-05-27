import { NextRequest, NextResponse } from 'next/server';
import { IAntecedenteRepository } from '@/infrastructure/repositories/AntecedentRepository';
import { AddHabitoUseCase, RemoveHabitoUseCase } from '@/application/usecases/antecedents/AddRelationsAntecedentUseCases';
import { GetHabitosByAntecedenteIdUseCase } from '@/application/usecases/antecedents/GetHabitAntecedentById';
const antecedenteRepository = new IAntecedenteRepository();
const addHabitoUseCase = new AddHabitoUseCase(antecedenteRepository);
const removeHabitoUseCase = new RemoveHabitoUseCase(antecedenteRepository);
const getHabitosByAntecedenteIdUseCase = new GetHabitosByAntecedenteIdUseCase(antecedenteRepository);

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
        const antecedenteId = parseInt(params.id);
        
        if (isNaN(antecedenteId)) {
            return NextResponse.json(
            { message: 'ID de antecedente inválido' },
            { status: 400 }
            );
        }
        
        const habitos = await getHabitosByAntecedenteIdUseCase.execute(antecedenteId);
        
        return NextResponse.json({
            success: true,
            data: habitos
        }, { status: 200 });
        } catch (error) {
        console.error('Error obteniendo habitos:', error);
        return NextResponse.json(
            { message: 'Error al obtener habitos', success: false },
            { status: 500 }
        );
    }
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
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
    
    if (!data.idhabito) {
      return NextResponse.json(
        { message: 'ID de habito es requerido' },
        { status: 400 }
      );
    }
    
    const result = await addHabitoUseCase.execute(antecedenteId, data.idhabito);
    
    if (!result) {
      return NextResponse.json(
        { message: 'Failed to add habito to antecedente' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Habito added successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding habito to antecedente:', error);
    return NextResponse.json(
      { message: 'Error adding habito to antecedente' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
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
    
    if (!data.idhabito) {
      return NextResponse.json(
        { message: 'ID de habito es requerido' },
        { status: 400 }
      );
    }
    
    const result = await removeHabitoUseCase.execute(antecedenteId, data.idhabito)
        
    if (!result) {
        return NextResponse.json(
            { message: 'Habit not found or already removed from antecedente' },
            { status: 404 }
        );
    }
        
        return NextResponse.json(
        { message: 'Enfermedad removed successfully' },
        { status: 200 }
        );
    } catch (error) {
        console.error('Error removing desease from antecedente:', error);
        return NextResponse.json(
        { message: 'Error removing enfermedad from antecedente' },
        { status: 500 }
        );
    }
}