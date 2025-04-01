import { NextRequest, NextResponse } from "next/server";
import {getConnection} from '@/infrastructure/db/db';
//============================================================================
// METODO GET
//============================================================================
export async function GET(request: NextRequest) {
    try {
        // ACA deberia de haber un procedimiento almacenado pero 
        //por el momento estara asii
      const connection = await getConnection();
      const url = new URL(request.url);
      //este searhTerm es para el query de busqueda del debounce o como se 
      // llame 
      const searchTerm = url.searchParams.get('q') || '';
      
      let query = `
        SELECT 
          idtratamiento,
          nombre,
          descripcion,
          precio
        FROM tratamientos 
        WHERE habilitado = TRUE
      `;
      
      const values = [];
      
      // Si hay un searchTerm, lo agregamos a la consulta
        // y a los valores
        // el searchTerm es para filtrar por nombre de tratamiento
      if (searchTerm) {
        query += ` AND nombre ILIKE $1`;
        values.push(`%${searchTerm}%`);
      }
      
      const result = await connection.query(query, values);
      
      return NextResponse.json(result.rows);
    } catch (error) {
      console.error("Error fetching disabled treatments:", error);
      return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
    }
  }
//============================================================================
// METODO POST
//============================================================================
export async function POST(req:NextRequest) {
    try{
        const body = await req.json();
        const connection = await getConnection();
        const {nombre, descripcion, precio,} = body;
        //VALIDACIONESSS
        if(!nombre|| !precio){
            return NextResponse.json(
                { message: "El nombre, precio son requeridos"},
                { status: 400}
            );
        }
// QUERY Y POR N VEZ TIENE QUE SER PROCEDIMIENTO ALMACENADO
        const query = `
            INSERT INTO tratamientos
            (nombre, descripcion, precio) 
            VALUES ($1, $2, $3) RETURNING *`;

        const values = [
            nombre,
            descripcion || null, 
            precio,
        ];

        const result = await connection.query(query,values);
// CON ESTO VEMOS EN CONSOLO EL ENDPOINT DE LA PETICION
        return NextResponse.json(result.rows[0], {status: 200});
    }catch(error){
        console.error("Error al crear tratamientos", error);
        return NextResponse.json(
            {message: "Error al crear tratamientos"},
            {status: 500}
        );
    }
}