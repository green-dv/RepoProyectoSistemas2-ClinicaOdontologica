import { NextRequest, NextResponse } from "next/server";
import { IOdontogramrepository } from "@/infrastructure/repositories/OdontogramRepository";
import { RemoveDescriptionUseCase } from "@/application/usecases/odontogram/removeDescriptionUseCases";

const odontogramRepository = new IOdontogramrepository();
const removeDescription = new RemoveDescriptionUseCase(odontogramRepository);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const idodontograma = Number(searchParams.get("idodontograma"));
  const idcara = Number(searchParams.get("idcara"));
  const idpieza = Number(searchParams.get("idpieza"));
  const iddiagnostico = Number(searchParams.get("iddiagnostico"));

  if ([idodontograma, idcara, idpieza, iddiagnostico].some(isNaN)) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
  }

  const result = await removeDescription.execute(
    idodontograma,
    idcara,
    idpieza,
    iddiagnostico,
  );

  return NextResponse.json(result);
}