import { NextRequest, NextResponse } from "next/server";
import { IConsultationRepository } from "@/infrastructure/repositories/ConsultationRepository";
import { GetConsultationListUseCases } from "@/application/usecases/consultations/GetConsultationListUseCases";
import { CreateConsultationUseCases } from "@/application/usecases/consultations/CreateConsultationUseCases";

const consultationRepository = new IConsultationRepository();
const getConsultationListUseCases = new GetConsultationListUseCases(consultationRepository);
const createConsultationUseCases = new CreateConsultationUseCases(consultationRepository);

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const searchQuery = searchParams.get('search') || undefined;
        
        const consultations = await getConsultationListUseCases.execute(page, limit, searchQuery);
        return NextResponse.json(consultations, { status: 200 });
    } catch (error) {
        console.error("Error al obtener la lista de consultas:", error);
        return NextResponse.json(
            { message: "Error al obtener la lista de consultas", error: (error instanceof Error) ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const consultation = await createConsultationUseCases.execute(body);
        return NextResponse.json(consultation, { status: 201 });
    } catch (error) {
        console.error("Error al crear consulta:", error);
        return NextResponse.json(
            { message: "Error al crear la consulta", error: (error instanceof Error) ? error.message : String(error) },
            { status: 400 }
        );
    }
}