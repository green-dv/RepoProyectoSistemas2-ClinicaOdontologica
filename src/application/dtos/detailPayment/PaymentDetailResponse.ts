import { PaymentDetail } from '@/domain/entities/PaymentDetail'; 
import { PaginationMeta } from '@/application/dtos/PaginationMeta';

export interface PaymentDetailResponse {
    data: PaymentDetail[];
    pagination: PaginationMeta;
};
