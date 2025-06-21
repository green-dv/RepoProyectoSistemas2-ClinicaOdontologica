import { ConsultationRepository } from "@/domain/repositories/ConsultationRepository";

export class AddTreatmentsConsultationUseCases {
    constructor(private consultationRepository: ConsultationRepository) {}

    async execute(consultationId: number, treatmentIds: number[]): Promise<void> {
        if (!consultationId || consultationId <= 0) {
            throw new Error("ID de consulta inválido");
        }

        if (!treatmentIds || treatmentIds.length === 0) {
            throw new Error("Debe proporcionar al menos un tratamiento");
        }

        // Validar que todos los IDs de tratamiento sean válidos
        const invalidIds = treatmentIds.filter(id => !id || id <= 0);
        if (invalidIds.length > 0) {
            throw new Error("Todos los IDs de tratamiento deben ser válidos");
        }

        // Verificar que la consulta existe
        const existingConsultation = await this.consultationRepository.findbyIdConsultation(consultationId);
        if (!existingConsultation) {
            throw new Error(`Consulta con ID ${consultationId} no encontrada`);
        }

        await this.consultationRepository.addTreatments(consultationId, treatmentIds);
    }
}