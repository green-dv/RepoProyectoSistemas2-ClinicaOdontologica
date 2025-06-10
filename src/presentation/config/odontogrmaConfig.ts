import { Diagnosis } from "@/domain/entities/Diagnosis";

e/*xport type EstadoDental = 
  | 'sano' 
  | 'caries' 
  | 'obturado' 
  | 'extraido' 
  | 'endodoncia' 
  | 'corona' 
  | 'implante';

export type CaraDental = 
  | 'vestibular' 
  | 'mesial' 
  | 'lingual' 
  | 'distal' 
  | 'oclusal';

export interface DentalPiece {
  numero: number;
  nombre: string;
  cuadrante: number;
  caras: Record<CaraDental, EstadoDental>;
}*/

export interface CaraDiagnostico {
  id: number;
  nombre: string;
  diagnostico: Diagnosis;
}

export interface Diente{
  id: number;
  codigofdi: number;
  nombre: string;
  caras: CaraDiagnostico[];
}

export type EstadoCara = 
  | 'sano' 
  | 'caries' 
  | 'obturado' 
  | 'corona'
  | 'extraccion'
  | 'ausente';

export interface CarasEstados{
  vestibular: EstadoCara;
  mesial: EstadoCara;
  lingual: EstadoCara;
  distal: EstadoCara;
  oclusal: EstadoCara;
}

export interface DentalState{
  [numero: number]: CarasEstados;
}

// export const diagnosticoSano: Diagnosis = {
//   iddiagnostico : 0,
//   descripcion: 'sano',
//   enlaceicono : '#fff',
// } 

