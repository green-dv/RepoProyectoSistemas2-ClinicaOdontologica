import { Illness, IllnessDTO } from "@/domain/entities/Illnesses";
import { illnessRepository } from "@/infrastructure/repositories/IllnessRepository";

export const fetchIllnesses = async (query: string, showDisabled: boolean): Promise<Illness[]> => {
  return await illnessRepository.fetchAll(query, showDisabled);
};

export const createIllness = async (illness: IllnessDTO): Promise<Illness> => {
  const trimmedIllness = {
    enfermedad: illness.enfermedad
  };

  if (!trimmedIllness.enfermedad) {
    throw new Error('La descripción es obligatoria');
  }

  return await illnessRepository.create(trimmedIllness);
};

export const updateIllness = async (id: number, illness: IllnessDTO): Promise<Illness> => {
  const trimmedIllness = {
    enfermedad: illness.enfermedad
  };

  if (!trimmedIllness.enfermedad) {
    throw new Error('La descripción es obligatoria');
  }

  return await illnessRepository.update(id, trimmedIllness);
};

export const deleteIllness = async (id: number): Promise<void> => {
  await illnessRepository.delete(id);
};

export const restoreIllness = async (id: number): Promise<void> => {
  await illnessRepository.restore(id);
};

export const deleteIllnessPermanently = async (id: number): Promise<void> => {
  await illnessRepository.deletePermanently(id);
};