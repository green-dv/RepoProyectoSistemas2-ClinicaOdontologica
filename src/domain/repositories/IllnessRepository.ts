import { Illness } from "@/domain/entities/illnesses";
export interface IIllnessRepository {
    fetchAll(query: string, showDisabled: boolean): Promise<Illness[]>;
    getById(id: number): Promise<Illness>;
    create(illnes: Illness): Promise<Illness>;
    update(id: number, illnes: Illness): Promise<Illness>;
    delete(id: number): Promise<void>;
    restore(id: number): Promise<void>;
    deletePermanently(id: number): Promise<void>;
}
