import { NextResponse, NextRequest } from "next/server";
import {getConnection} from '@/infrastructure/db/db';

export async function GET(request: NextRequest) {
  try{
    const connection = getConnection();
    const url = new URL(request.url);

    const searchTerm = url.searchParams.get('q') || '';
    let query = `SELECT * FROM (SELECT * FROM fGetMedication(TRUE)) as t`;

    const values = [];

    if (searchTerm) {
      query += ` WHERE t.medicacion ILIKE $1`;
      values.push(`%${searchTerm}%`);
    }

    const result = await connection.query(query, values);

    return NextResponse.json(result.rows, {status: 200});
  } catch(error){
    console.error("API ERROR > Error fetching Medication", error);
    return NextResponse.json({message: "Error al obtener medicaciones"}, {status: 500});
  }
}


export async function POST(req: NextRequest){
  try{
    const body = await req.json();
    const connection = getConnection();
    const {medicacion} = body;
    
    if(!medicacion){
      return NextResponse.json(
        {message: "La descripción es requerida"},
        {status: 400}
      )
    }
    if(medicacion.length > 100){
      return NextResponse.json(
        {message: "La descripción debe ser menor a 100 caracteres"},
        {status: 400}
      )
    }

    const query = `SELECT * FROM fAddMedication($1)`;
    const values = [medicacion];

    const result = await connection.query(query, values);
    return NextResponse.json(result.rows[0], {status: 200});
  } catch(error){
    console.error("API ERROR > Error adding medication", error);
    return NextResponse.json({message: "Error al agregar medicacion"}, {status: 500});
  }
}