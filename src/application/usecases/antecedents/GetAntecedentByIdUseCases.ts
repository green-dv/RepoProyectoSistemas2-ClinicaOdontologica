import { AntecedenteCompleto } from '@/domain/entities/Antecedent';
import { AntecedenteRepository } from '@/domain/repositories/AntecedentRepository';

export class GetAntecedenteByIdUseCase {
    constructor(private antecedenteRepository: AntecedenteRepository) {}

    async execute(id: number): Promise<AntecedenteCompleto | null> {
        return this.antecedenteRepository.getAntecedenteById(id);
    }
}