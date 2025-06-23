import { getConnection } from "../db/db";
import { Cita } from "@/domain/entities/reports/datesReports";
import { ReportDatesRepository } from "@/domain/repositories/reports/dates";

export class IReportDateRepository implements ReportDatesRepository {
    private db;

    constructor() {
        this.db = getConnection();
    }

    async getDatesByRange(fechaInicio: string, fechaFin: string): Promise<Cita[]>  {
        const result = await this.db.query(
            `SELECT * FROM reportDate($1, $2)`,
        [fechaInicio, fechaFin]
        );


        return result.rows.map((row) => ({
            fecha: row.fecha,
            nombres: row.nombres,
            apellidos: row.apellidos,
            estado: row.estado,
            descripcion: row.descripcion,
        }));
    }
}

