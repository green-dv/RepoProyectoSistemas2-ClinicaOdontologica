import { PaymentPlanByPatientReport } from "@/domain/entities/reports/paymentsbypatient";

export interface IReportPaymentPlanByPatient {
    getPaymentPlansByPatientId(patientId: number): Promise<PaymentPlanByPatientReport[]>;
}