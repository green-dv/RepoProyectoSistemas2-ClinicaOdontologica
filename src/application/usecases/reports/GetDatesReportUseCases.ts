import { Cita } from "@/domain/entities/reports/datesReports";
import { ReportDatesRepository } from "@/domain/repositories/reports/dates";

export class GetReportDatesUseCase {
    constructor(private repo: ReportDatesRepository) {}

    async execute(fechaInicio: string, fechaFin: string): Promise<Cita[]> {
        const start = new Date(fechaInicio);
        const end = new Date(fechaFin);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error("Las fechas proporcionadas no son válidas.");
        }

        if (start > end) {
            throw new Error("La fecha de inicio no puede ser mayor que la fecha de fin.");
        }

        return this.repo.getDatesByRange(fechaInicio, fechaFin);
    }
}
