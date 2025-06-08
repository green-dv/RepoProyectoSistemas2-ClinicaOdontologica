import { OdontogramaRepository } from "@/domain/repositories/OdontogramaRepository";
import { Odontogram } from "@/domain/entities/Odontogram";
export class GetOdontogramByConsultationIdUseCase {
    constructor(private odontogramRepository: OdontogramaRepository) {}

    async execute(consultationId: number): Promise<Odontogram | null> {
        return this.odontogramRepository.getOdontogramByConsultationId(consultationId);
    }
}