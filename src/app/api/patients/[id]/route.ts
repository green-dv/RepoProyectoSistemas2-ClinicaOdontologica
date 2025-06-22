
import { NextRequest, NextResponse } from 'next/server';
import { GetPatientByIdUseCase } from '@/application/usecases/patients/GetPatientByIdUseCases';
import { UpdatePatientUseCase } from '@/application/usecases/patients/UpdatePatientUseCases';
import { DeletePatientUseCase } from '@/application/usecases/patients/DeletePatientUseCases';
import { RestorePatientUseCase } from '@/application/usecases/patients/RestorePatientUseCases';
import { DeletePermanentlyPatientUseCase } from '@/application/usecases/patients/DeletePermanentlyPatientUseCases';

import { IPatientRepository } from '@/infrastructure/repositories/PatientRepository';

import { Patient } from '@/domain/entities/Patient';

const patientRepository = new IPatientRepository();
const getPatientByIdUseCase = new GetPatientByIdUseCase(patientRepository);
const updatePatientUseCase = new UpdatePatientUseCase(patientRepository);
const deletePatientUseCase = new DeletePatientUseCase(patientRepository);
const deletePermanentlyPatientUseCase = new DeletePermanentlyPatientUseCase(patientRepository);
const restorePatientUseCase = new RestorePatientUseCase(patientRepository);


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id); 
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid patient ID' },
        { status: 400 }
      );
    }
    
    const patient = await getPatientByIdUseCase.execute(id);
    
    if (!patient) {
      return NextResponse.json(
        { message: 'Patient not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(patient, { status: 200 });
  } catch (error) {
    console.error('Error getting patient:', error);
    return NextResponse.json(
      { message: 'Error retrieving patient' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id); 
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid patient ID' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    
    if (!data.nombres || !data.apellidos) {
      return NextResponse.json(
        { message: 'Nombres y apellidos son requeridos' },
        { status: 400 }
      );
    }
    
    const patient: Patient = {
      nombres: data.nombres,
      apellidos: data.apellidos,
      direccion: data.direccion || '',
      telefonodomicilio: data.telefonodomicilio || '',
      telefonopersonal: data.telefonopersonal || '',
      lugarnacimiento: data.lugarnacimiento || '',
      fechanacimiento: data.fechanacimiento || '',
      sexo: data.sexo !== undefined ? data.sexo : true,
      estadocivil: data.estadocivil || '',
      ocupacion: data.ocupacion || '',
      aseguradora: data.aseguradora || '',
      habilitado: data.habilitado !== undefined ? data.habilitado : true
    };
    
    const updatedPatient = await updatePatientUseCase.execute(id, patient);
    
    if (!updatedPatient) {
      return NextResponse.json(
        { message: 'Patient not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedPatient, { status: 200 });
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json(
      { message: 'Error updating patient' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

try{
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id); 
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid patient ID' },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const permanent = url.searchParams.get('permanent') === 'true';
    
    if (permanent) {
      const result = await deletePermanentlyPatientUseCase.execute(id);
      
      if (!result) {
        return NextResponse.json(
          { message: 'Patient not found or cannot be permanently deleted (must be disabled first)' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { message: 'Patient permanently deleted' },
        { status: 200 }
      );
    } else {
      const result = await deletePatientUseCase.execute(id);
      
      if (!result) {
        return NextResponse.json(
          { message: 'Patient not found or already deleted' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { message: 'Patient successfully deleted (soft delete)' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json(
      { message: 'Error deleting patient' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id); 
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid patient ID' },
        { status: 400 }
      );
    }

    const data = await request.json();
    
    if (data.action === 'restore') {
      const result = await restorePatientUseCase.execute(id);
      
      if (!result) {
        return NextResponse.json(
          { message: 'Patient not found or already enabled' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { message: 'Patient successfully restored' },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { message: 'Invalid action. Use action: "restore" to restore a patient' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing patient action:', error);
    return NextResponse.json(
      { message: 'Error processing patient action' },
      { status: 500 }
    );
  }
}