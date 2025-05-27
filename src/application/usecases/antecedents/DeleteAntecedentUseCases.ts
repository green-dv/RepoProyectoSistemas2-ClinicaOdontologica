import { AntecedenteRepository } from '@/domain/repositories/AntecedentRepository';


export class DeleteAntecedenteUseCase {
    constructor(private antecedenteRepository: AntecedenteRepository) {}

    async execute(id: number): Promise<boolean> {
        return this.antecedenteRepository.deleteAntecedente(id);
    }
}