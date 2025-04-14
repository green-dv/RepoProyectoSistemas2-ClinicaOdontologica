export interface PaymentDetail {
    iddetallepago: number;
    monto: number;
    fecha: string;
    enlacedetalle: string;
    habilitado: boolean;
    idconsulta: number;
}

export type PaymentDetailDTO = Omit<PaymentDetail, 'iddetallepago' | 'habilitado'>;