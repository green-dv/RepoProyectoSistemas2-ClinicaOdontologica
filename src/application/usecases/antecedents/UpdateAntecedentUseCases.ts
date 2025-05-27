import { Antecedent, AntecedenteCompleto } from '@/domain/entities/Antecedent';
import { AntecedenteRepository } from '@/domain/repositories/AntecedentRepository';

export class UpdateAntecedenteUseCase {
    constructor(private antecedenteRepository: AntecedenteRepository) {}

    async execute(id: number, antecedente: AntecedenteCompleto): Promise<Antecedent | null> {
        return this.antecedenteRepository.updateAntecedente(id, antecedente);
    }
}