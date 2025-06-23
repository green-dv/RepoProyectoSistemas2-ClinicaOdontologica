import { MonthlyIncome } from "@/domain/entities/Charts";
import { ExpectedVsPaid } from "@/domain/entities/Charts";
import { AgeDistribution } from "@/domain/entities/Charts";

export function formatMonthlyIncomeData(data: MonthlyIncome[]) {
  return data.map((d) => ({
    time: d.month + "-01",
    value: d.totalIngresado,
  }));
}

export function formatExpectedVsPaidData(data: ExpectedVsPaid[]) {
  return {
    esperado: data.map((d) => ({
      time: d.month + "-01",
      value: d.esperado,
    })),
    pagado: data.map((d) => ({
      time: d.month + "-01",
      value: d.pagado,
    })),
  };
}

export function formatAgeDistributionData(data: AgeDistribution[]) {
  const baseTime = 1640995200; 

  return data.map((d, index) => ({
    time: baseTime + (index * 86400), 
    value: d.total,
    color: `hsl(${(index * 360) / data.length}, 70%, 60%)`, 
  }));
}