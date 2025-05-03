import { Payment } from "../entities/Payments";

export interface CreatePaymentDTO {
    montoesperado: number;
    montopagado: number;
    fechapago: string;
    estado: string;
    enlacecomprobante?: string;
    idplanpago: number;
}
  
export interface UpdatePaymentDTO {
    idpago: number;
    montoesperado?: number;
    montopagado?: number;
    fechapago?: string;
    estado?: string;
    enlacecomprobante?: string;
}
  
export interface PaymentResponse {
    data: Payment[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
}