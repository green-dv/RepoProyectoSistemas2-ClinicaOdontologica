import { PatientRepository } from '@/domain/repositories/PatientRepository';

export class DeletePatientUseCase {
    constructor(private patientRepository: PatientRepository) {}

    async execute(id: number): Promise<boolean> {
        return this.patientRepository.deletePatient(id);
    }
}