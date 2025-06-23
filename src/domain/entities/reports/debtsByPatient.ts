export interface debtsByPatient {
    idpaciente: number;
    nombres?: string;
    apellidos?: string;
    total_esperado: number | string;
    total_pagado: number | string;
    deuda: number | string;
}