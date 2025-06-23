import { ChartsRepository } from "@/domain/repositories/ChartsRepository";
import { ChartsDataDTO } from "@/domain/dto/charts";

export class GetDashboardDataUseCase {
    constructor(private readonly repository: ChartsRepository) {}

    async execute(): Promise<ChartsDataDTO> {
        return this.repository.getDataCharts();
    }
}
