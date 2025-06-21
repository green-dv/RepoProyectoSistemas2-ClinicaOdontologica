import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/infrastructure/db/db";

export async function GET() {
    try{
        const connection = await getConnection();

        const query = 'SELECT * FROM fGetDateStatus();';

        const result = await connection.query(query);
        return NextResponse.json(result.rows);
    }catch (error) {
        return NextResponse.json({ message: "Error del servidor", error }, { status: 500 });
    }
}