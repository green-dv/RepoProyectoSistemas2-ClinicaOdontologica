import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/infrastructure/db/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }){
  try{
    const connection = getConnection();
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const query = `SELECT * FROM fGetHabitById($1)`;

    const result = await connection.query(query, [id]);


    if(result.rows.length === 0){
      return NextResponse.json(
        { message: "Habit not found" },
        { status: 404 }
      );
    }

    const habit = result.rows[0];
    return NextResponse.json({
      idhabtio: habit.idhabito,
      habito: habit.habito
    });
  } catch(error){
    console.error("API ERROR > Error fetching habits", error);
    return NextResponse.json({message: "Error al obtener el habito"}, {status: 500});
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }){
  try{
    const connection = getConnection();
    const body = await req.json();
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    const { habito } = body;

    if( !habito ){
      return NextResponse.json(
        { message: "La descripción es obligatoria" },
        { status: 400 }
      );
    }
    const query = `SELECT * FROM fUpdateHabit($1, $2)`;
    const values = [id, habito];
    const result = await connection.query(query, values);

    if(result.rows.length === 0){
      return NextResponse.json(
        { message: "Habit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  }
  catch(error){
    return NextResponse.json({message: "API ERROR > Error updating Habits", error});
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }){
  try{
    const connection = getConnection();
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    const url = new URL(req.url);

    const deleteType = url.searchParams.get('type') || 'logical';

    let body = {} as { type? : string };
    try{
      body = await req.json();
    } catch{

    }

    if(body && deleteType === 'restore'){
      const restoreQuery = "SELECT * FROM fChangeHabitStatus($1, TRUE)";
      const result = await connection.query(restoreQuery, [id]);

      if (result.rowCount === 0) {
        return NextResponse.json({ message: "Habit not found" }, { status: 404 });
      }
      return NextResponse.json(result.rows[0], { status: 200 });
    }
    if(deleteType === 'logical'){
      const query = "SELECT * FROM fChangeHabitStatus($1, FALSE)";
      const result = await connection.query(query, [id]);

      if (result.rowCount === 0) {
        return NextResponse.json({ message: "Habit not found" }, { status: 404 });
      }
      return NextResponse.json(result.rows[0], { status: 200 });
    }

    if(deleteType === 'physical'){
      const deleteQuery = "SELECT * FROM fDeleteHabit($1)";
      const result = await connection.query(deleteQuery, [id]);

      if (result.rowCount === 0) {
        return NextResponse.json({ message: "Habit not found" }, { status: 404 });
      }
      return NextResponse.json(result.rows[0], { status: 200 });
    }
  } catch (error){
    return NextResponse.json({message: "API ERROR > Error in delete Habit", error});
  }
} 