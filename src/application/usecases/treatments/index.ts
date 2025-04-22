import { Treatment, TreatmentDTO } from '@/domain/entities/Treatments';
import { treatmentRepository } from '@/infrastructure/repositories/TreatmentRepository';

export const fetchTreatments = async (query: string, showDisabled: boolean): Promise<Treatment[]> => {
  return await treatmentRepository.fetchAll(query, showDisabled);
};

export const createTreatment = async (treatment: TreatmentDTO): Promise<Treatment> => {
  const trimmedTreatment = {
    nombre: treatment.nombre.trim(),
    descripcion: treatment.descripcion.trim(),
    precio: treatment.precio,
  };

  if (!trimmedTreatment.nombre) {
    throw new Error('El nombre del tratamiento es obligatorio');
  }

  return await treatmentRepository.create(trimmedTreatment);
};

export const updateTreatment = async (id: number, treatment: TreatmentDTO): Promise<Treatment> => {
  const trimmedTreatment = {
    nombre: treatment.nombre.trim(),
    descripcion: treatment.descripcion.trim(),
    precio: treatment.precio,
  };

  if (!trimmedTreatment.nombre) {
    throw new Error('El nombre del tratamiento es obligatorio');
  }

  return await treatmentRepository.update(id, trimmedTreatment);
};

export const deleteTreatment = async (id: number): Promise<void> => {
  await treatmentRepository.delete(id);
};

export const restoreTreatment = async (id: number): Promise<void> => {
  await treatmentRepository.restore(id);
};

export const deleteTreatmentPermanently = async (id: number): Promise<void> => {
  await treatmentRepository.deletePermanently(id);
};