import { PaymentPlan } from '../../domain/entities/PaymentsPlan';
import { IPaymentPlanRepository } from '../../domain/repositories/PaymentPlanRepository';
import { getConnection } from '../db/db';
import { PaymentRepository } from './PaymentRepository';
import { Payment } from '@/domain/entities/Payments';

export class PaymentPlanRepository implements IPaymentPlanRepository {
    private readonly db;
    private readonly paymentRepo: PaymentRepository;

    constructor() {
        this.db = getConnection();
        this.paymentRepo = new PaymentRepository();
    }

    async create(paymentPlan: Omit<PaymentPlan, 'idplanpago'>): Promise<PaymentPlan> {
        const query = `
            INSERT INTO planpagos (fechacreacion, fechalimite, montotal, descripcion, estado, idconsulta, idpaciente)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        
        const values = [
            paymentPlan.fechacreacion,
            paymentPlan.fechalimite,
            paymentPlan.montotal,
            paymentPlan.descripcion,
            paymentPlan.estado,
            paymentPlan.idconsulta,
            paymentPlan.idpaciente
        ];

        const result = await this.db.query(query, values);
        return result.rows[0] as PaymentPlan;
    }
    async getPaymentsPlanByConsultationId(idConsulta: number): Promise<(PaymentPlan & { pagos: Payment[] }) | null> {
        const query = `
            SELECT 
            pp.idplanpago, 
            pp.fechacreacion, 
            pp.fechalimite, 
            pp.montotal, 
            pp.descripcion, 
            pp.estado, 
            pp.idpaciente,
            (pt.nombres || ' ' || pt.apellidos) as paciente
            FROM planpagos pp
            JOIN pacientes pt ON pt.idpaciente = pp.idpaciente
            WHERE pp.idconsulta = $1
            LIMIT 1
        `;

        const result = await this.db.query(query, [idConsulta]);

        if (result.rows.length === 0) {
            return null;
        }

        const paymentPlan = result.rows[0] as PaymentPlan;

        // Usa tu función reutilizable
        return this.getPlanWithPayments(paymentPlan.idplanpago);
        }

    async update(paymentPlan: PaymentPlan): Promise<PaymentPlan> {
        if (!paymentPlan.idplanpago) {
            throw new Error('ID de plan de pago es requerido para su actualizacion >;');
        }
        
        const { idplanpago, pagos, montopagado, paciente, ...updateData } = paymentPlan;
        
        const setFields: string[] = [];
        const values: (string | number | Date | null)[] = [];
        let paramCounter = 1;
        
        Object.entries(updateData).forEach(([key, value]) => {
            if (value !== undefined) {
                setFields.push(`${key} = $${paramCounter}`);
                values.push(value);
                paramCounter++;
            }
        });
        
        if (setFields.length === 0) {
            throw new Error('No hay datos que se puedna actualizar');
        }
        
        const query = `
            UPDATE planpagos
            SET ${setFields.join(', ')}
            WHERE idplanpago = $${paramCounter}
            RETURNING *
        `;
        
        values.push(idplanpago);
        
        const result = await this.db.query(query, values);
        return result.rows[0] as PaymentPlan;
    }

    async getById(id: number): Promise<PaymentPlan | null> {
        const query = `SELECT 
                pp.idplanpago, 
                pp.fechacreacion, 
                pp.fechalimite, 
                pp.montotal, 
                pp.descripcion, 
                pp.estado, 
                pp.idpaciente,
                (pt.nombres || ' ' || pt.apellidos) as paciente
            FROM planpagos pp
            JOIN pacientes pt ON pt.idpaciente = pp.idpaciente
            WHERE pp.idplanpago = $1`;

        const result = await this.db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        const paymentPlan = result.rows[0] as PaymentPlan;
        return paymentPlan;
    }

    async getPaginated(page: number, limit: number, estado: string | null, fechainicio: string | null, fechafin:string | null): Promise<{
        data: PaymentPlan[];
        totalCount: number;
    }> {
        const offset = (page - 1) * limit;

        const conditions:string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if(estado){
            conditions.push(`pp.estado = $${paramIndex++}`);
            values.push(estado);
        }
        if(fechainicio){
            conditions.push(`pp.fechacreacion >= $${paramIndex++}`);
            values.push(fechainicio);
        }
        if(fechafin){
            conditions.push(`pp.fechacreacion <= $${paramIndex++}`);
            values.push(fechafin);
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const countQuery = `SELECT COUNT(*) FROM planpagos pp ${whereClause}`;
        const countResult = await this.db.query(countQuery, values);
        const totalCount = parseInt(countResult.rows[0].count, 10);

        // IMPORTANTE: copia los valores anteriores para no mezclarlos con LIMIT/OFFSET
        const dataValues = [...values];
        dataValues.push(limit);
        const limitParam = paramIndex++;
        dataValues.push(offset);
        const offsetParam = paramIndex++;

        const dataQuery = `
            SELECT 
                pp.idplanpago, 
                pp.fechacreacion, 
                pp.fechalimite, 
                pp.montotal, 
                pp.descripcion, 
                pp.estado, 
                pp.idpaciente,
                (pt.nombres || ' ' || pt.apellidos) as paciente,
                SUM(p.montopagado) AS montopagado
            FROM planpagos pp
            JOIN pagos p ON pp.idplanpago = p.idplanpago
            LEFT OUTER JOIN pacientes pt ON pt.idpaciente = pp.idpaciente
            ${whereClause}
            GROUP BY 
                pp.idplanpago, 
                pp.fechacreacion, 
                pp.fechalimite, 
                pp.montotal, 
                pp.descripcion, 
                pp.estado,
                pt.nombres,
                pt.apellidos
            ORDER BY pp.fechacreacion DESC
            LIMIT $${limitParam} OFFSET $${offsetParam};
        `;
        const dataResult = await this.db.query(dataQuery, dataValues);
        const plans = dataResult.rows as PaymentPlan[];
        return {
            data: plans,
            totalCount
        };
    }

    async findByConsultationId(): Promise<number> {
        const query = `SELECT MAX(idconsulta) AS max FROM consultas;`;

        const result = await this.db.query(query);
        console.log('imprimiendo resultado de la consulta');
        console.log(result);

        return result.rows[0].max as number;
    }

    async getByConsultaId(consultaId: number): Promise<PaymentPlan[]> {
        const query = 'SELECT * FROM planpagos WHERE idconsulta = $1 ORDER BY fechacreacion DESC';
        const result = await this.db.query(query, [consultaId]);
        return result.rows as PaymentPlan[];
    }

    async getPlanWithPayments(id: number): Promise<(PaymentPlan & { pagos: Payment[] }) | null> {
        const paymentPlan = await this.getById(id);
        console.log(paymentPlan)
        if (!paymentPlan) return null;

        const payments = await this.paymentRepo.getByPlanId(id);
        return { ...paymentPlan, pagos: payments };
    }
}