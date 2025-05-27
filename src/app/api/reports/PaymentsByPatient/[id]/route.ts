import { NextResponse, NextRequest } from "next/server";
import { GetPaymentsByPatientsUseCase } from "@/application/usecases/reports/GetPaymentsByPatients";
import { ReportPaymentPlanByPatient } from "@/infrastructure/repositories/ReportPaymentPlanByPatient";
import { PaymentPlanByPatientReport } from "@/domain/entities/reports/paymentsbypatient";

const reportPaymentPlanByPatientRepository = new ReportPaymentPlanByPatient();
const getPaymentsByPatientUseCase = new GetPaymentsByPatientsUseCase(reportPaymentPlanByPatientRepository);

interface RouteParams {
  params: {
    id: string;
  };
}
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const patientId = parseInt(params.id);

        if (isNaN(patientId) || patientId <= 0) {
            return NextResponse.json(
                { message: "ID de paciente inválido" },
                { status: 400 }
            );
        }

        const payments: PaymentPlanByPatientReport[] = await getPaymentsByPatientUseCase.execute(patientId);
        return NextResponse.json(payments, { status: 200 });
    } catch (error) {
        console.error("Error al obtener pagos por paciente:", error);
        return NextResponse.json(
            { message: "Error al obtener pagos por paciente", error: (error instanceof Error) ? error.message : String(error) },
            { status: 500 }
        );
    }
}