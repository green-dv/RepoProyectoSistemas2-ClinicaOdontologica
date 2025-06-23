import { NextRequest, NextResponse } from "next/server";
import { GetReportDebtsByPatientUseCase } from "@/application/usecases/reports/GetDebtsByPatientUseCases";
import { IReportDebtsByPatientRepository } from "@/infrastructure/repositories/ReportDebtsByPatientRepository";
import { debtsByPatient } from "@/domain/entities/reports/debtsByPatient";

const repo = new IReportDebtsByPatientRepository();
const getDebtsByPatientUseCase = new GetReportDebtsByPatientUseCase(repo);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const idParam = searchParams.get("idpaciente");

        const patientId = idParam ? parseInt(idParam, 10) : null;

        const result: debtsByPatient[] = await getDebtsByPatientUseCase.execute(patientId);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error al obtener deudas del paciente:", error);
        return NextResponse.json(
            { message: "Error interno del servidor", error: (error instanceof Error) ? error.message : String(error) },
            { status: 500 }
        );
    }
}
