import { useEffect, useState } from "react";

import { ExpectedVsPaid } from "@/domain/entities/Charts";

export function useExpectedVsPaidChart() {
    const [data, setData] = useState<ExpectedVsPaid[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/dashboard")
        .then((res) => res.json())
        .then((res) => {
            setData(res.montoEsperadoYPagado || []);
        })
        .finally(() => setLoading(false));
    }, []);

    return { data, loading };
}
