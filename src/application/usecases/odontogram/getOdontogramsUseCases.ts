import { OdontogramaRepository } from "@/domain/repositories/OdontogramaRepository";
import { Odontogram } from "@/domain/entities/Odontogram";

export class GetOdontogramsUseCase {
    constructor(private odontogramRepository: OdontogramaRepository) {}

    async execute(page: number, limit: number, idpaciente: number, searchQuery?: string): Promise<Odontogram[] | null> {
        console.log(this.odontogramRepository.getOdontograms(page, limit, idpaciente, searchQuery))
        return await this.odontogramRepository.getOdontograms(page, limit, idpaciente, searchQuery);
       
    }
}