export interface Antecedent {
    idantecedente?: number;
    idpaciente: number;
    embarazo: boolean;
    habilitado: boolean;
    fecha: Date;
}

export interface AntecedenteCompleto extends Antecedent {
    enfermedades: number[];
    habitos: number[];
    medicaciones: number[];
    atencionesMedicas: number[]; 
}