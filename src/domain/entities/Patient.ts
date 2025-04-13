export interface Patient {
    idpaciente: number;
    nombres: string;
    apellidos: string;
    direccion: string;
    telefonodomicilio: string | null;
    telefonopersonal: string;
    lugarnacimiento: string | null;
    fechanacimiento: string;
    sexo: boolean;
    estadocivil: string;
    ocupacion: string;
    aseguradora: string | null;
    habilitado: boolean;
}

export type PatientDTO = Omit<Patient, 'idpaciente' | 'habilitado'>;