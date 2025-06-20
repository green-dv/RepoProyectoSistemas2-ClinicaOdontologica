export interface OdontogramDescription{
  idcara: number;
  cara: string;
  idpieza: number;
  codigofdi: number;
  nombrepieza: string;
  iddiagnostico: number;
  diagnostico: string;
  enlaceicono: string;
  idodontograma: number;
}

export interface OdontogramDescriptionDTO{
  idcara: number;
  idpieza: number;
  iddiagnostico: number;
  idodontograma: number;
}