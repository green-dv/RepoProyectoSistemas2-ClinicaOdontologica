import { Medication } from "@/domain/entities/Medications";
export interface IMedicationRepository {
    fetchAll(query: string, showDisabled: boolean): Promise<Medication[]>;
    getById(id: number): Promise<Medication>;
    create(medication: Medication): Promise<Medication>;
    update(id: number, medication: Medication): Promise<Medication>;
    delete(id: number): Promise<void>;
    restore(id: number): Promise<void>;
    deletePermanently(id: number): Promise<void>;
}
