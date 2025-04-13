import { Patient, PatientDTO } from '@/domain/entities/Patient';
import { patientRepository } from '@/infrastructure/repositories/PatientRepository';

export const fetchPatients = async (query: string, showDisabled: boolean): Promise<Patient[]> => {
  return await patientRepository.fetchAll(query, showDisabled);
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