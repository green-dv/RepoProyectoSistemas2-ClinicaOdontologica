import { NextRequest, NextResponse } from 'next/server';
import { RestorePatientUseCase } from '@/application/usecases/patients/RestorePatientUseCases';
import { IPatientRepository } from '@/infrastructure/repositories/PatientRepository';

const patientRepository = new IPatientRepository();
const restorePatientUseCase = new RestorePatientUseCase(patientRepository);

export async function POST(
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
    } catch (error) {
        console.error('Error restoring patient:', error);
        return NextResponse.json(
            { message: 'Error restoring patient' },
            { status: 500 }
        );
    }
}