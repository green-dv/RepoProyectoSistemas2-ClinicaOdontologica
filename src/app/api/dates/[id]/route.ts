import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/infrastructure/db/db";

export async function GET(request: NextRequest, {params}: {params: { id : string } }) {
    try{
        const connection = await getConnection();
        const id = parseInt(params.id);
        const url = new URL(request.url);

        let query = 'SELECT * FROM fGetDateByID($1);';

        const result = await connection.query(query, [id]);
        
        if(result.rows.length === 0){
          return NextResponse.json(
            { message: 'Date not found' },
            { status: 404 }
          );
        }
        const date = result.rows[0];
        return NextResponse.json(
          {
            idcita: date.idcita,
            idconsulta: date.idconsulta,
            fecha: date.fecha,
            fechacita: date.fechacita,
            idpaciente: date.idpaciente,
            paciente: date.paceinte,
            fechaconsulta: date.fechaconsulta,
            descripcion: date.descripcion,
            estado: date.estado,
            duracionaprox: date.duracionaprox
          }
        );
    }catch (error) {
        console.error("API ERROR > Error fetching the " + params + " date:", error);
        return NextResponse.json({ message: "Error del servidor:", error }, { status: 500 });
    }
}


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const connection = await getConnection();
    const idcita = parseInt(params.id);
    const { type } = body;

    if (type === 'full') {
      const {
        fecha,
        idpaciente,
        idconsulta,
        descripcion,
        idestadocita,
        fechacita,
        duracionaprox
      } = body;

      // Validaciones básicas
      if (!fecha || !idpaciente || !descripcion || !fechacita) {
        return NextResponse.json(
          { message: "La fecha, paciente, descripción y fecha de cita son requeridos" },
          { status: 400 }
        );
      }

      const query = `SELECT * FROM fUpdateDate($1, $2, $3, $4, $5, $6, $7, $8)`;
      const values = [
        idcita,
        fecha,
        idpaciente,
        idconsulta || null,
        descripcion,
        idestadocita,
        fechacita,
        duracionaprox
      ];

      const result = await connection.query(query, values);

      if (result.rows.length === 0) {
        return NextResponse.json({ message: 'Date not found' }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    }

    if (type === 'status') {
      const { status } = body;

      if (typeof status !== 'number') {
        return NextResponse.json({ message: "El estado es requerido" }, { status: 400 });
      }

      const query = `SELECT * FROM fUpdateDateStatus($1, $2)`;
      const values = [idcita, status];

      const result = await connection.query(query, values);

      if (result.rowCount === 0) {
        return NextResponse.json({ message: "Date not found or status not updated" }, { status: 404 });
      }

      return NextResponse.json({ message: "Estado actualizado", data: result.rows[0] });
    }

    return NextResponse.json({ message: "Tipo de operación inválido" }, { status: 400 });
  } catch (error) {
    console.error("API ERROR > Error updating date:", error);
    return NextResponse.json({ message: "Error del servidor", error }, { status: 500 });
  }
}



export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const connection = await getConnection();
    const id = parseInt(await params.id);
    
    let body = {} as { type?: string };
    try {
      body = await req.json();
    } catch {
    }

    if (body && body.type === 'restore') {
      const restoreQuery = "SELECT * FROM fRestoreDate($1)";
      const result = await connection.query(restoreQuery, [id]);
      
      if (result.rowCount === 0) {
        return NextResponse.json({ message: "Date not found" }, { status: 404 });
      }
      
      return NextResponse.json(result.rows[0]);
    }

    if (body && body.type === 'logical') {
      const query = "SELECT * FROM fDisableDate($1)";
      const result = await connection.query(query, [id]);
      if (result.rowCount === 0) {
        return NextResponse.json({ message: "Date not found" }, { status: 404 });
      }
      return NextResponse.json(result.rows[0]);
    }
    if (body && body.type === 'physical') {
      const query = "SELECT * FROM fDeleteDate($1)";
      const result = await connection.query(query, [id]);

      if (result.rowCount === 0) {
        return NextResponse.json({ message: "Date not found" }, { status: 404 });
      }

      return NextResponse.json({ message: "Date has been deleted permanently", data: result.rows[0] });
    } else {
      return NextResponse.json(
        { message: "Usar 'logical', 'physical', o 'restore'." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing date:", error);
    return NextResponse.json({ message: "Error del servidor", error }, { status: 500 });
  }
}
