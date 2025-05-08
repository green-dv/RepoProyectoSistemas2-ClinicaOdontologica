import { AntecedentResponse } from '@/domain/dto/antecedent';
import { AntecedenteRepository } from '@/domain/repositories/AntecedentRepository';

export class GetAntecedentesByPatientIdUseCase {
    constructor(private antecedenteRepository: AntecedenteRepository) {}

    async execute(patientId: number): Promise<AntecedentResponse> {
        return this.antecedenteRepository.getAntecedentesByPatientId(patientId);
    }
}