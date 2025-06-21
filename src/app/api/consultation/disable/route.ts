import { NextRequest, NextResponse } from 'next/server';
import { IConsultationRepository } from '@/infrastructure/repositories/ConsultationRepository';
import { getConsultationsDisabled } from '@/application/usecases/consultations/GetConsultationDisabledUseCases';
  
const consultationRepository = new IConsultationRepository();
const getConsultationDisabledUseCase = new getConsultationsDisabled(consultationRepository);
    

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const searchQuery = searchParams.get('search') || undefined;

        const consultations = await getConsultationDisabledUseCase.execute(page, limit, searchQuery);
        return NextResponse.json(consultations, { status: 200 });
    } catch (error) {
        console.error('Error getting consultations:', error);
        return NextResponse.json(
          { message: 'Error retrieving consultations' }, 
          { status: 500 }
        );
    }
}
  