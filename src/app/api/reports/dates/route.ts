import { NextResponse, NextRequest } from "next/server";
import { GetReportDatesUseCase } from "@/application/usecases/reports/GetDatesReportUseCases";
import { IReportDateRepository } from "@/infrastructure/repositories/ReportDatesRepository";
import { Cita } from "@/domain/entities/reports/datesReports";

const reportDateRepository= new IReportDateRepository();
const getReportDates = new GetReportDatesUseCase(reportDateRepository);

export async function GET(request: NextRequest){
    try{
        const {searchParams} = new URL(request.url);
        const fechaIni = searchParams.get("fecha_inicio");
        const fechaFin = searchParams.get("fecha_fin");
    
        if(!fechaIni || !fechaFin){
            return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
        }
    
        const dates: Cita[] = await getReportDates.execute(fechaIni, fechaFin);
    
        return NextResponse.json(dates);
    }catch(error){
    console.error("Error al obtener citas:", error);
        return NextResponse.json(
            { message: "Error al obtener citas", error: (error instanceof Error) ? error.message : String(error) },
            { status: 500 }
        );
    }
}
