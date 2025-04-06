import { DateTime } from "next-auth/providers/kakao";

/*
export interface Dates {
    id: number;
    fecha: DateTime;
    idpaciente: number;
    idconsulta: number;
    descripcion: string;
    idestadocita: number;
    fechacitacion: DateTime;
}
*/

export interface Date {
    idcita: number;
    idconsulta?: number;
    fecha: DateTime;
    fechacita: DateTime;
    idpaciente: number;
    paciente: string;
    fechaconsulta?: DateTime;
    descripcion: string;
    estadocita: string;
    duracionaprox: number;
}
export interface DateDTO{
    fecha: DateTime;
    idpaciente: number;
    idconsulta: number;
    descripcion: string;
    idestadocita: number;
    fechacita: DateTime;
    duracionAprox: number;
}
