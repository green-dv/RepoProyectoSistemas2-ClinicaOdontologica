import { Payment } from './Payments';
export interface PaymentPlan {
    idplanpago: number;
    fechacreacion: Date;
    fechalimite: Date;
    montotal: number;
    descripcion: string | null;
    estado: string;
    idconsulta: number | null;
    pagos?: Payment[];
}

export interface PaymentPlanWithPayments extends PaymentPlan {
    pagos: Payment[];
}

