import { NextResponse, NextRequest } from "next/server";
import { getConnection } from "@/infrastructure/db/db"; 

export async function GET(request: NextRequest) {
    try {
      const connection = await getConnection();
      const url = new URL(request.url);
      const searchTerm = url.searchParams.get('q') || '';
      
      let query = '';
      const values = [];
      
      if (searchTerm) {
        query = `
          SELECT * FROM getTreatmentsDisabled() AS t
          WHERE t.nombre ILIKE $1
        `;
        values.push(`%${searchTerm}%`);
      } else {
        query = `SELECT * FROM getTreatmentsDisabled()`;
      }

      const result = await connection.query(query, values);
  
      if (result.rows.length === 0) {
        return NextResponse.json({ treatments: [] }, { status: 200 });
      }
  
      return NextResponse.json(result.rows);
    } catch (error) {
      console.error("Error fetching disabled treatments:", error);
      return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
    }
}