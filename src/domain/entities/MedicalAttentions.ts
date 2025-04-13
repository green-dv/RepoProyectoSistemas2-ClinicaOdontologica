export interface MedicalAttention{
  idatencionmedica: number;
  atencion: string;
  habilitado: boolean;
}

export type MedicalAttentionDTO = Omit<MedicalAttention, 'idatencionmedica' | 'habilitado'>;