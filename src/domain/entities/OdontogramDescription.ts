export interface OdontogramDescription{
  idcara: number;
  cara: string;
  codigofdi: number;
  nombrepieza: string;
  iddiagnostico: number;
  enlaceicono: string;
  idodontograma: number;
}

export interface OdontogramDescriptionDTO{
  idcara: number;
  idpieza: number;
  iddiagnostico: number;
  idodontograma: number;
}