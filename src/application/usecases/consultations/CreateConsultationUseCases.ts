import { ConsultationRepository } from '@/domain/repositories/ConsultationRepository';
import { Consultation } from '@/domain/entities/Consultations';
import { CreateConsultationDTO } from '@/domain/dto/consultation';
export class CreateConsultationUseCases {
    constructor(private consultationRepository: ConsultationRepository) {}

    async execute(data: CreateConsultationDTO): Promise<Consultation>{
        if(data.presupuesto < 0){
            throw new Error("El presupuesto no puede ser negativo");
        }
        if(data.fecha > new Date()){
            throw new Error("La fecha de la consulta no puede ser posterior a la fecha actual");
        }
        return await this.consultationRepository.createConsultation(data);
    } 
}