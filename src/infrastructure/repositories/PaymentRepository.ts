import { Payment } from '../../domain/entities/Payments';
import { IPaymentRepository} from '@/domain/repositories/PaymentRepository';
import { getConnection } from '../db/db';

export class PaymentRepository implements IPaymentRepository {
    private readonly db;
    constructor() {
        this.db = getConnection();
    }
    async create(payment: Omit<Payment, 'idpago'>): Promise<Payment> {
        // Make sure we have a valid planpago ID
        if (!payment.idplanpago) {
            throw new Error('Se requiere un ID de plan de pago válido para crear un pago');
        }

        const query = `
            INSERT INTO pagos (montoesperado, montopagado, fechapago, estado, enlacecomprobante, idplanpago)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        
        const values = [
            payment.montoesperado,
            payment.montopagado,
            payment.fechapago,
            payment.estado,
            payment.enlacecomprobante,
            payment.idplanpago
        ];

        const result = await this.db.query(query, values);
        return result.rows[0] as Payment;
    }

    async update(payment: Payment): Promise<Payment> {
        if (!payment.idpago) {
            throw new Error('ID de pago es requerido para actualización');
        }
        
        const { idpago, ...updateData } = payment;
        
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
            throw new Error('No hay datos para actualizar');
        }
        
        const query = `
            UPDATE pagos
            SET ${setFields.join(', ')}
            WHERE idpago = $${paramCounter}
            RETURNING *
        `;
        
        values.push(idpago);
        
        const result = await this.db.query(query, values);
        return result.rows[0] as Payment;
    }

    async delete(id: number): Promise<Payment>{
        const query = `DELETE FROM pagos WHERE idplanpago = $1 AND estado != 'completado' RETURNING *`;
        const result = await this.db.query(query, [id]);
        return result.rows[0] as Payment;
    }


    async getById(id: number): Promise<Payment | null> {
        const query = 'SELECT * FROM pagos WHERE idpago = $1';
        const result = await this.db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return result.rows[0] as Payment;
    }

    async getByPlanId(planId: number): Promise<Payment[]> {
        const query = 'SELECT * FROM pagos WHERE idplanpago = $1 ORDER BY fechapago';
        const result = await this.db.query(query, [planId]);
        return result.rows as Payment[];
    }

    async getPaginated(page: number, limit: number): Promise<{ data: Payment[]; totalCount: number }> {
        const offset = (page - 1) * limit;
        
        const countQuery = 'SELECT COUNT(*) FROM pagos';
        const countResult = await this.db.query(countQuery);
        const totalCount = parseInt(countResult.rows[0].count, 10);
        
        const dataQuery = `
            SELECT * FROM pagos
            ORDER BY idpago DESC
            LIMIT $1 OFFSET $2
        `;
        
        const dataResult = await this.db.query(dataQuery, [limit, offset]);
        
        return {
            data: dataResult.rows as Payment[],
            totalCount
        };
    }
}