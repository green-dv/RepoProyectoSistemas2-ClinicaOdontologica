import { Treatment, TreatmentDTO } from "@/domain/entities/Treatments";

export interface ITreatmentRepository {
    fetchAll(query: string, showDisabled: boolean): Promise<Treatment[]>;
    getById(id: number): Promise<Treatment>;
    create(treatment: TreatmentDTO): Promise<Treatment>;
    update(id: number, treatment: TreatmentDTO): Promise<Treatment>;
    delete(id: number): Promise<void>;
    restore(id: number): Promise<void>;
    deletePermanently(id: number): Promise<void>;
  }