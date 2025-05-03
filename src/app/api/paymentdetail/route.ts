import {NextRequest,NextResponse} from 'next/server';
import {getConnection} from "@/infrastructure/db/db";
import { PaymentDetail } from '@/domain/entities/PaymentDetail';
import { PaymentDetailResponse } from '@/application/dtos/detailPayment/PaymentDetailResponse';

export async function GET(request: NextRequest) {
    try {
        const connection = await getConnection();
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') ?? '1');
        const limit = parseInt(url.searchParams.get('limit') ?? '10');
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM getDetailPayment() AS d';
        const values: string[] = [];
        let paramIndex = 1;
        console.log(values);
        
        query += `ORDER BY d.iddetallepago DESC LIMIT $${paramIndex} OFFSET $${paramIndex +1}`;
        values.push(limit.toString(), offset.toString());

        const result = await connection.query(query, values);
        const countQuery = `
            SELECT COUNT(*) FROM getDetailPayment()
        `;
        const countResult = await connection.query(countQuery);
        const totalCount = parseInt(countResult.rows[0].count);

        const response: PaymentDetailResponse = {
            data: result.rows as PaymentDetail[],
            pagination: {
                page,
                limit,
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        };
        return NextResponse.json(response, {status:200});
    } catch (error) {
        console.error("Error al obtener detalle pagos: ", error);
        return NextResponse.json({ message: "Error en el servidor"}, {status: 500});
    }
    
}