import { useState, useEffect } from 'react';
import { Cita } from '@/domain/entities/reports/datesReports';

export interface UseReporteCitasReturn {
    citas: Cita[];
    loading: boolean;
    error: string | null;
    fechaInicio: Date | null;
    fechaFin: Date | null;
    setFechaInicio: (fecha: Date | null) => void;
    setFechaFin: (fecha: Date | null) => void;
    setCitas: (citas: Cita[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useReporteCitas = (): UseReporteCitasReturn => {
    const [citas, setCitas] = useState<Cita[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
    const [fechaFin, setFechaFin] = useState<Date | null>(null);

    useEffect(() => {
        if (error) {
        setError(null);
        }
    }, [fechaInicio, fechaFin]);

    return {
        citas,
        loading,
        error,
        fechaInicio,
        fechaFin,
        setFechaInicio,
        setFechaFin,
        setCitas,
        setLoading,
        setError,
    };
};