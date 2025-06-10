
export interface Cara{
  idcara: number;
  nombrecara: string
  iddiagnostico: number;
  descripciondiagnostico: string;
  colorDiagnostico: string;
}

export interface DentalPiece {
  numero: number;
  nombre: string;
  cuadrante: number;
  caras: Cara[];
}


