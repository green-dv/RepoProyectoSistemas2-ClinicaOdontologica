import { AntecedenteRepository } from "@/domain/repositories/AntecedentRepository";

export class AddEnfermedadUseCase {
    constructor(private antecedenteRepository: AntecedenteRepository) {}

    async execute(antecedenteId: number, enfermedadId: number): Promise<boolean> {
        return this.antecedenteRepository.addEnfermedad(antecedenteId, enfermedadId);
    }
}

export class RemoveEnfermedadUseCase {
    constructor(private antecedenteRepository: AntecedenteRepository) {}

    async execute(antecedenteId: number, enfermedadId: number): Promise<boolean> {
        return this.antecedenteRepository.removeEnfermedad(antecedenteId, enfermedadId);
    }
}

export class AddHabitoUseCase {
    constructor(private antecedenteRepository: AntecedenteRepository) {}

    async execute(antecedenteId: number, habitoId: number): Promise<boolean> {
        return this.antecedenteRepository.addHabito(antecedenteId, habitoId);
    }
}

export class RemoveHabitoUseCase {
    constructor(private antecedenteRepository: AntecedenteRepository) {}

    async execute(antecedenteId: number, habitoId: number): Promise<boolean> {
        return this.antecedenteRepository.removeHabito(antecedenteId, habitoId);
    }
}

export class AddMedicacionUseCase {
    constructor(private antecedenteRepository: AntecedenteRepository) {}

    async execute(antecedenteId: number, medicacionId: number): Promise<boolean> {
        return this.antecedenteRepository.addMedicacion(antecedenteId, medicacionId);
    }
}

export class RemoveMedicacionUseCase {
    constructor(private antecedenteRepository: AntecedenteRepository) {}

    async execute(antecedenteId: number, medicacionId: number): Promise<boolean> {
        return this.antecedenteRepository.removeMedicacion(antecedenteId, medicacionId);
    }
}

export class AddAtencionMedicaUseCase {
    constructor(private antecedenteRepository: AntecedenteRepository) {}

    async execute(antecedenteId: number, atencionMedicaId: number): Promise<boolean> {
        return this.antecedenteRepository.addAtencionMedica(antecedenteId, atencionMedicaId);
    }
}

export class RemoveAtencionMedicaUseCase {
    constructor(private antecedenteRepository: AntecedenteRepository) {}

    async execute(antecedenteId: number, atencionMedicaId: number): Promise<boolean> {
        return this.antecedenteRepository.removeAtencionMedica(antecedenteId, atencionMedicaId);
    }
}