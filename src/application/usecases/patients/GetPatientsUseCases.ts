import { PatientResponse } from '@/domain/dto/patient';
import { PatientRepository } from '@/domain/repositories/PatientRepository';

export class GetPatientsUseCase {
    constructor(private patientRepository: PatientRepository) {}

    async execute(page: number = 1, limit: number = 10, searchQuery?: string): Promise<PatientResponse> {
        return this.patientRepository.getPatients(page, limit, searchQuery);
    }
    
    async deletePatient(id: number): Promise<boolean> {
        return this.patientRepository.deletePatient(id);
    }
}