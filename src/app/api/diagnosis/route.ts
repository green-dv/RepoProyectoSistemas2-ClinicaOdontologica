import { NextRequest, NextResponse } from "next/server";
import { IOdontogramrepository } from "@/infrastructure/repositories/OdontogramRepository";
import  { GetDiagnosisUseCases } from "@/application/usecases/odontogram/getDiagnosisUseCases";
import { createDiagnosisUseCases } from "@/application/usecases/odontogram/createDiagnosisUseCases";
import { Diagnosis } from "@/domain/entities/Diagnosis";

const odontogramRepository = new IOdontogramrepository();
const getDiagnosisUseCases = new GetDiagnosisUseCases(odontogramRepository);
const createDiagnosisUseCase = new createDiagnosisUseCases(odontogramRepository);

export async function GET() {
  try {        
      const diagnosis = await getDiagnosisUseCases.execute();
      return NextResponse.json(diagnosis);
  } catch (error) {
      console.error("Error fetching diagnosis:", error);
      return NextResponse.json({ error: "Error fetching diagnosis" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try{
    const data = await request.json();
    const diagnosis: Diagnosis ={
        iddiagnostico: data.iddiagnostico,
        descripcion: data.descripcion,
        enlaceicono: data.enlaceicono,
    };
    const createdDiagosis = await createDiagnosisUseCase.execute(diagnosis);
    return NextResponse.json(createdDiagosis, {status:200})
  } catch (error){
    console.error("Error creating diagnosis:", error);
    return NextResponse.json({ error: "Error fetching diagnosis" }, { status: 500 });
  }
}