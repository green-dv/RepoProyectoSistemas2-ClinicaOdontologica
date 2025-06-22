import { NextRequest, NextResponse } from "next/server";
import { IOdontogramrepository } from "@/infrastructure/repositories/OdontogramRepository";
import  { GetOdontogramsUseCase } from "@/application/usecases/odontogram/getOdontogramsUseCases";
import { CreateOdontogramUseCase } from "@/application/usecases/odontogram/createOdontogramUseCases";
import { Odontogram } from "@/domain/entities/Odontogram";

const odontogramRepository = new IOdontogramrepository();
const getOdontogramsUseCases = new GetOdontogramsUseCase(odontogramRepository);
const createOdontogramUseCases = new CreateOdontogramUseCase(odontogramRepository);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const idpaciente = parseInt(searchParams.get("idpaciente") || "0");
        const searchQuery = searchParams.get("searchQuery") || undefined;

        if(!idpaciente){
            return NextResponse.json(
                { error: "idpaciente is required" },
                { status: 400 }
            )
        }
        
        const odontograms = await getOdontogramsUseCases.execute(page, limit, idpaciente, searchQuery);
        return NextResponse.json(odontograms);
    } catch (error) {
        console.error("Error fetching odontograms:", error);
        return NextResponse.json({ error: "Error fetching odontograms" }, { status: 500 });
    }
}
export async function POST(request: NextRequest){
    try{
        const data = await request.json();
        console.log('datos insertados');
        console.log(data);
        const odontogram: Odontogram ={
            idodontograma: data.idodontograma,
            idpaciente: data.idpaciente,
            idconsulta: data.idconsulta,
            paciente: '',
            fechacreacion: data.fechacreacion,
            observaciones: data.observaciones,
            descripciones: data.descripciones || []
        }
        console.log('Imprimiendo Data desde la api');
        console.log(data);
        const createdOdontogram = await createOdontogramUseCases.execute(odontogram);
        return NextResponse.json(createdOdontogram, {status:200});
    } catch(error){
        console.error("Error fetchinf data odontogram", error);
        return NextResponse.json({ error: "Error fetching odontograms" }, { status: 500 });
    }
}

