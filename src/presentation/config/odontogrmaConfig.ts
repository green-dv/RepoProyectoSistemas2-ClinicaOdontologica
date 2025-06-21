
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

export const piezaMap: Record<number, { idpieza: number, descripcion: string, cuadrante: string }> = {
  11: { idpieza: 1, descripcion: 'Incisivo central superior derecho', cuadrante: 'Superior derecho (permanente)' },
  12: { idpieza: 2, descripcion: 'Incisivo lateral superior derecho', cuadrante: 'Superior derecho (permanente)' },
  13: { idpieza: 3, descripcion: 'Canino superior derecho', cuadrante: 'Superior derecho (permanente)' },
  14: { idpieza: 4, descripcion: 'Primer premolar superior derecho', cuadrante: 'Superior derecho (permanente)' },
  15: { idpieza: 5, descripcion: 'Segundo premolar superior derecho', cuadrante: 'Superior derecho (permanente)' },
  16: { idpieza: 6, descripcion: 'Primer molar superior derecho', cuadrante: 'Superior derecho (permanente)' },
  17: { idpieza: 7, descripcion: 'Segundo molar superior derecho', cuadrante: 'Superior derecho (permanente)' },
  18: { idpieza: 8, descripcion: 'Tercer molar superior derecho', cuadrante: 'Superior derecho (permanente)' },
  21: { idpieza: 9, descripcion: 'Incisivo central superior izquierdo', cuadrante: 'Superior izquierdo (permanente)' },
  22: { idpieza: 10, descripcion: 'Incisivo lateral superior izquierdo', cuadrante: 'Superior izquierdo (permanente)' },
  23: { idpieza: 11, descripcion: 'Canino superior izquierdo', cuadrante: 'Superior izquierdo (permanente)' },
  24: { idpieza: 12, descripcion: 'Primer premolar superior izquierdo', cuadrante: 'Superior izquierdo (permanente)' },
  25: { idpieza: 13, descripcion: 'Segundo premolar superior izquierdo', cuadrante: 'Superior izquierdo (permanente)' },
  26: { idpieza: 14, descripcion: 'Primer molar superior izquierdo', cuadrante: 'Superior izquierdo (permanente)' },
  27: { idpieza: 15, descripcion: 'Segundo molar superior izquierdo', cuadrante: 'Superior izquierdo (permanente)' },
  28: { idpieza: 16, descripcion: 'Tercer molar superior izquierdo', cuadrante: 'Superior izquierdo (permanente)' },
  31: { idpieza: 17, descripcion: 'Incisivo central inferior izquierdo', cuadrante: 'Inferior izquierdo (permanente)' },
  32: { idpieza: 18, descripcion: 'Incisivo lateral inferior izquierdo', cuadrante: 'Inferior izquierdo (permanente)' },
  33: { idpieza: 19, descripcion: 'Canino inferior izquierdo', cuadrante: 'Inferior izquierdo (permanente)' },
  34: { idpieza: 20, descripcion: 'Primer premolar inferior izquierdo', cuadrante: 'Inferior izquierdo (permanente)' },
  35: { idpieza: 21, descripcion: 'Segundo premolar inferior izquierdo', cuadrante: 'Inferior izquierdo (permanente)' },
  36: { idpieza: 22, descripcion: 'Primer molar inferior izquierdo', cuadrante: 'Inferior izquierdo (permanente)' },
  37: { idpieza: 23, descripcion: 'Segundo molar inferior izquierdo', cuadrante: 'Inferior izquierdo (permanente)' },
  38: { idpieza: 24, descripcion: 'Tercer molar inferior izquierdo', cuadrante: 'Inferior izquierdo (permanente)' },
  41: { idpieza: 25, descripcion: 'Incisivo central inferior derecho', cuadrante: 'Inferior derecho (permanente)' },
  42: { idpieza: 26, descripcion: 'Incisivo lateral inferior derecho', cuadrante: 'Inferior derecho (permanente)' },
  43: { idpieza: 27, descripcion: 'Canino inferior derecho', cuadrante: 'Inferior derecho (permanente)' },
  44: { idpieza: 28, descripcion: 'Primer premolar inferior derecho', cuadrante: 'Inferior derecho (permanente)' },
  45: { idpieza: 29, descripcion: 'Segundo premolar inferior derecho', cuadrante: 'Inferior derecho (permanente)' },
  46: { idpieza: 30, descripcion: 'Primer molar inferior derecho', cuadrante: 'Inferior derecho (permanente)' },
  47: { idpieza: 31, descripcion: 'Segundo molar inferior derecho', cuadrante: 'Inferior derecho (permanente)' },
  48: { idpieza: 32, descripcion: 'Tercer molar inferior derecho', cuadrante: 'Inferior derecho (permanente)' },
  51: { idpieza: 33, descripcion: 'Incisivo central temporal superior derecho', cuadrante: 'Superior derecho (temporal)' },
  52: { idpieza: 34, descripcion: 'Incisivo lateral temporal superior derecho', cuadrante: 'Superior derecho (temporal)' },
  53: { idpieza: 35, descripcion: 'Canino temporal superior derecho', cuadrante: 'Superior derecho (temporal)' },
  54: { idpieza: 36, descripcion: 'Primer molar temporal superior derecho', cuadrante: 'Superior derecho (temporal)' },
  55: { idpieza: 37, descripcion: 'Segundo molar temporal superior derecho', cuadrante: 'Superior derecho (temporal)' },
  61: { idpieza: 38, descripcion: 'Incisivo central temporal superior izquierdo', cuadrante: 'Superior izquierdo (temporal)' },
  62: { idpieza: 39, descripcion: 'Incisivo lateral temporal superior izquierdo', cuadrante: 'Superior izquierdo (temporal)' },
  63: { idpieza: 40, descripcion: 'Canino temporal superior izquierdo', cuadrante: 'Superior izquierdo (temporal)' },
  64: { idpieza: 41, descripcion: 'Primer molar temporal superior izquierdo', cuadrante: 'Superior izquierdo (temporal)' },
  65: { idpieza: 42, descripcion: 'Segundo molar temporal superior izquierdo', cuadrante: 'Superior izquierdo (temporal)' },
  71: { idpieza: 43, descripcion: 'Incisivo central temporal inferior izquierdo', cuadrante: 'Inferior izquierdo (temporal)' },
  72: { idpieza: 44, descripcion: 'Incisivo lateral temporal inferior izquierdo', cuadrante: 'Inferior izquierdo (temporal)' },
  73: { idpieza: 45, descripcion: 'Canino temporal inferior izquierdo', cuadrante: 'Inferior izquierdo (temporal)' },
  74: { idpieza: 46, descripcion: 'Primer molar temporal inferior izquierdo',cuadrante:  'Inferior izquierdo (temporal)' },
  75: { idpieza: 47, descripcion: 'Segundo molar temporal inferior izquierdo', cuadrante: 'Inferior izquierdo (temporal)' },
  81: { idpieza: 48, descripcion: 'Incisivo central temporal inferior derecho', cuadrante: 'Inferior derecho (temporal)' },
  82: { idpieza: 49, descripcion: 'Incisivo lateral temporal inferior derecho', cuadrante: 'Inferior derecho (temporal)' },
  83: { idpieza: 50, descripcion: 'Canino temporal inferior derecho', cuadrante: 'Inferior derecho (temporal)' },
  84: { idpieza: 51, descripcion: 'Primer molar temporal inferior derecho', cuadrante: 'Inferior derecho (temporal)' },
  85: { idpieza: 52, descripcion: 'Segundo molar temporal inferior derecho', cuadrante: 'Inferior derecho (temporal)' }
};


