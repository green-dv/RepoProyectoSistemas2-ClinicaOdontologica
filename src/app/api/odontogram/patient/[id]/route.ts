import { NextRequest, NextResponse } from "next/server";
import { IOdontogramrepository } from "@/infrastructure/repositories/OdontogramRepository";
import { GetLastOdontogramUseCase } from "@/application/usecases/odontogram/getLastOdontogramPerPatientIdUseCases";

const odontogramRepository = new IOdontogramrepository();
const getOdontogramsUseCases = new GetLastOdontogramUseCase(odontogramRepository);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const idpaciente = Number(params.id);

  if (isNaN(idpaciente)) {
    return NextResponse.json({ error: "Id de paciente invalida" }, { status: 400 });
  }

  const result = await getOdontogramsUseCases.execute(idpaciente);

  if (!result) {
    return NextResponse.json({ message: "No se encontro un odontograma" }, { status: 404 });
  }

  return NextResponse.json(result);
}