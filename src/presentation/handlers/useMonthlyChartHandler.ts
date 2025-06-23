import { useEffect, useState } from "react";

import { MonthlyIncome } from "@/domain/entities/Charts";

export function useMonthlyIncomeChart() {
    const [data, setData] = useState<MonthlyIncome[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
    console.log('Fetching dashboard data...');
    fetch("/api/dashboard")
        .then((res) => {
        console.log('Raw response:', res);
        return res.json();
        })
        .then((res) => {
        console.log('Parsed response:', res);
        setData(res.ingresosMensuales || []);
        })
        .catch((error) => {
        console.error('Error fetching dashboard:', error);
        })
        .finally(() => setLoading(false));
    }, []);

    return { data, loading };
}
