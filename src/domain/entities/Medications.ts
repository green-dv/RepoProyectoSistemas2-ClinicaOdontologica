export interface Medication{
  idmedicacion: number;
  medicacion: string;
  habilitado: boolean;
}

export type MedicationDTO = Omit<Medication, 'idmedicacion' | 'habilitado'>;