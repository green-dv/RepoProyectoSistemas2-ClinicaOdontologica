import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/infrastructure/db/db";

export async function GET(request: NextRequest){
  try{
    const connection = getConnection();
    const url = new URL(request.url);

    const searchTerm = url.searchParams.get('q') || '';
    let query = `SELECT * FROM (SELECT * FROM fGetMedication(FALSE)) as t`;

    const values = [];

    if (searchTerm) {
      query += ` WHERE t.medicacion ILIKE $1`;
      values.push(`%${searchTerm}%`);
    }

    const result = await connection.query(query, values);

    return NextResponse.json(result.rows, {status: 200});
  } catch(error){
    console.error("API ERROR > Error fetching Medications", error);
    return NextResponse.json({message: "Error al obtener medicaciones"}, {status: 500});
  }
}