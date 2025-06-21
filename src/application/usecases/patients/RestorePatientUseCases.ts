import { PatientRepository } from "@/domain/repositories/PatientRepository";

export class RestorePatientUseCase {
    constructor(private patientRepository: PatientRepository) {}

    async execute(id: number): Promise<boolean> {
        return this.patientRepository.restorePatient(id);
    }
}