import { NextResponse, NextRequest } from "next/server";
import {getConnection} from '@/infrastructure/db/db';

export async function GET(request: NextRequest) {
  try{
    const connection = getConnection();
    const url = new URL(request.url);

    const searchTerm = url.searchParams.get('q') || '';
    let query = `SELECT * FROM (SELECT * FROM fGetHabit(TRUE)) as t`;

    const values = [];

    if (searchTerm) {
      query += ` WHERE t.habito ILIKE $1`;
      values.push(`%${searchTerm}%`);
    }

    const result = await connection.query(query, values);

    return NextResponse.json(result.rows, {status: 200});
  } catch(error){
    console.error("API ERROR > Error fetching Habits", error);
    return NextResponse.json({message: "Error al obtener habitos"}, {status: 500});
  }
}


export async function POST(req: NextRequest){
  try{
    const body = await req.json();
    const connection = getConnection();
    const { habito } = body;
    
    if(!habito){
      return NextResponse.json(
        {message: "La descripción es requerida"},
        {status: 400}
      )
    }
    if(habito.length > 100){
      return NextResponse.json(
        {message: "La descripción debe ser menor a 100 caracteres"},
        {status: 400}
      )
    }

    const query = `SELECT * FROM fAddHabit($1)`;
    const values = [habito];

    const result = await connection.query(query, values);
    return NextResponse.json(result.rows[0], {status: 200});
  } catch(error){
    console.error("API ERROR > Error adding habit", error);
    return NextResponse.json({message: "Error al agregar habito"}, {status: 500});
  }
}