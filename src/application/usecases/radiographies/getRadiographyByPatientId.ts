import { Radiography } from "@/domain/entities/Radiography";
import { RadiographyRepository } from "@/infrastructure/repositories/RadiographyRepository";

export class getRadiographyById {
    constructor(private radiographyRepository: RadiographyRepository) {}

    async execute(idpaciente: number): Promise<Radiography[] | null> {
        return await this.radiographyRepository.getByPatientId(idpaciente);
    }
}