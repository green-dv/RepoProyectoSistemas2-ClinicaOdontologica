import { OdontogramaRepository } from "@/domain/repositories/OdontogramaRepository";
import { OdontogramDescription } from "@/domain/entities/OdontogramDescription";

export class GetDescriptionsUseCase {
    constructor(private odontogramRepository: OdontogramaRepository) {}

    async execute(idodontograma: number): Promise<OdontogramDescription[] | null> {
        return this.odontogramRepository.getDescriptions(idodontograma);
    }
}