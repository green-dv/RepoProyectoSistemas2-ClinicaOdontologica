import { Consultation } from "../entities/Consultations";
import { CreateConsultationDTO, ConsultationDetail, ConsultationByPatientDTO, UpdateConsultationDTO, ConsultationResponse } from "../dto/consultation";
import { Treatment } from "../entities/Treatments";

export interface ConsultationRepository {
    createConsultation(consultation: CreateConsultationDTO): Promise<Consultation>;
    findbyIdConsultation(id: number): Promise<Consultation | null>;
    findbyIdConsultationDetail(id: number): Promise<ConsultationDetail | null>;
    findConsultationsByPatientId(patientId: number): Promise<ConsultationByPatientDTO[]>;
    updateConsultation(id: number, updateData: UpdateConsultationDTO): Promise<Consultation | null>;
    deleteConsultation(id: number): Promise<boolean>;
    addTreatments(idconsulta: number, tratamientos: number[]): Promise<void>;
    removeTreatments(idconsulta: number, tratamientos: number[]): Promise<void>;
    getTreatmentsByConsultationId(idconsulta: number): Promise<Treatment[]>;
    getPaginatedConsultations(page: number, limit: number, searchQuery?: string): Promise<ConsultationResponse>;
    getConsultationsDisabled(page: number, limit: number, searchQuery?: string): Promise<ConsultationResponse>;
}