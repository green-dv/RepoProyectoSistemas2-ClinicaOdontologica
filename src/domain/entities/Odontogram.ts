import { OdontogramDescription } from '@/domain/entities/OdontogramDescription'
export interface Odontogram{
  idodontograma: number;
  idpaciente: number;
  paciente: string;
  idconsulta?: number;
  fechacreacion: Date;
  observaciones?: string;
  descripciones: OdontogramDescription[];
}

export interface CreateOdontogram{
  idpaciente: number;
  idconsulta?: number;
  fechacreacion?: Date;
  observaciones?: string;
}