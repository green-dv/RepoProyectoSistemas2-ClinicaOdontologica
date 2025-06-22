import { NextRequest, NextResponse } from "next/server";
import { IConsultationRepository } from "@/infrastructure/repositories/ConsultationRepository";
import { GetConsultaUseCases } from "@/application/usecases/consultations/GetConsultaUseCases";
import { UpdateConsultationUseCases } from "@/application/usecases/consultations/UpdateConsultationUseCases";
import { DeleteConsultationUseCases } from "@/application/usecases/consultations/DeleteConsultationsUseCases";

const consultationRepository = new IConsultationRepository();
const getConsultaUseCases = new GetConsultaUseCases(consultationRepository);
const updateConsultationUseCases = new UpdateConsultationUseCases(consultationRepository);
const deleteConsultationUseCases = new DeleteConsultationUseCases(consultationRepository);

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const consultationId = parseInt(id);
        const consultation = await getConsultaUseCases.execute(consultationId);
        return NextResponse.json(consultation, { status: 200 });
    } catch (error) {
        console.error("Error al obtener consulta:", error);
        const status = (error instanceof Error && error.message.includes('no encontrada')) ? 404 : 500;
        return NextResponse.json(
            { 
                message: "Error al obtener la consulta", 
                error: (error instanceof Error) ? error.message : String(error) 
            },
            { status }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const body = await request.json();
        
        // Convertir fecha string a Date si es necesario
        if (body.fecha && typeof body.fecha === 'string') {
            body.fecha = new Date(body.fecha);
        }
        
        const consultation = await updateConsultationUseCases.execute(id, body);
        return NextResponse.json(consultation, { status: 200 });
    } catch (error) {
        console.error("Error al actualizar consulta:", error);
        const status = (error instanceof Error && error.message.includes('no encontrada')) ? 404 : 400;
        return NextResponse.json(
            { 
                message: "Error al actualizar la consulta", 
                error: (error instanceof Error) ? error.message : String(error) 
            },
            { status }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const result = await deleteConsultationUseCases.execute(id);
        
        if (result) {
            return NextResponse.json(
                { message: "Consulta eliminada exitosamente" }, 
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { message: "No se pudo eliminar la consulta" }, 
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error al eliminar consulta:", error);
        const status = (error instanceof Error && error.message.includes('no encontrada')) ? 404 : 500;
        return NextResponse.json(
            { 
                message: "Error al eliminar la consulta", 
                error: (error instanceof Error) ? error.message : String(error) 
            },
            { status }
        );
    }
}