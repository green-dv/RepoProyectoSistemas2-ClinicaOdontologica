import { NextResponse, NextRequest } from "next/server";
import {getConnection} from '@/infrastructure/db/db';

export async function GET(request: NextRequest) {
  try{
    const connection = getConnection();
    const url = new URL(request.url);

    const searchTerm = url.searchParams.get('q') || '';
    let query = `SELECT * FROM (SELECT * FROM fGetIllnesses(TRUE)) as t`;

    const values = [];

    if (searchTerm) {
      query += ` WHERE t.enfermedad ILIKE $1`;
      values.push(`%${searchTerm}%`);
    }

    const result = await connection.query(query, values);

    return NextResponse.json(result.rows, {status: 200});
  } catch(error){
    console.error("API ERROR > Error fetching Illnesses", error);
    return NextResponse.json({message: "Error al obtener enfermedades"}, {status: 500});
  }
}


export async function POST(req: NextRequest){
  try{
    const body = await req.json();
    const connection = getConnection();
    const {enfermedad} = body;
    
    if(!enfermedad){
      return NextResponse.json(
        {message: "La descripción es requerida"},
        {status: 400}
      )
    }
    if(enfermedad.length > 100){
      return NextResponse.json(
        {message: "La descripción debe ser menor a 100 caracteres"},
        {status: 400}
      )
    }

    const query = `SELECT * FROM fAddIllnesss($1)`;
    const values = [enfermedad];

    const result = await connection.query(query, values);
    return NextResponse.json(result.rows[0], {status: 200});
  } catch(error){
    console.error("API ERROR > Error adding illness", error);
    return NextResponse.json({message: "Error al agregar enfermedad"}, {status: 500});
  }
}