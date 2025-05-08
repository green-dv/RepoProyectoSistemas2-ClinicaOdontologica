import { Antecedent } from "../entities/Antecedent";
import { PaginationInfo } from "./patient";
export interface AntecedentResponse {
    data: Antecedent[];
    pagination: PaginationInfo;
}