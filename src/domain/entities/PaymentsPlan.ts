import { Payment } from './Payments';
export interface PaymentPlan {
    idplanpago: number;
    fechacreacion: Date;
    fechalimite: Date;
    montotal: number;
    descripcion: string;
    estado: string;
    idconsulta: number;
    pagos?: Payment[];
}

export interface PaymentPlanWithPayments extends PaymentPlan {
    pagos: Payment[];
}

