import { MedicalAttention } from "@/domain/entities/MedicalAttentions";
export interface IMedicalAttentionRepository {
    fetchAll(query: string, showDisabled: boolean): Promise<MedicalAttention[]>;
    getById(id: number): Promise<MedicalAttention>;
    create(medicalAttention: MedicalAttention): Promise<MedicalAttention>;
    update(id: number, medicalAttention: MedicalAttention): Promise<MedicalAttention>;
    delete(id: number): Promise<void>;
    restore(id: number): Promise<void>;
    deletePermanently(id: number): Promise<void>;
}
