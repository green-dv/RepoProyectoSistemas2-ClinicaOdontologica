import { Payment } from './Payments';
export interface PaymentPlan {
    idplanpago: number;
    fechacreacion: Date;
    fechalimite: Date;
    montotal: number;
    descripcion: string | null;
    estado: string;
    idconsulta: number | null;
    idpaciente: number | null;
    paciente: string | null;
    pagos?: Payment[];
    montopagado?: number;
}

export interface PaymentPlanWithPayments extends PaymentPlan {
    pagos: Payment[];
}

