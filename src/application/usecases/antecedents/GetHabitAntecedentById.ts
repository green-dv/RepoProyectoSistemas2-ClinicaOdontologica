import { Habit } from '@/domain/entities/Habits';
import { AntecedenteRepository  } from '@/domain/repositories/AntecedentRepository';

export class GetHabitosByAntecedenteIdUseCase  {
  constructor(private readonly antecedenteRepository: AntecedenteRepository) {}

  async execute(antecedenteId: number): Promise<Habit[]> {
    return this.antecedenteRepository.getHabitosByAntecedenteId(antecedenteId);
  }
}
