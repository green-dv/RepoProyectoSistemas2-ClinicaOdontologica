import { AntecedenteCompleto, Antecedent } from '@/domain/entities/Antecedent';
import { AntecedenteRepository } from '@/domain/repositories/AntecedentRepository';
export class CreateAntecedenteUseCase {
    constructor(private antecedenteRepository: AntecedenteRepository) {}

    async execute(antecedente: AntecedenteCompleto): Promise<Antecedent> {
        return this.antecedenteRepository.createAntecedente(antecedente);
    }
}