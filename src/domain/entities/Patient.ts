export interface Patient {
    idpaciente?: number;
    nombres: string;
    apellidos: string;
    direccion: string;
    telefonodomicilio: string;
    telefonopersonal: string;
    lugarnacimiento: string;
    fechanacimiento: string;
    sexo: boolean;
    estadocivil: string;
    ocupacion: string;
    aseguradora: string;
    habilitado: boolean;
}

export type PatientDTO = Omit<Patient, 'idpaciente' | 'habilitado'>;