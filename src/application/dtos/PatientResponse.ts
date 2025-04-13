import { Patient } from '@/domain/entities/Patient';
import { PaginationMeta } from './PaginationMeta';

export interface PatientsResponse {
    data: Patient[];
    pagination: PaginationMeta;
};
