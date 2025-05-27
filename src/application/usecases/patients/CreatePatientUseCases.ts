import { Patient } from '@/domain/entities/Patient';
import { PatientRepository } from '@/domain/repositories/PatientRepository';

export class CreatePatientUseCase {
    constructor(private patientRepository: PatientRepository) {}

    async execute(patient: Patient): Promise<Patient> {
      return this.patientRepository.createPatient(patient);
    }
}