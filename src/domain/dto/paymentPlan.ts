import { PaymentPlan } from "../entities/PaymentsPlan";
export interface CreatePaymentPlanDTO {
    fechacreacion: string;
    fechalimite: string;
    montotal: number;
    descripcion: string;
    estado: string;
    idconsulta: number;
    installments: {
      montoesperado: number;
      fechapago: string;
    }[];
}
  
export interface UpdatePaymentPlanDTO {
    idplanpago: number;
    fechacreacion?: string;
    fechalimite?: string;
    montotal?: number;
    descripcion?: string;
    estado?: string;
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