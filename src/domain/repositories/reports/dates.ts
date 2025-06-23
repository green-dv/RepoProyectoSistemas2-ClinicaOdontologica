import { Cita } from "@/domain/entities/reports/datesReports";

export interface ReportDatesRepository {
    getDatesByRange(fechaInicio: string, fechaFin: string): Promise<Cita[]>;
}
