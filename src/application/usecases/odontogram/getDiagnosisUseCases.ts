import { OdontogramaRepository } from "@/domain/repositories/OdontogramaRepository";
import { Diagnosis } from "@/domain/entities/Diagnosis";

export class GetDiagnosisUseCases {
    constructor(private odontogramRepository: OdontogramaRepository) {}

    async execute(): Promise<Diagnosis[] | null> {
        return this.odontogramRepository.getDiagnosis();
    }
}