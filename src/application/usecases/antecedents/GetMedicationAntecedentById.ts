import { Medication } from '@/domain/entities/Medications';
import { AntecedenteRepository  } from '@/domain/repositories/AntecedentRepository';

export class GetMedicacionesByAntecedenteIdUseCase   {
  constructor(private readonly antecedenteRepository: AntecedenteRepository) {}

  async execute(antecedenteId: number): Promise<Medication[]> {
    return this.antecedenteRepository.getMedicacionesByAntecedenteId(antecedenteId);
  }
}
