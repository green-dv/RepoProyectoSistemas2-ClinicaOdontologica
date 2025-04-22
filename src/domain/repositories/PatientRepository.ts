import { Patient, PatientDTO } from '@/domain/entities/Patient';

export interface IPatientRepository {
    fetchAll(query: string, showDisabled: boolean): Promise<Patient[]>;
    getById(id: number): Promise<Patient>;
    create(patient: PatientDTO): Promise<Patient>;
    update(id: number, patient: PatientDTO): Promise<Patient>;
    delete(id: number): Promise<void>;
    restore(id: number): Promise<void>;
    deletePermanently(id: number): Promise<void>;
}