import { ConsultationRepository } from "@/domain/repositories/ConsultationRepository";

export class DeleteConsultationUseCases {
    constructor(private consultationRepository: ConsultationRepository) {}

    async execute(id: number): Promise<boolean> {
        if (!id || id <= 0) {
            throw new Error("ID de consulta inválido");
        }

        // Verificar que la consulta existe antes de eliminar
        const existingConsultation = await this.consultationRepository.findbyIdConsultation(id);
        if (!existingConsultation) {
            throw new Error(`Consulta con ID ${id} no encontrada`);
        }

        return await this.consultationRepository.deleteConsultation(id);
    }
}