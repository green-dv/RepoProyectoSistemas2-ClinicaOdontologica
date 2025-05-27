import { getConnection } from "../db/db";
import { PaymentPlanByPatientReport } from "@/domain/entities/reports/paymentsbypatient";
import { IReportPaymentPlanByPatient } from "@/domain/repositories/reports/paymentByPatientRepository";

export class ReportPaymentPlanByPatient implements IReportPaymentPlanByPatient {
    private db;

    constructor() {
        this.db = getConnection();
    }

    async getPaymentPlansByPatientId(patientId: number): Promise<PaymentPlanByPatientReport[]> {
        const query = `
            SELECT * from reportpaymentsbypatient($1)
        `;

        const result = await this.db.query(query, [patientId]);
        return result.rows as PaymentPlanByPatientReport[];
    }
}

