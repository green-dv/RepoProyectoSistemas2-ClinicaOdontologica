export interface Illness{
  idenfermedad: number;
  enfermedad: string;
  habilitado: boolean;
}

export type IllnessDTO = Omit<Illness, 'idenfermedad' | 'habilitado'>;