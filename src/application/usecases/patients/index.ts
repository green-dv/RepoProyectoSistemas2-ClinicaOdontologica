import { Patient } from '@/domain/entities/Patient';
import { PatientRepository } from '@/domain/repositories/PatientRepository';
import { PatientsResponse } from '@/application/dtos/PatientResponse';

export async function getPatients(
  query: string = '', 
  showDisabled: boolean = false,
  page: number = 1,
  limit: number = 10
): Promise<PatientsResponse> {
  return PatientRepository.getPatients(query, showDisabled, page, limit);
}

export const fetchDateFilter = async (query: string, showDisabled: boolean): Promise<Patient[]> => {
  return await patientRepository.fetchDateFilter(query, showDisabled);
};

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