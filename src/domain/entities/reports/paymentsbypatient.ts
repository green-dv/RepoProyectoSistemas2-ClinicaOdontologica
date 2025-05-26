export interface PaymentPlanByPatientReport {
    idplanpago: number;
    descripcion: string;
    montotal: number;
    total_pagado: number;
    total_pendiente: number;
    cuotas_incompletas: number;
    porcentaje_pago: number;
}
