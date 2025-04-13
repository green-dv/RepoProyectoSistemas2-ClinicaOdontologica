import { Medication, MedicationDTO } from "@/domain/entities/Medications";
import { medicationRepository } from "@/infrastructure/repositories/MedicationRepository";

export const fetchMedications = async (query: string, showDisabled: boolean): Promise<Medication[]> => {
  return await medicationRepository.fetchAll(query, showDisabled);
};

export const createMedications = async (medication: MedicationDTO): Promise<Medication> => {
  const trimmedMedication = {
    medicacion: medication.medicacion
  };

  if (!trimmedMedication.medicacion) {
    throw new Error('La descripción es obligatoria');
  }

  return await medicationRepository.create(trimmedMedication);
};

export const updateMedications = async (id: number, medication: MedicationDTO): Promise<Medication> => {
  const trimmedMedication = {
    medicacion: medication.medicacion
  };

  if (!trimmedMedication.medicacion) {
    throw new Error('La descripción es obligatoria');
  }

  return await medicationRepository.update(id, trimmedMedication);
};

export const deleteMedication = async (id: number): Promise<void> => {
  await medicationRepository.delete(id);
};

export const restoreMedications = async (id: number): Promise<void> => {
  await medicationRepository.restore(id);
};

export const deleteMedicationPermanently = async (id: number): Promise<void> => {
  await medicationRepository.deletePermanently(id);
};