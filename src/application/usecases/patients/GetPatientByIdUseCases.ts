import { Patient } from '@/domain/entities/Patient';
import { PatientRepository } from '@/domain/repositories/PatientRepository';

export class GetPatientByIdUseCase {
    constructor(private patientRepository: PatientRepository) {}

    async execute(id: number): Promise<Patient | null> {
        return this.patientRepository.getPatientById(id);
    }
}