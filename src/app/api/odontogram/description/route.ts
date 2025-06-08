import { NextRequest, NextResponse } from "next/server";
import { IOdontogramrepository } from "@/infrastructure/repositories/OdontogramRepository";
import { GetDescriptionsUseCase } from "@/application/usecases/odontogram/getDescriptionsUseCases";

const odontogramRepository = new IOdontogramrepository();
const getDescriptionsUseCases = new GetDescriptionsUseCase(odontogramRepository);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const idParam = searchParams.get("id");

  const idodontograma = Number(idParam);

  if (isNaN(idodontograma)) {
    return NextResponse.json({ error: "ID inválida" }, { status: 400 });
  }

  const result = await getDescriptionsUseCases.execute(idodontograma);

  if (!result) {
    return NextResponse.json({ message: "No se encontraron detalles" }, { status: 404 });
  }

  return NextResponse.json(result);
}