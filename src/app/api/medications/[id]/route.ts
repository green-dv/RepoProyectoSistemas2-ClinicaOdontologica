import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/infrastructure/db/db";

export async function GET(req: NextRequest, {params} : {params : { id: string }}){
  try{
    const connection = getConnection();
    const { id } = params;
    const query = `SELECT * FROM fGetMedicationById($1)`;

    const result = await connection.query(query, [id]);


    if(result.rows.length === 0){
      return NextResponse.json(
        { message: "Medication not found" },
        { status: 404 }
      );
    }

    const medication = result.rows[0];
    return NextResponse.json({
      idmedicacion: medication.idmedication,
      medicacion: medication.medicacion
    });
  } catch(error){
    console.error("API ERROR > Error fetching Medication", error);
    return NextResponse.json({message: "Error al obtener la medicacion"}, {status: 500});
  }
}



export async function PUT(req: NextRequest, { params }: { params: { id: string } }){
  try{
    const connection = getConnection();
    const body = await req.json();
    
    const { medicacion } = body;

    if( !medicacion ){
      return NextResponse.json(
        { message: "La descripción es obligatoria" },
        { status: 400 }
      );
    }
    const query = `SELECT * FROM fUpdateMedication($1, $2)`;
    const values = [params.id, medicacion];
    const result = await connection.query(query, values);

    if(result.rows.length === 0){
      return NextResponse.json(
        { message: "Medication not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  }
  catch(error){
    return NextResponse.json({message: "API ERROR > Error updating Medication", error});
  }
}

export async function DELETE(req: NextRequest, { params }: {params: {id: string}}){
  try{
    const connection = getConnection();
    const { id } = await params;

    const url = new URL(req.url);

    const deleteType = url.searchParams.get('type') || 'logical';

    let body = {} as { type? : string };
    try{
      body = await req.json();
    } catch{

    }

    if(body && deleteType === 'restore'){
      const restoreQuery = "SELECT * FROM fChangeMedicationStatus($1, TRUE)";
      const result = await connection.query(restoreQuery, [id]);

      if (result.rowCount === 0) {
        return NextResponse.json({ message: "Medication not found" }, { status: 404 });
      }
      return NextResponse.json(result.rows[0], { status: 200 });
    }
    if(deleteType === 'logical'){
      const query = "SELECT * FROM fChangeMedicationStatus($1, FALSE)";
      const result = await connection.query(query, [id]);

      if (result.rowCount === 0) {
        return NextResponse.json({ message: "Medication not found" }, { status: 404 });
      }
      return NextResponse.json(result.rows[0], { status: 200 });
    }

    if(deleteType === 'physical'){
      const deleteQuery = "SELECT * FROM fDeleteMedication($1)";
      const result = await connection.query(deleteQuery, [id]);

      if (result.rowCount === 0) {
        return NextResponse.json({ message: "Medication not found" }, { status: 404 });
      }
      return NextResponse.json(result.rows[0], { status: 200 });
    }
  } catch (error){
    return NextResponse.json({message: "API ERROR > Error in delete Medication", error});
  }
} 