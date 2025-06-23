import { MonthlyIncome, ExpectedVsPaid, AgeDistribution} from "@/domain/entities/Charts";

export interface ChartsDataDTO {
    ingresosMensuales: MonthlyIncome[];
    montoEsperadoYPagado: ExpectedVsPaid[];
    distribucionPorEdad: AgeDistribution[];
}

