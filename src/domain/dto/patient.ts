import { Patient } from "../entities/Patient"; 
export interface PatientResponse {
    data: Patient[];
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