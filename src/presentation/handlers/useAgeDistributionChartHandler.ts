import { useEffect, useState } from "react";
import { AgeDistribution } from "@/domain/entities/Charts";

export function useAgeDistributionChart() {
    const [data, setData] = useState<AgeDistribution[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/dashboard")
        .then((res) => res.json())
        .then((res) => {
            console.log('API Response for age distribution:', res);
            setData(res.distribucionPorEdad || []);
        })
        .catch((error) => {
            console.error('Error fetching age distribution data:', error);
            setData([]);
        })
        .finally(() => setLoading(false));
    }, []);

    return { data, loading };
}