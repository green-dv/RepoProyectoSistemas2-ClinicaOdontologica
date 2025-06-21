import { useState, useEffect, useCallback } from "react";
import { Consultation } from "@/domain/entities/Consultations";
import { ConsultationDetail, UpdateConsultationDTO, CreateConsultationDTO } from "@/domain/dto/consultation";
import { useConsultationData } from "@/presentation/handlers/useConsultationHandlers";
import { useConsultationRelationsHandlers } from "@/presentation/handlers/useConsultationRelationsHandlers";

interface UseConsultationListProps {
    initialPage?: number;
    initialRowsPerPage?: number;
    initialSearchQuery?: string;
    initialShowDisabled?: boolean;
}

export const useConsultationList = ({
    initialPage = 0,
    initialRowsPerPage = 10,
    initialSearchQuery = "",
    initialShowDisabled = false,
}: UseConsultationListProps = {}) => {
    // Estados principales
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [detail, setDetail] = useState<ConsultationDetail | null>(null);
    const [currentConsultationId, setCurrentConsultationId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Estados de paginación y búsqueda
    const [page, setPage] = useState<number>(initialPage);
    const [rowsPerPage, setRowsPerPage] = useState<number>(initialRowsPerPage);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
    const [showDisabled, setShowDisabled] = useState<boolean>(initialShowDisabled);

    // Estados de UI
    const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);

    // Handlers
    const consultationDataHandler = useConsultationData();
    const consultationRelationsHandler = useConsultationRelationsHandlers();

    // Función principal para cargar consultas
    const fetchConsultations = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            await consultationDataHandler.fetchConsultations({
                page,
                rowsPerPage,
                searchQuery,
                showDisabled,
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar consultas';
            setError(`Error al cargar consultas: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, searchQuery, showDisabled, consultationDataHandler]);

    // Cargar detalle de consulta
    const selectConsultation = useCallback(async (consultationId: number) => {
        if (consultationId === currentConsultationId) return;

        setCurrentConsultationId(consultationId);
        setLoading(true);
        setError(null);

        try {
            const result = await consultationRelationsHandler.fetchConsultationDetail(consultationId);
            if (result) {
                setDetail(result);
            } else {
                setDetail(null);
                setError('No se pudo cargar el detalle de la consulta');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar detalle';
            setError(`Error al cargar detalle de consulta: ${errorMessage}`);
            setDetail(null);
        } finally {
            setLoading(false);
        }
    }, [currentConsultationId, consultationRelationsHandler]);

    const clearSelection = useCallback(() => {
        setCurrentConsultationId(null);
        setDetail(null);
    }, []);

    // Diálogos
    const handleOpenAddDialog = useCallback(() => {
        setError(null); // Limpiar errores previos
        setOpenAddDialog(true);
    }, []);
    
    const handleCloseAddDialog = useCallback(() => {
        setOpenAddDialog(false);
        setError(null); // Limpiar errores al cerrar
    }, []);
    
    const handleOpenEditDialog = useCallback(async (consultationId: number) => {
        await selectConsultation(consultationId);
        setOpenEditDialog(true);
    }, [selectConsultation]);
    
    const handleCloseEditDialog = useCallback(() => {
        setOpenEditDialog(false);
        setError(null); // Limpiar errores al cerrar
    }, []);

    // CRUD - Función createConsultation corregida
    const createConsultation = useCallback(async (dto: CreateConsultationDTO): Promise<boolean> => {
        try {
            setError(null);
            
            // Validar que el DTO tenga los campos requeridos
            if (!dto.idpaciente || !dto.idusuario || !dto.fecha) {
                throw new Error('Faltan campos requeridos para crear la consulta');
            }

            const result = await consultationDataHandler.createConsultation(dto);
            
            if (result) {
                // Refrescar la lista de consultas
                await fetchConsultations();
                
                // Cerrar el diálogo
                handleCloseAddDialog();
                
                return true;
            } else {
                setError('No se pudo crear la consulta');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear consulta';
            setError(`Error al crear consulta: ${errorMessage}`);
            console.error('Error in createConsultation:', err);
            return false;
        }
    }, [consultationDataHandler, fetchConsultations, handleCloseAddDialog]);

    const updateConsultation = useCallback(async (id: number, dto: UpdateConsultationDTO): Promise<boolean> => {
        try {
            setError(null);
            const result = await consultationDataHandler.updateConsultation(id, dto);
            
            if (result) {
                await fetchConsultations();
                if (currentConsultationId === id) {
                    await selectConsultation(id);
                }
                handleCloseEditDialog();
                return true;
            } else {
                setError('No se pudo actualizar la consulta');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar consulta';
            setError(`Error al actualizar consulta: ${errorMessage}`);
            return false;
        }
    }, [consultationDataHandler, fetchConsultations, currentConsultationId, selectConsultation, handleCloseEditDialog]);

    const deleteConsultation = useCallback(async (consultation: Consultation): Promise<boolean> => {
        try {
            setError(null);
            const result = await consultationDataHandler.handleDeletePermanently(consultation);
            
            if (result) {
                await fetchConsultations();
                if (currentConsultationId === consultation.idconsulta) {
                    clearSelection();
                }
                return true;
            } else {
                setError('No se pudo eliminar la consulta');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar consulta';
            setError(`Error al eliminar consulta: ${errorMessage}`);
            return false;
        }
    }, [consultationDataHandler, fetchConsultations, currentConsultationId, clearSelection]);

    const restoreConsultation = useCallback(async (consultation: Consultation): Promise<boolean> => {
        try {
            setError(null);
            const result = await consultationDataHandler.handleRestoreConsultation(consultation);
            
            if (result) {
                await fetchConsultations();
                return true;
            } else {
                setError('No se pudo restaurar la consulta');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al restaurar consulta';
            setError(`Error al restaurar consulta: ${errorMessage}`);
            return false;
        }
    }, [consultationDataHandler, fetchConsultations]);

    // Setters
    const handleSetPage = useCallback((newPage: number) => setPage(newPage), []);
    const handleSetRowsPerPage = useCallback((newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    }, []);
    const handleSetSearchQuery = useCallback((query: string) => {
        setSearchQuery(query);
        setPage(0);
    }, []);
    const handleSetShowDisabled = useCallback((value: boolean) => {
        setShowDisabled(value);
        setPage(0);
    }, []);

    // Effect para cargar datos
    useEffect(() => {
        fetchConsultations();
    }, [page, rowsPerPage, searchQuery, showDisabled]);

    // Sincronizar datos de handler con estado local
    useEffect(() => {
        setConsultations(consultationDataHandler.consultations);
        setTotalItems(consultationDataHandler.totalConsultations);
    }, [consultationDataHandler.consultations, consultationDataHandler.totalConsultations]);

    return {
        // Estados principales
        consultations,
        detail,
        currentConsultationId,
        loading: loading || consultationDataHandler.loading || consultationRelationsHandler.loading,
        error: error || consultationDataHandler.error || consultationRelationsHandler.error,
        actionLoading: consultationDataHandler.actionLoading || consultationRelationsHandler.actionLoading,

        // Estados de paginación y búsqueda
        page,
        rowsPerPage,
        totalItems,
        searchQuery,
        showDisabled,

        // UI
        openAddDialog,
        openEditDialog,

        // Acciones
        fetchConsultations,
        selectConsultation,
        clearSelection,
        createConsultation, // Esta función ahora está corregida
        updateConsultation,
        deleteConsultation,
        restoreConsultation,

        // Setters
        setPage: handleSetPage,
        setRowsPerPage: handleSetRowsPerPage,
        setSearchQuery: handleSetSearchQuery,
        setShowDisabled: handleSetShowDisabled,

        handleOpenAddDialog,
        handleCloseAddDialog,
        handleOpenEditDialog,
        handleCloseEditDialog,

        setError,
        setConsultations,
        setDetail,
    };
};