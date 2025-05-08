import { MedicalAttention } from '@/domain/entities/MedicalAttentions';
import { AntecedenteRepository  } from '@/domain/repositories/AntecedentRepository';

export class GetAtencionesMedicasByAntecedenteIdUseCase   {
  constructor(private readonly antecedenteRepository: AntecedenteRepository) {}

  async execute(antecedenteId: number): Promise<MedicalAttention[]> {
    return this.antecedenteRepository.getAtencionMedicasByAntecedenteId(antecedenteId);
  }
}
