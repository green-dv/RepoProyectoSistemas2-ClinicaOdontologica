import { useCallback, useState } from "react";
import { ConsultationResponse, CreateConsultationDTO, UpdateConsultationDTO } from "@/domain/dto/consultation";
import { Consultation } from "@/domain/entities/Consultations";

export const useConsultationData = () => {
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [totalConsultations, setTotalConsultations] = useState<number>(0);
    const [actionLoading, setActionLoading] = useState<boolean>(false); 

    const fetchConsultations = useCallback(async ({
        page,
        rowsPerPage,
        searchQuery,
        showDisabled
    }: {
        page: number;
        rowsPerPage: number;
        searchQuery: string;
        showDisabled: boolean;
    }) => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams({
                page: (page + 1).toString(),
                rowsPerPage: rowsPerPage.toString(),
            });
            if (searchQuery.trim()) {
                queryParams.append("search", searchQuery.trim());
            }

            const endpoint = showDisabled
                ? `/api/consultation/disable?${queryParams.toString()}`
                : `/api/consultation?${queryParams.toString()}`;

            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ConsultationResponse = await response.json();

            setConsultations(data.data || []);
            setTotalConsultations(data.pagination.totalItems || 0);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar consulta';
            setError(`Error al cargar consulta: ${errorMessage}`);
            setConsultations([]);
            setTotalConsultations(0);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleRestoreConsultation = useCallback(async (consultation: Consultation): Promise<boolean> => {
        setActionLoading(true);
        setError(null);
        try {
            const endpoint = `/api/consultation/${consultation.idconsulta}/restore`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al restaurar consulta';
            setError(`Error al restaurar consulta: ${errorMessage}`);
            return false;
        } finally {
            setActionLoading(false);
        }
    }, []);

    const handleDeletePermanently = useCallback(async (consultation: Consultation): Promise<boolean> => {
        setActionLoading(true);
        setError(null);
        try {
            const endpoint = `/api/consultation/${consultation.idconsulta}?permanent=true`;
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar consulta';
            setError(`Error al eliminar consulta: ${errorMessage}`);
            return false;
        } finally {
            setActionLoading(false);
        }
    }, []);

    const createConsultation = useCallback(async (dto: CreateConsultationDTO): Promise<boolean> => {
        setActionLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/consultation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dto),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear consulta';
            setError(`Error al crear consulta: ${errorMessage}`);
            return false;
        } finally {
            setActionLoading(false);
        }
    }, []);

    const updateConsultation = useCallback(async (id: number, dto: UpdateConsultationDTO): Promise<boolean> => {
        setActionLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/consultation/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dto),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar consulta';
            setError(`Error al actualizar consulta: ${errorMessage}`);
            return false;
        } finally {
            setActionLoading(false);
        }
    }, []);

    const getConsultationById = useCallback(async (id: number): Promise<Consultation | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/consultation/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const consultation: Consultation = await response.json();
            return consultation;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener consulta';
            setError(`Error al obtener consulta: ${errorMessage}`);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        // Estados
        consultations,
        loading,
        error,
        totalConsultations,
        actionLoading,

        // Métodos
        fetchConsultations,
        createConsultation,
        updateConsultation,
        handleDeletePermanently,
        handleRestoreConsultation,
        getConsultationById,

        setError,
    };
};
