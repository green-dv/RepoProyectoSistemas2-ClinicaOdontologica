import { PatientClinicalRecord } from '@/domain/entities/Patient';
import { PatientRepository } from '@/domain/repositories/PatientRepository';

export class GetPatientByClinicalRecordIDUseCase {
    constructor(private patientRepository: PatientRepository) {}

    async execute(id: number): Promise<PatientClinicalRecord | null> {
        return this.patientRepository.getPatientByClinicalRecordID(id);
    }
}