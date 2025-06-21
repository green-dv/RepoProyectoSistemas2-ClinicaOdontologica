import { Patient, PatientClinicalRecord } from '@/domain/entities/Patient';
import { PatientResponse } from '@/domain/dto/patient';

export interface PatientRepository {
    getPatients(page: number, limit: number, searchQuery?: string): Promise<PatientResponse>;
    getPatientsDisabled(page: number, limit: number, searchQuery?: string): Promise<PatientResponse>;
    getPatientById(id: number): Promise<Patient | null>;
    createPatient(patient: Patient): Promise<Patient>;
    updatePatient(id: number, patient: Patient): Promise<Patient | null>;
    deletePatient(id: number): Promise<boolean>;
    restorePatient(id: number): Promise<boolean>;
    deletePatientPermanently(id: number): Promise<boolean>;
    getPatientByClinicalRecordID(id: number): Promise<PatientClinicalRecord | null>;
}