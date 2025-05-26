import { PaymentPlanByPatientReport } from "@/domain/entities/reports/paymentsbypatient";
import { IReportPaymentPlanByPatient } from "@/domain/repositories/reports/paymentByPatientRepository";

export class GetPaymentsByPatientsUseCase {
    constructor(private reportPaymentPlanByPatientRepository: IReportPaymentPlanByPatient) {}

    async execute(patientId: number): Promise<PaymentPlanByPatientReport[]> {
        return this.reportPaymentPlanByPatientRepository.getPaymentPlansByPatientId(patientId);
    }
}