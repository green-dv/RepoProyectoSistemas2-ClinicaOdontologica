import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/infrastructure/db/db";

export async function GET(request: NextRequest) {
    try{
        const connection = await getConnection();
        const url = new URL(request.url);

        const searchTerm = url.searchParams.get('q') || '';
        let query = 'SELECT * FROM fGetDates();';

        /*
        const values = [];
        
        if(searchTerm) {
            query += ` AND nombre ILIKE $1`;
            values.push(`%${searchTerm}%`);
        }
        */
        const result = await connection.query(query/*, values*/);
        
        return NextResponse.json(result.rows);
    }catch (error) {
        console.error("API ERROR > Error fetching dates:", error);
        return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const connection = await getConnection();
        const { fecha, idpaciente, idconsulta, descripcion, idestadocita, fechacita } = body;

        // VALIDACIONES
        if (!fecha || !idpaciente || !descripcion || !fechacita) {
            return NextResponse.json(
                { message: "La fecha, paciente, descripcion y fecha de creacion son requeridos" },
                { status: 400 }
            );
        }

        const query = `CALL pAddDate($1, $2, $3, $4, $5, $6)`;
        const values = [fecha, idpaciente, idconsulta, descripcion, idestadocita, fechacita];

        const result = await connection.query(query, values);

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("API ERROR > Error creating date:", error);
        return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
    }
}