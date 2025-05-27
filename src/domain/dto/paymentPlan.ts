import { PaymentPlan } from "../entities/PaymentsPlan";
export interface CreatePaymentPlanDTO {
    fechacreacion: string;
    fechalimite: string;
    montotal: number;
    descripcion: string | null;
    estado: string;
    idconsulta: number | null;
    idpaciente: number | null;
    pagos: {
      montoesperado: number | null;
      montopagado: number | null;
      fechapago: string | null;
      estado: string;
      enlacecomprobante: string | null;
      idplanpago: number;
    }[] | [];
}
  
export interface UpdatePaymentPlanDTO {
    idplanpago: number;
    fechacreacion: string;
    fechalimite: string;
    montotal: number;
    descripcion: string | null;
    estado: string;
    idconsulta: number | null;
    idpaciente: number | null;
    pagos: {
      idpago: number;
      montoesperado: number | null;
      montopagado: number | null;
      fechapago: string | null;
      estado: string;
      enlacecomprobante: string | null;
      idplanpago: number;
    }[] | [];
}
  
export interface PaymentPlanResponse {
    data: PaymentPlan[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
}