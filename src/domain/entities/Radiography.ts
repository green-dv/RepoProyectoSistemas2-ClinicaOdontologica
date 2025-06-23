export interface Radiography {
    idradiografia: number;
    enlaceradiografia: string;
    fechasubida: Date;
    idpaciente: number;
    detecciones: Detection[] | null;
}

export interface Detection{
    iddeteccion: number;
    idproblema: number;
    idradiografia: number;
    confianza: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    problema: string;
};
