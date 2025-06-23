import { Radiography } from "@/domain/entities/Radiography";
import { RadiographyRepository } from "@/infrastructure/repositories/RadiographyRepository";

export class getAllRadiographies {
    constructor(private radiographyRepository: RadiographyRepository) {}

    async execute(): Promise<Radiography[]> {
        return await this.radiographyRepository.getAll();
    }
}