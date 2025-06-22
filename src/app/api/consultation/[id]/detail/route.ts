import { NextRequest, NextResponse } from "next/server";
import { IConsultationRepository } from "@/infrastructure/repositories/ConsultationRepository";
import { GetConsultationDetailUseCases } from "@/application/usecases/consultations/GetConsultationDetailsUseCases";

const consultationRepository = new IConsultationRepository();
const getConsultationDetailUseCases = new GetConsultationDetailUseCases(consultationRepository);

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        const consultationDetail = await getConsultationDetailUseCases.execute(id);
        return NextResponse.json(consultationDetail, { status: 200 });
    } catch (error) {
        console.error("Error al obtener detalle de consulta:", error);
        const status = (error instanceof Error && error.message.includes('no encontrada')) ? 404 : 500;
        return NextResponse.json(
            { 
                message: "Error al obtener el detalle de la consulta", 
                error: (error instanceof Error) ? error.message : String(error) 
            },
            { status }
        );
    }
}
