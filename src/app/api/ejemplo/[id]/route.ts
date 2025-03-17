import { NextResponse } from "next/server";
import {getConnection} from "../../../../lib/database";


//FUNCION PARA OBTENER TODAS LAS TAREAS ASIGNADAS A CADA PERSONA
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try{
        const client = await getConnection().connect();
        const result = await client.query('SELECT tt.nombre AS tarea, te.nombre AS persona FROM TablaTareas tt JOIN AsignarTareas at ON tt.id = at.id_tarea JOIN TablaEjemplos te ON at.id_persona = te.id WHERE te.id = $1;', [params.id]);
        client.release();

        return NextResponse.json(result.rows);
    } catch (error) {
        console.log("Ejecutando obtenerTareas en el lado del cliente");
        return NextResponse.json({ 
            error: "Error interno del servidor", 
            message: error instanceof Error ? error.message : "Unknown error",
        }, { status: 500 });
    }
}
