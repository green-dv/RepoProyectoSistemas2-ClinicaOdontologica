import { ConsultationByPatientDTO } from "@/domain/dto/consultation";
import { ConsultationRepository } from "@/domain/repositories/ConsultationRepository";

export class GetConsultationsByPatientUseCases {
    constructor(private consultationRepository: ConsultationRepository) {}

    async execute(patientId: number): Promise<ConsultationByPatientDTO[]> {
        if (!patientId || patientId <= 0) {
            throw new Error("ID de paciente inválido");
        }

        return await this.consultationRepository.findConsultationsByPatientId(patientId);
    }
}