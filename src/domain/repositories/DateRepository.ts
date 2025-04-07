import { Date, DateDTO } from "@/domain/entities/Dates";
export interface IDatesRepository {
    fetchAll(query: string, showDisabled: boolean): Promise<Date[]>;
    getById(id: number): Promise<Date>;
    create(date: DateDTO): Promise<Date>;
    update(id: number, date: DateDTO): Promise<Date>;
    updateStatus(idDate: number, idStatus: number): Promise<Date>;
    delete(id: number): Promise<void>;
    restore(id: number): Promise<void>;
    deletePermanently(id: number): Promise<void>;
}
