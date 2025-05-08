import { Illness } from '@/domain/entities/Illnesses';
import { AntecedenteRepository } from '@/domain/repositories/AntecedentRepository';

export class GetEnfermedadesByAntecedenteIdUseCase {
  constructor(private readonly antecedenteRepository: AntecedenteRepository) {}

  async execute(antecedenteId: number): Promise<Illness[]> {
    return this.antecedenteRepository.getEnfermedadesByAntecedenteId(antecedenteId);
  }
}
