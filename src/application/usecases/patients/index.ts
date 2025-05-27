/*import { Patient, PatientDTO } from '@/domain/entities/Patient';
import { PatientRepository } from '@/domain/repositories/PatientRepository';
import { PatientsResponse } from '@/application/dtos/PatientResponse';

// In application/usecases/patients.ts
export async function fetchPatients(
  query: string = '', 
  showDisabled: boolean = false,
  page: number = 1,
  limit: number = 10
): Promise<PatientsResponse> {
  return PatientRepository.fetchAll(query, showDisabled, page, limit);
}
export const fetchDateFilter = async (query: string, showDisabled: boolean): Promise<Patient[]> => {
  return await PatientRepository.fetchDateFilter(query, showDisabled);
};

export const createPatient = async (patient: PatientDTO): Promise<Patient> => {
    return await PatientRepository.create(patient);
};

export const updatePatient = async (id: number, patient: PatientDTO): Promise<Patient> => {
    return await PatientRepository.update(id, patient);
};

export const deletePatient = async (id: number): Promise<void> => {
  await PatientRepository.delete(id);
};

export const restorePatient = async (id: number): Promise<void> => {
  await PatientRepository.restore(id);
};

export const deletePatientPermanently = async (id: number): Promise<void> => {
  await PatientRepository.deletePermanently(id);
};*/