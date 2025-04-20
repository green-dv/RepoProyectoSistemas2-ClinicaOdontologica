import { MedicalAttention, MedicalAttentionDTO } from "@/domain/entities/MedicalAttentions";
import { medicalAttentionRepository } from "@/infrastructure/repositories/MedicalAttentionRepository";

export const fetchMedicalAttentions = async (query: string, showDisabled: boolean): Promise<MedicalAttention[]> => {
  return await medicalAttentionRepository.fetchAll(query, showDisabled);
};

export const createMedicalAttention = async (medicalAttention: MedicalAttentionDTO): Promise<MedicalAttention> => {
  const trimmedMedicalAttention = {
    atencion: medicalAttention.atencion
  };

  if (!trimmedMedicalAttention.atencion) {
    throw new Error('La descripción es obligatoria');
  }

  return await medicalAttentionRepository.create(trimmedMedicalAttention);
};

export const updateMedicalAttention = async (id: number, medicalAttention: MedicalAttentionDTO): Promise<MedicalAttention> => {
  const trimmedMedicalAttention = {
    atencion: medicalAttention.atencion
  };

  if (!trimmedMedicalAttention.atencion) {
    throw new Error('La descripción es obligatoria');
  }

  return await medicalAttentionRepository.update(id, trimmedMedicalAttention);
};

export const deleteMedicalAttention = async (id: number): Promise<void> => {
  await medicalAttentionRepository.delete(id);
};

export const restoreMedicalAttention = async (id: number): Promise<void> => {
  await medicalAttentionRepository.restore(id);
};

export const deleteMedicalAttentionPermanently = async (id: number): Promise<void> => {
  await medicalAttentionRepository.deletePermanently(id);
};