import { NextResponse, NextRequest } from "next/server";
import { getConnection } from "@/infrastructure/db/db"; 
import { Patient } from "@/domain/entities/Patient";
import { PatientsResponse } from "@/application/dtos/PatientResponse";

export async function GET(request: NextRequest) {
    try {
      const connection = await getConnection();
      const url = new URL(request.url);
      const searchTerm = url.searchParams.get('q') || '';
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const offset = (page - 1) * limit;
  
      let query = `SELECT * FROM getPatientDisabled() AS p`;
      const values: string[] = [];
      let paramIndex = 1;
  
      if (searchTerm) {
        query += ` WHERE p.nombres ILIKE $${paramIndex} OR p.apellidos ILIKE $${paramIndex}`;
        values.push(`%${searchTerm}%`);
        paramIndex++;
      }
  
      query += ` ORDER BY p.idpaciente DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      values.push(limit.toString(), offset.toString());
  
      const result = await connection.query(query, values);
  
      const countQuery = `
       SELECT COUNT(*) FROM getPatientDisabled() AS p
        ${searchTerm ? `WHERE p.nombres ILIKE $1 OR p.apellidos ILIKE $1` : ''}
      `;
      const countValues = searchTerm ? [`%${searchTerm}%`] : [];
      const countResult = await connection.query(countQuery, countValues);
      const totalCount = parseInt(countResult.rows[0].count);
  
      const response: PatientsResponse = {
        data: result.rows as Patient[],
        pagination: {
          page,
          limit,
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      };
  
      return NextResponse.json(response);
    } catch (error) {
      console.error("Error al obtener pacientes deshabilitados:", error);
      return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
    }
  }