import { ChartsDataDTO } from "@/domain/dto/charts";
import { ChartsRepository } from "@/domain/repositories/ChartsRepository";
import { getConnection } from "../db/db";

export class IChartRepository implements ChartsRepository {
    private db;

    constructor() {
        this.db = getConnection();
    }

    async getDataCharts(): Promise<ChartsDataDTO> {
        const ingresosMensualesResult = await this.db.query(`
            SELECT 
                DATE_TRUNC('month', fechapago) AS mes,
                SUM(montopagado) AS total_ingresado
            FROM pagos
            WHERE fechapago IS NOT NULL
            GROUP BY mes
            ORDER BY mes
        `);
        const ingresosMensuales = ingresosMensualesResult.rows as {
            mes: Date;
            total_ingresado: number;
        }[];


        const montoEsperadoYPagadoResult = await this.db.query(`
            SELECT 
                DATE_TRUNC('month', fechapago) AS mes,
                SUM(montoesperado) AS esperado,
                SUM(montopagado) AS pagado
            FROM pagos
            WHERE fechapago IS NOT NULL
            GROUP BY mes
            ORDER BY mes
        `);
        const montoEsperadoYPagado = montoEsperadoYPagadoResult.rows as {
            mes: Date;
            esperado: number;
            pagado: number;
        }[];

        const distribucionPorEdadResult = await this.db.query(`
            SELECT 
                CASE 
                    WHEN EXTRACT(YEAR FROM AGE(fechanacimiento)) < 18 THEN 'Menores de 18'
                    WHEN EXTRACT(YEAR FROM AGE(fechanacimiento)) BETWEEN 18 AND 30 THEN '18-30'
                    WHEN EXTRACT(YEAR FROM AGE(fechanacimiento)) BETWEEN 31 AND 45 THEN '31-45'
                    WHEN EXTRACT(YEAR FROM AGE(fechanacimiento)) BETWEEN 46 AND 60 THEN '46-60'
                    ELSE '60+' 
                END AS rango_edad,
                COUNT(*) AS total
            FROM pacientes
            GROUP BY rango_edad
            ORDER BY rango_edad
        `);
        const distribucionPorEdad = distribucionPorEdadResult.rows as {
            rango_edad: string;
            total: number;
        }[];

        return {
            ingresosMensuales: ingresosMensuales.map(row => ({
                month: row.mes.toISOString().slice(0, 7),
                totalIngresado: Number(row.total_ingresado),
            })),
            montoEsperadoYPagado: montoEsperadoYPagado.map(row => ({
                month: row.mes.toISOString().slice(0, 7),
                esperado: Number(row.esperado),
                pagado: Number(row.pagado),
            })),
            distribucionPorEdad: distribucionPorEdad.map(row => ({
                rangoEdad: row.rango_edad,
                total: Number(row.total),
            })),
        };
    }
}