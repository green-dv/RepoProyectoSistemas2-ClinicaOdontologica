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
            INSERT INTO planpagos (fechacreacion, fechalimite, montotal, descripcion, estado, idconsulta)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        
        const values = [
            paymentPlan.fechacreacion,
            paymentPlan.fechalimite,
            paymentPlan.montotal,
            paymentPlan.descripcion,
            paymentPlan.estado,
            paymentPlan.idconsulta
        ];

        const result = await this.db.query(query, values);
        return result.rows[0] as PaymentPlan;
    }

    async update(paymentPlan: PaymentPlan): Promise<PaymentPlan> {
        if (!paymentPlan.idplanpago) {
            throw new Error('ID de plan de pago es requerido para su actualizacion >;');
        }
        
        const { idplanpago, pagos, ...updateData } = paymentPlan;
        
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
        const query = 'SELECT * FROM planpagos WHERE idplanpago = $1';
        const result = await this.db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        const paymentPlan = result.rows[0] as PaymentPlan;
        return paymentPlan;
    }

    async getPaginated(page: number, limit: number): Promise<{
        data: PaymentPlan[];
        totalCount: number;
    }> {
        const offset = (page - 1) * limit;
        
        const countQuery = 'SELECT COUNT(*) FROM planpagos';
        const countResult = await this.db.query(countQuery);
        const totalCount = parseInt(countResult.rows[0].count, 10);
        
        const dataQuery = `
            SELECT * FROM planpagos
            ORDER BY idplanpago ASC
            LIMIT $1 OFFSET $2
        `;
        
        const dataResult = await this.db.query(dataQuery, [limit, offset]);
        const plans = dataResult.rows as PaymentPlan[];
        
        return {
            data: plans,
            totalCount
        };
    }

    async getByConsultaId(consultaId: number): Promise<PaymentPlan[]> {
        const query = 'SELECT * FROM planpagos WHERE idconsulta = $1 ORDER BY fechacreacion DESC';
        const result = await this.db.query(query, [consultaId]);
        return result.rows as PaymentPlan[];
    }

    async getPlanWithPayments(id: number): Promise<(PaymentPlan & { pagos: Payment[] }) | null> {
        const paymentPlan = await this.getById(id);
        if (!paymentPlan) return null;

        const payments = await this.paymentRepo.getByPlanId(id);
        return { ...paymentPlan, pagos: payments };
    }
}