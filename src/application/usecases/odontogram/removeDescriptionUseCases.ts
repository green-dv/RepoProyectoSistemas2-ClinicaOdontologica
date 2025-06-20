import { OdontogramaRepository } from "@/domain/repositories/OdontogramaRepository";
import { OdontogramDescription } from "@/domain/entities/OdontogramDescription";

export class RemoveDescriptionUseCase {
    constructor(private odontogramRepository: OdontogramaRepository) {}

    async execute(idOdontograma: number,idCara: number, idPieza: number,  iddiagnostico: number): Promise<OdontogramDescription | null> {
        return await this.odontogramRepository.removeDescription(idOdontograma, idCara, idPieza, iddiagnostico);
    }
}