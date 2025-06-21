import { ConsultationRepository } from '@/domain/repositories/ConsultationRepository';
import { ConsultationDetail } from '@/domain/dto/consultation';
export class GetConsultaUseCases {
    constructor(private consultaRepository: ConsultationRepository) {}

    async execute(id: number): Promise<ConsultationDetail | null> {
        if(id<= 0){
            throw new Error("El ID de la consulta debe ser un número positivo");
        }
        return await this.consultaRepository.findbyIdConsultationDetail(id);
    }
}