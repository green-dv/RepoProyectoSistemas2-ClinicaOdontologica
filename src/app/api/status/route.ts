import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/infrastructure/db/db";

export async function GET(request: NextRequest) {
    try{
        const connection = await getConnection();

        let query = 'SELECT * FROM fGetDateStatus();';

        const result = await connection.query(query);
        console.log('API result:', result.rows);
        return NextResponse.json(result.rows);
    }catch (error) {
        return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
    }
}