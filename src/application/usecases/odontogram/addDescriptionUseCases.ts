import { OdontogramaRepository } from "@/domain/repositories/OdontogramaRepository";
import { OdontogramDescriptionDTO } from "@/domain/entities/OdontogramDescription";
export class AddDescriptionUseCase {
    constructor(private odontogramRepository: OdontogramaRepository) {}

    async execute(descripcion: OdontogramDescriptionDTO): Promise<OdontogramDescriptionDTO | null> {
        return this.odontogramRepository.addDescription(descripcion);
    }
}