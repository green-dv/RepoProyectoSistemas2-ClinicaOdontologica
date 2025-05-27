import { NextRequest, NextResponse } from 'next/server';
import { IPatientRepository } from '@/infrastructure/repositories/PatientRepository';
import { GetPatientsDisabledUseCase } from '@/application/usecases/patients/GetPatientsDisableUseCases';
  
const patientRepository = new IPatientRepository();
const getPatientsDisabledUseCase = new GetPatientsDisabledUseCase(patientRepository);

export async function GET(request: NextRequest) {
    try {
        // Extract pagination parameters from query string
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const searchQuery = searchParams.get('search') || undefined;

        const patients = await getPatientsDisabledUseCase.execute(page, limit, searchQuery);
        return NextResponse.json(patients, { status: 200 });
    } catch (error) {
        console.error('Error getting patients:', error);
        return NextResponse.json(
          { message: 'Error retrieving patients' }, 
          { status: 500 }
        );
    }
}
  