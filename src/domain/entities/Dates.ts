import { DateTime } from "next-auth/providers/kakao";

export interface Date {
    idcita: number;
    idconsulta: number | null;
    fecha: DateTime;
    fechacita: DateTime;
    idpaciente: number;
    paciente: string;
    fechaconsulta: DateTime | null;
    descripcion: string;
    estado: string;
    duracionaprox: number;
    idestado: number;
}
export interface DateDTO{
    fecha: DateTime;
    idpaciente: number | null;
    idconsulta: number | null;
    descripcion: string;
    idestadocita: number;
    fechacita: DateTime;
    duracionaprox: number;
}
