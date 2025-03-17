import { NextResponse } from "next/server";
import {getConnection} from "../../../lib/database";


//FUNCION PARA OBTENER TODOS LOS REGISTROS
export async function GET() {
    try{
        const client = await getConnection().connect();
        const result = await client.query('SELECT * FROM TablaEjemplos');
        client.release();

        return NextResponse.json(result.rows);
    } catch (error) {
        console.log("Ejecutando obtenerEjemplos en el lado del cliente");
        return NextResponse.json({ 
            error: "Error interno del servidor", 
            message: error instanceof Error ? error.message : "Unknown error",
        }, { status: 500 });
    }
}
