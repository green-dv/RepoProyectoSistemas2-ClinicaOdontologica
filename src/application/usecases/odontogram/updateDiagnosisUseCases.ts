import { OdontogramaRepository } from "@/domain/repositories/OdontogramaRepository";
import { Diagnosis } from "@/domain/entities/Diagnosis";

export class UpdateDiagnosisUseCases {
    constructor(private odontogramRepository: OdontogramaRepository) {}

    async execute(diagnosis: Diagnosis): Promise<Diagnosis | null> {
        return this.odontogramRepository.updateDiagnosis(diagnosis);
    }
}