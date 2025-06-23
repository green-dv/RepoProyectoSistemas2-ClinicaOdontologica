// /app/api/consultations/[id]/treatments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { IConsultationRepository } from "@/infrastructure/repositories/ConsultationRepository";
import { GetTreatmentsByConsultationUseCases } from "@/application/usecases/consultations/GetTreatmentsByConsultationUseCases";
import { AddTreatmentsConsultationUseCases } from "@/application/usecases/consultations/AddTreatmentsUseCases";
import { RemoveTreatmentsConsultationUseCases } from "@/application/usecases/consultations/RemoveTreatmentsUseCases";

const consultationRepository = new IConsultationRepository();
const getTreatmentsByConsultationUseCases = new GetTreatmentsByConsultationUseCases(consultationRepository);
const addTreatmentsConsultationUseCases = new AddTreatmentsConsultationUseCases(consultationRepository);
const removeTreatmentsConsultationUseCases = new RemoveTreatmentsConsultationUseCases(consultationRepository);

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {

        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        const treatments = await getTreatmentsByConsultationUseCases.execute(id);
        return NextResponse.json(treatments, { status: 200 });
    } catch (error) {
        console.error("Error al obtener tratamientos de consulta:", error);
        const status = (error instanceof Error && error.message.includes('no encontrada')) ? 404 : 500;
        return NextResponse.json(
            { 
                message: "Error al obtener los tratamientos de la consulta", 
                error: (error instanceof Error) ? error.message : String(error) 
            },
            { status }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const treatmentId = parseInt(id);

        const { treatmentIds } = await request.json();
        
        if (!Array.isArray(treatmentIds)) {
            return NextResponse.json(
                { message: "treatmentIds debe ser un array" },
                { status: 400 }
            );
        }
        
        await addTreatmentsConsultationUseCases.execute(treatmentId, treatmentIds);
        return NextResponse.json(
            { message: "Tratamientos agregados exitosamente" }, 
            { status: 200 }
        );
    } catch (error) {
        console.error("Error al agregar tratamientos:", error);
        const status = (error instanceof Error && error.message.includes('no encontrada')) ? 404 : 400;
        return NextResponse.json(
            { 
                message: "Error al agregar tratamientos a la consulta", 
                error: (error instanceof Error) ? error.message : String(error) 
            },
            { status }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const treatmentId = parseInt(id);

        const { treatmentIds } = await request.json();
        
        if (!Array.isArray(treatmentIds)) {
            return NextResponse.json(
                { message: "treatmentIds debe ser un array" },
                { status: 400 }
            );
        }
        
        await removeTreatmentsConsultationUseCases.execute(treatmentId, treatmentIds);
        return NextResponse.json(
            { message: "Tratamientos removidos exitosamente" }, 
            { status: 200 }
        );
    } catch (error) {
        console.error("Error al remover tratamientos:", error);
        const status = (error instanceof Error && error.message.includes('no encontrada')) ? 404 : 400;
        return NextResponse.json(
            { 
                message: "Error al remover tratamientos de la consulta", 
                error: (error instanceof Error) ? error.message : String(error) 
            },
            { status }
        );
    }
}