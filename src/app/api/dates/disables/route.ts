import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/infrastructure/db/db";

export async function GET(request: NextRequest) {
    try{
        const connection = await getConnection();
        const url = new URL(request.url);

        const searchTerm = url.searchParams.get('q') || '';
        let query = 'SELECT * FROM fGetDisabledDates();';

        /*
        const values = [];
        
        if(searchTerm) {
            query += ` AND nombre ILIKE $1`;
            values.push(`%${searchTerm}%`);
        }
        */
        const result = await connection.query(query/*, values*/);
        
        return NextResponse.json(result.rows);
    }catch (error) {
        return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
    }
}
