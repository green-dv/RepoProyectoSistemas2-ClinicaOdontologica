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

// Interface para un antecedente individual
export interface ClinicalAntecedent {
    idantecedente: number;      
    tiene_embarazo: boolean;
    fecha_antecedente: string;
    enfermedades: string;
    atenciones_medicas: string;
    medicaciones: string;
    habitos: string;
}
// Interface para el registro clínico del paciente
export interface PatientClinicalRecord {
    idpaciente: number; 
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
    // Lista de antecedentes
    antecedentes: ClinicalAntecedent[];
}


// interface just only for print clinical history record
export interface PatientClinicalRecordRow {
    idpaciente: number; 
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
    idantecedente: number;      
    tiene_embarazo: boolean;
    fecha_antecedente: string;
    enfermedades: string;
    atenciones_medicas: string;
    medicaciones: string;
    habitos: string;
}