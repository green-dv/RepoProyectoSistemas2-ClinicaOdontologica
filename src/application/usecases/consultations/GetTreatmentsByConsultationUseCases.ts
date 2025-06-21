import { Treatment } from "@/domain/entities/Treatments";
import { ConsultationRepository } from "@/domain/repositories/ConsultationRepository";

export class GetTreatmentsByConsultationUseCases {
    constructor(private consultationRepository: ConsultationRepository) {}

    async execute(consultationId: number): Promise<Treatment[]> {
        if (!consultationId || consultationId <= 0) {
            throw new Error("ID de consulta inválido");
        }
        const existingConsultation = await this.consultationRepository.findbyIdConsultation(consultationId);
        if (!existingConsultation) {
            throw new Error(`Consulta con ID ${consultationId} no encontrada`);
        }

        return await this.consultationRepository.getTreatmentsByConsultationId(consultationId);
    }
}