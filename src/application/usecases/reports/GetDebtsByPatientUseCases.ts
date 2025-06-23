import { debtsByPatient } from "@/domain/entities/reports/debtsByPatient";
import { ReportDebtsByPatientRepository } from "@/domain/repositories/reports/debtsByPatientRepository";

export class GetReportDebtsByPatientUseCase {
    constructor(private repo: ReportDebtsByPatientRepository) {}

    async execute(patientId: number | null):Promise<debtsByPatient[]> {
        return this.repo.getDebtsByPatient(patientId);
    }
}
