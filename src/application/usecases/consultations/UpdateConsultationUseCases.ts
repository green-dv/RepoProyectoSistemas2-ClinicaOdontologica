import { ConsultationRepository } from "@/domain/repositories/ConsultationRepository";
import { Consultation } from "@/domain/entities/Consultations";
import { UpdateConsultationDTO } from "@/domain/dto/consultation";
export class UpdateConsultationUseCases {
    constructor(private consultationRepository: ConsultationRepository) {}

    async execute(id: number, data: UpdateConsultationDTO): Promise<Consultation | null> {
        if (id <= 0) {
            throw new Error("El ID de la consulta debe ser un número positivo");
        }
        if (data.presupuesto !== undefined && data.presupuesto < 0) {
            throw new Error("El presupuesto no puede ser negativo");
        }
        if (data.fecha && data.fecha > new Date()) {
            throw new Error("La fecha de la consulta no puede ser posterior a la fecha actual");
        }
        const processedDto = {
            ...data,
            // Si la fecha viene como string, asegurarse de que esté en el formato correcto
            fecha: data.fecha ? new Date(data.fecha).toISOString() : undefined
        };
        return await this.consultationRepository.updateConsultation(id, processedDto);
    }
}