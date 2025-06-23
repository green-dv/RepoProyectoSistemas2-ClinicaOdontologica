import { NextRequest, NextResponse } from "next/server";
import { IConsultationRepository } from "@/infrastructure/repositories/ConsultationRepository";
import { GetConsultationsByPatientUseCases } from "@/application/usecases/consultations/GetConsultationsByPatientUseCases";

const consultationRepository = new IConsultationRepository();
const getConsultationsByPatientUseCases = new GetConsultationsByPatientUseCases(consultationRepository);

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id); 

        const consultations = await getConsultationsByPatientUseCases.execute(id);
        return NextResponse.json(consultations, { status: 200 });
    } catch (error) {
        console.error("Error al obtener consultas del paciente:", error);
        return NextResponse.json(
            { 
                message: "Error al obtener las consultas del paciente", 
                error: (error instanceof Error) ? error.message : String(error) 
            },
            { status: 500 }
        );
    }
}