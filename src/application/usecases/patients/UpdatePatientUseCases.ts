import { Patient } from '@/domain/entities/Patient';
import { PatientRepository } from '@/domain/repositories/PatientRepository';

export class UpdatePatientUseCase {
    constructor(private patientRepository: PatientRepository) {}

    async execute(id: number, patient: Patient): Promise<Patient | null> {
        return this.patientRepository.updatePatient(id, patient);
    }
}