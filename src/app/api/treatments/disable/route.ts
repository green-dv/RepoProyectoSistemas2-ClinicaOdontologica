import { NextResponse } from "next/server";
import { getConnection } from "@/infrastructure/db/db"; 

// AQUI LO MAS SIMPLE UNA QUERY PARA VER LOS TRATAMEINTOS DESAHABILITADOS Y YA
export async function GET() {
    try {
      const connection = await getConnection();
  
      const query = `
        SELECT 
            idtratamiento,
            nombre,
            descripcion,
            precio
        FROM tratamientos 
        WHERE habilitado = FALSE
      `;
            //   CREATE TABLE tratamientos(
    //     idtratamiento SERIAL PRIMARY KEY,
    //     nombre VARCHAR(50),
    //     descripcion TEXT,
    //     precio NUMERIC(10,2),
    //     habilitado BOOLEAN DEFAULT TRUE
    //   );
      const result = await connection.query(query);
  
      if (result.rows.length === 0) {
        return NextResponse.json({ treatments: [] }, { status: 200 });
      }
  
      return NextResponse.json(result.rows);
    } catch (error) {
      console.error("Error fetching disabled treatments:", error);
      return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
    }
}