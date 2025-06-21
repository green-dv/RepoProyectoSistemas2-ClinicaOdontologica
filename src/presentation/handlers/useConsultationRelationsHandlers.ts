import { ConsultationDetail, ConsultationByPatientDTO } from "@/domain/dto/consultation";
import { Treatment } from "@/domain/entities/Treatments";
import { useCallback, useState } from "react";

export const useConsultationRelationsHandlers = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<boolean>(false);
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [consultationDetail, setConsultationDetail] = useState<ConsultationDetail | null>(null);
    const [consultationsByPatient, setConsultationsByPatient] = useState<ConsultationByPatientDTO[]>([]);

    const fetchConsultationsByPatientId = useCallback(async (patientId: number): Promise<ConsultationByPatientDTO[] | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/consultation/patient/${patientId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: ConsultationByPatientDTO[] = await response.json();
            setConsultationsByPatient(data);
            return data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar consultas por paciente';
            setError(`Error al cargar consultas por paciente: ${errorMessage}`);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTreatmentsByConsultationId = useCallback(async (idconsulta: number): Promise<Treatment[] | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/consultation/${idconsulta}/treatment`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: Treatment[] = await response.json();
            setTreatments(data);
            return data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar tratamientos';
            setError(`Error al cargar tratamientos: ${errorMessage}`);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchConsultationDetail = useCallback(async (idconsulta: number): Promise<ConsultationDetail | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/consultation/${idconsulta}/detail`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: ConsultationDetail = await response.json();
            setConsultationDetail(data);
            return data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar detalle de consulta';
            setError(`Error al cargar detalle de consulta: ${errorMessage}`);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const addTreatmentsToConsultation = useCallback(async (idconsulta: number, tratamientos: number[]): Promise<boolean> => {
        setActionLoading(true);
        setError(null);
        
        try {
            if (!idconsulta || !Array.isArray(tratamientos) || tratamientos.length === 0) {
                throw new Error('Parámetros inválidos para agregar tratamientos');
            }

            const response = await fetch(`/api/consultation/${idconsulta}/treatment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ treatmentIds: tratamientos }),
            });

            if (!response.ok) {
                // Obtener más detalles de error ayudaron de mucho :>>
                let errorDetail = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorDetail = errorData.message || errorData.error || errorDetail;
                } catch {
                    //no se pero si no se puede parsear pasa a throw error
                }
                throw new Error(errorDetail);
            }

            await fetchConsultationDetail(idconsulta);
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al agregar tratamientos a consulta';
            setError(`Error al agregar tratamientos a consulta: ${errorMessage}`);
            console.error('Error adding treatments:', err);
            return false;
        } finally {
            setActionLoading(false);
        }
    }, [fetchConsultationDetail]);

    const removeTreatmentFromConsultation = useCallback(async (idconsulta: number, idtratamiento: number[]): Promise<boolean> => {
        setActionLoading(true);
        setError(null);

        try {
            if (!idconsulta || !Array.isArray(idtratamiento) || idtratamiento.length === 0) {
                throw new Error('Parámetros inválidos para remover tratamientos');
            }

            const response = await fetch(`/api/consultation/${idconsulta}/treatment`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ treatmentIds: idtratamiento }),
            });

            if (!response.ok) {
                // Obtener más detalles de error sii
                let errorDetail = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorDetail = errorData.message || errorData.error || errorDetail;
                } catch {
                }
                throw new Error(errorDetail);
            }

            await fetchConsultationDetail(idconsulta);
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar tratamiento de consulta';
            setError(`Error al eliminar tratamiento de consulta: ${errorMessage}`);
            console.error('Error removing treatments:', err);
            return false;
        } finally {
            setActionLoading(false);
        }
    }, [fetchConsultationDetail]);

    return {
        loading,
        error,
        actionLoading,
        treatments,
        consultationDetail,
        consultationsByPatient,
        setTreatments,
        setConsultationDetail,
        setConsultationsByPatient,
        setActionLoading,
        setError,
        setLoading,
        fetchTreatmentsByConsultationId,
        fetchConsultationDetail,
        fetchConsultationsByPatientId,
        addTreatmentsToConsultation,
        removeTreatmentFromConsultation,
    };
};