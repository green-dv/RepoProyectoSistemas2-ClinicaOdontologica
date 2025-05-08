import { AntecedentResponse } from '@/domain/dto/antecedent';
import { AntecedenteRepository } from '@/domain/repositories/AntecedentRepository';

export class GetAntecedentesUseCase {
    constructor(private antecedenteRepository: AntecedenteRepository) {}

    async execute(page: number = 1, limit: number = 10): Promise<AntecedentResponse> {
        return this.antecedenteRepository.getAntecedentes(page, limit);
    }
}