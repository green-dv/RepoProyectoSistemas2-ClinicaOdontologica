import {NextRequest, NextResponse} from 'next/server';
import { getConnection } from '@/infrastructure/db/db';

export async function GET(request: NextRequest){
    try {
      const connection = await getConnection();
      const url = new URL(request.url);
      const searchTerm = url.searchParams.get('q') || '';
      
      let query = `SELECT * FROM fun_getxray() AS t`;
      const values = [];
      
      if (searchTerm) {
        query += ` WHERE t.idradiografia ILIKE $1`;
        values.push(`%${searchTerm}%`);
      }
      
      const result = await connection.query(query, values);
      
      return NextResponse.json(result.rows);
    
    } catch (error) {
        console.error("ERROR al obtener tu query", error);
        return NextResponse.json(
            {message: "Error del servidor"}, 
            {status: 500}
        );
    }
}

export async function POST(request: NextRequest){
    try {
        const body = await request.json(); 
        const connection = await getConnection();
        
        const {enlaceradiografia, fecha, idpaciente} = body;
        
        // Validación más completa
        if(!enlaceradiografia || typeof enlaceradiografia !== 'string') {
            return NextResponse.json(
                { message: "El enlace de radiografia es requerido y debe ser texto"},
                { status: 400}
            );
        }
        
        if(!idpaciente || isNaN(Number(idpaciente))) {
            return NextResponse.json(
                { message: "ID de paciente inválido o faltante"},
                { status: 400}
            );
        }
        
        // Usar fecha actual si no se proporciona
        const fechaRadiografia = fecha || new Date().toISOString().split('T')[0];
        
        const query = `
            INSERT INTO radiografias(enlaceradiografia, fecha, idpaciente)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
      
        const values = [enlaceradiografia, fechaRadiografia, idpaciente];
        
        const result = await connection.query(query, values);
        
        return NextResponse.json(
            {data: result.rows[0], message: "Radiografía creada exitosamente"}, 
            {status: 201}
        );
    
    } catch (error) {
        console.error("Error sending data", error);
        return NextResponse.json(
            {message: "Error del servidor"}, 
            {status: 500}
        );
    }
}