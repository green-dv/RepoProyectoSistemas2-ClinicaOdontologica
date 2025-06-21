import { ConsultationDetail } from "@/domain/dto/consultation";
import { ConsultationRepository } from "@/domain/repositories/ConsultationRepository";

export class GetConsultationDetailUseCases {
    constructor(private consultationRepository: ConsultationRepository) {}

    async execute(id: number): Promise<ConsultationDetail> {
        if (!id || id <= 0) {
            throw new Error("ID de consulta inválido");
        }

        const consultationDetail = await this.consultationRepository.findbyIdConsultationDetail(id);
        
        if (!consultationDetail) {
            throw new Error(`Consulta con ID ${id} no encontrada`);
        }

        return consultationDetail;
    }
}