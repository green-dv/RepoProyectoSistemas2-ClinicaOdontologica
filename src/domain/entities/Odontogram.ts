import { OdontogramDescription } from '@/domain/entities/OdontogramDescription'
export interface Odontogram{
  idodontograma: number;
  idpaciente: number;
  paciente: string;
  idconsulta: number | null;
  fechacreacion: Date;
  observaciones?: string;
  descripciones: OdontogramDescription[];
}

export interface CreateOdontogram{
  idpaciente: number;
  idconsulta: number | null;
  fechacreacion?: Date;
  observaciones?: string;
}