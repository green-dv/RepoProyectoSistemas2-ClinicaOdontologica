import { Status } from "@/domain/entities/Status";
export interface IStatusRepository {
    fetchAll(): Promise<Status[]>;
    getById(id: number): Promise<Status>;
}
