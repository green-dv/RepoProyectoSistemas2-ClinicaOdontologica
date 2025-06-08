import { NextRequest, NextResponse } from "next/server";
import { IOdontogramrepository } from "@/infrastructure/repositories/OdontogramRepository";
import { GetOdontogramByConsultationIdUseCase } from "@/application/usecases/odontogram/getOdontogramByConsultationIDUseCases";

const odontogramRepository = new IOdontogramrepository();
const getOdontogramsUseCases = new GetOdontogramByConsultationIdUseCase(odontogramRepository);

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    const id = Number(params.id); 
    if (isNaN(id)) {
      return NextResponse.json({ error: "Id de consulta invalida" }, { status: 400 });
    }
    const result = await getOdontogramsUseCases.execute(id);
    if (!result) {
      return NextResponse.json({ message: "Odontograma no encontrado" }, { status: 404 });
    }

    return NextResponse.json(result);
}