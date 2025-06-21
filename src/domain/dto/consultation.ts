import { Consultation } from "../entities/Consultations";
import { Patient } from "../entities/Patient";
import { User } from "../entities/user";
import { Treatment } from "../entities/Treatments";
export interface CreateConsultationDTO {
    fecha: Date | string;
    presupuesto: number;
    idpaciente: number;
    idusuario: number;
    estadopago?: boolean;
    tratamientos?: number[];
}

export interface UpdateConsultationDTO {
    fecha?: Date|string;
    presupuesto?: number;
    estadopago?: boolean;
    tratamientos?: number[];
}

export interface ConsultationByPatientDTO {
    idconsulta: number;
    fecha: Date;
    presupuesto: number;
    estadopago: boolean;
    habilitado: boolean;
    paciente:{
        idpaciente: number;
        nombres: string;
        apellidos: string;
        telefonopersonal: string;
    };
    usuario: {
        idusuario: number;
        nombre: string;
        apellido: string;
    };
}

export interface ConsultationDetail {
    idconsulta: number;
    fecha: Date;
    presupuesto: number;
    estadopago: boolean;
    habilitado: boolean;
    paciente: Patient;
    usuario: User;
    tratamientos: Treatment[];
}


// Para la paginacion de las consultas
export interface ConsultationResponse {
    data: Consultation[];
    pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}
  
export interface PaginationInfo {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}
