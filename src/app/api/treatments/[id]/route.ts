import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/infrastructure/db/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const connection = await getConnection();
    const { id } = await params;
    const query = `
      SELECT *
      FROM getTreatmentById($1)
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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await getConnection();
    const body = await req.json();

    const { nombre, descripcion, precio } = body;

    if (!nombre || precio === undefined) {
      return NextResponse.json(
        { message: "Nombre y precio son campos requeridos" },
        { status: 400 }
      );
    }

    if (precio < 0) {
      return NextResponse.json(
        { message: "El precio no puede ser menor a 0" },
        { status: 400 }
      );
    }

    if (descripcion.length > 255) {
      return NextResponse.json(
        { message: "La descripcion no puede ser mayor a 255 caracteres" },
        { status: 400 }
      );
    }

    const query = `
      SELECT * FROM updTreatment($1, $2, $3, $4)  
    `;

    const values = [nombre, descripcion, precio, params.id];
    console.log("params.id:", params.id);

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
    const { id } = await params;

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
      const restoreQuery = "SELECT * FROM enableTreatment($1)";
      const result = await connection.query(restoreQuery, [id]);

      if (result.rowCount === 0) {
        return NextResponse.json({ message: "Treatment not found" }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    }

    if (deleteType === 'logical') {
      const query = "SELECT * FROM diableTreatment($1)";
      const result = await connection.query(query, [id]);
      if (result.rowCount === 0) {
        return NextResponse.json({ message: "Treatment not found" }, { status: 404 });
      }
      return NextResponse.json(result.rows[0]);
    } else if (deleteType === 'physical') {
      const query = "SELECT * FROM deleteTreatment($1)";
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
