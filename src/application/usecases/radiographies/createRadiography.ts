import { Radiography } from "@/domain/entities/Radiography";
import { RadiographyRepository } from "@/infrastructure/repositories/RadiographyRepository";

export class createRadiography {
    constructor(private radiographyRepository: RadiographyRepository) {}

    async execute(radiography: Radiography): Promise<Radiography | null> {
        if(!radiography.enlaceradiografia || radiography.enlaceradiografia === ''){
          return null;
        }
        const newRadiography = await this.radiographyRepository.create(radiography);
        if (!newRadiography) {
            throw new Error(`API >> Error al subir la radiografia`);
        }

        return newRadiography;
    }
}