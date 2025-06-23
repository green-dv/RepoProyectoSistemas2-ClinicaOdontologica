import { debtsByPatient } from "@/domain/entities/reports/debtsByPatient";

export interface ReportDebtsByPatientRepository {
    getDebtsByPatient(patientId: number | null): Promise<debtsByPatient[]>;
}
