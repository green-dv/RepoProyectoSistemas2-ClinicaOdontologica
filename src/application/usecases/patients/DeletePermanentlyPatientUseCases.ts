import { PatientRepository } from "@/domain/repositories/PatientRepository";

export class DeletePermanentlyPatientUseCase {
    constructor(private patientRepository: PatientRepository) {}

    async execute(id: number): Promise<boolean> {
        return this.patientRepository.deletePatientPermanently(id);
    }
}
