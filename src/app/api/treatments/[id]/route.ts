import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/infrastructure/db/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const connection = await getConnection();
    const { id } = params;
    const query = `
      SELECT 
          idtratamiento,
          nombre,
          descripcion,
          precio
      FROM tratamientos
      WHERE idtratamiento = $1 AND habilitado = TRUE
    `;
    
    const result = await connection.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Treatment not found" }, 
        { status: 404 }
      );
    }

    const treatment = result.rows[0];
    return NextResponse.json({
      idtratamiento: treatment.idtratamiento,
      nombre: treatment.nombre || '',
      descripcion: treatment.descripcion || '',
      precio: parseFloat(treatment.precio) || 0,
    });
  } catch (error) {
    console.error("Error fetching treatment by ID:", error);
    return NextResponse.json(
      { message: "Error en el servidor" }, 
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const connection = await getConnection(); 
    const body = await req.json();

    const {
      nombre,
      descripcion,
      precio
    } = body;

    if (!nombre || !precio) {
      return NextResponse.json(
        { message: "Nombre y precio son campos requeridos" },
        { status: 400 }
      );
    }

    const query = `
      UPDATE tratamientos SET 
      nombre = $1, 
      descripcion = $2, 
      precio = $3
      WHERE idtratamiento = $4 AND habilitado = TRUE
      RETURNING *`;
      
    const values = [
      nombre,
      descripcion,
      precio,
      params.id 
    ];

    const result = await connection.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Treatment not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating treatment:", error);
    return NextResponse.json(
      { message: "Error en el servidor" }, 
      { status: 500 }
    );
  }
}  

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const connection = await getConnection();
    const { id } = params;

    const url = new URL(req.url);
    // ESTO ES PARA SABER SI SE DESEA UN BORRADO FISICO O LOGICO
    const deleteType = url.searchParams.get('type') || 'logical';
    
    let body = {} as { type?: string };
    try {
      body = await req.json();
    } catch {
      // AQUI NO SE QUE PONER PERO SI ESTA VACIO SIGUE FUNCIONANDO CREO
    }

    if (body && body.type === 'restore') {
      const restoreQuery = "UPDATE tratamientos SET habilitado = TRUE WHERE idtratamiento = $1 RETURNING *";
      const result = await connection.query(restoreQuery, [id]);
      
      if (result.rowCount === 0) {
        return NextResponse.json({ message: "Treatment not found" }, { status: 404 });
      }
      
      return NextResponse.json(result.rows[0]);
    }

    if (deleteType === 'logical') {
      const query = "UPDATE tratamientos SET habilitado = FALSE WHERE idtratamiento = $1 RETURNING *";
      const result = await connection.query(query, [id]);
      if (result.rowCount === 0) {
        return NextResponse.json({ message: "Treatment not found" }, { status: 404 });
      }
      return NextResponse.json(result.rows[0]);
    } else if (deleteType === 'physical') {
      const query = "DELETE FROM tratamientos WHERE idtratamiento = $1 RETURNING *";
      const result = await connection.query(query, [id]);

      if (result.rowCount === 0) {
        return NextResponse.json({ message: "Treatment not found" }, { status: 404 });
      }

      return NextResponse.json({ message: "Treatment has been deleted permanently", data: result.rows[0] });
    } else {
      return NextResponse.json(
        { message: "Usar 'logical', 'physical', o 'restore'." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing treatment:", error);
    return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
  }
}
