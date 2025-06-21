import { ConsultationResponse } from "@/domain/dto/consultation";
import { ConsultationRepository } from "@/domain/repositories/ConsultationRepository";

export class GetConsultationListUseCases {
    constructor(private consultationRepository: ConsultationRepository) {}

    async execute(page: number = 1, limit: number = 10, searchQuery?: string): Promise<ConsultationResponse> {
        return this.consultationRepository.getPaginatedConsultations(page, limit, searchQuery);
    }
}