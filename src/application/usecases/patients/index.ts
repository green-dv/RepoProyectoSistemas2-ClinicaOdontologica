import { Patient, PatientDTO } from '@/domain/entities/Patient';
import { patientRepository } from '@/infrastructure/repositories/PatientRepository';
import { PatientsResponse } from '@/application/dtos/PatientResponse';

// In application/usecases/patients.ts
export async function fetchPatients(
  query: string = '', 
  showDisabled: boolean = false,
  page: number = 1,
  limit: number = 10
): Promise<PatientsResponse> {
  return patientRepository.fetchAll(query, showDisabled, page, limit);
}

export const createPatient = async (patient: PatientDTO): Promise<Patient> => {
    return await patientRepository.create(patient);
};

export const updatePatient = async (id: number, patient: PatientDTO): Promise<Patient> => {
    return await patientRepository.update(id, patient);
};

export const deletePatient = async (id: number): Promise<void> => {
  await patientRepository.delete(id);
};

export const restorePatient = async (id: number): Promise<void> => {
  await patientRepository.restore(id);
};

export const deletePatientPermanently = async (id: number): Promise<void> => {
  await patientRepository.deletePermanently(id);
};