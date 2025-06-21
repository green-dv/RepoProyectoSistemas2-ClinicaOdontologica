import { OdontogramaRepository } from "@/domain/repositories/OdontogramaRepository";
import { Odontogram } from "@/domain/entities/Odontogram";

export class GetLastOdontogramUseCase {
    constructor(private odontogramRepository: OdontogramaRepository) {}

    async execute(patientId: number): Promise<Odontogram | null> {
        return await this.odontogramRepository.getLastOdontogramPerPatientId(patientId);
    }
}