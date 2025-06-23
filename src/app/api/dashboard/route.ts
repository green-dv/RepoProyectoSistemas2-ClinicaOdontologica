import { NextResponse } from "next/server";
import { IChartRepository } from "@/infrastructure/repositories/ChartsRepository";
import { GetDashboardDataUseCase } from "@/application/usecases/charts/GetChartsDataUseCases";

const chartsDataRepository = new IChartRepository();
const getChartDataUseCases = new GetDashboardDataUseCase(chartsDataRepository);

export async function GET() {
    try {
        const consultations = await getChartDataUseCases.execute();
        return NextResponse.json(consultations, { status: 200 });
    } catch (error) {
        console.error("Error al obtener la lista de consultas:", error);
        return NextResponse.json(
            { message: "Error al obtener la lista de consultas", error: (error instanceof Error) ? error.message : String(error) },
            { status: 500 }
        );
    } 
}