import { getConnection } from "../db/db";
import { debtsByPatient } from "@/domain/entities/reports/debtsByPatient";
import { ReportDebtsByPatientRepository } from "@/domain/repositories/reports/debtsByPatientRepository";

export class IReportDebtsByPatientRepository implements ReportDebtsByPatientRepository {
    private db;

    constructor() {
        this.db = getConnection();
    }

    async getDebtsByPatient(patientId: number | null): Promise<debtsByPatient[]>  {
        const result = await this.db.query(
            `SELECT * FROM reportDebtsPerPlan($1)`,
        [patientId]
        ); 


        return result.rows.map((row) => ({
            idpaciente: row.idpaciente,
            nombres: row.nombres,
            apellidos: row.apellidos,
            total_esperado: row.total_esperado,
            total_pagado: row.total_pagado,
            deuda: row.deuda

        }));
    }
}

