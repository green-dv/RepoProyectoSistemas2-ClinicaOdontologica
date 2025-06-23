import { ChartsDataDTO } from "../dto/charts";

export interface ChartsRepository {
    getDataCharts(): Promise<ChartsDataDTO>;
}
