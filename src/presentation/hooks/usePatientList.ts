import { useCallback, useMemo } from 'react';
import { Patient } from '@/domain/entities/Patient';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { SelectChangeEvent } from '@mui/material';

interface UsePatientListProps {
    patients: Patient[];
    totalPatients: number;
    page: number;
    rowsPerPage: number;
    searchQuery: string;
    showDisabled: boolean;
    loading: boolean;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rowsPerPage: number) => void;
    onSearchChange: (query: string) => void;
    onToggleDisabled: (showDisabled: boolean) => void;
}

export const usePatientList = ({
    patients,
    totalPatients,
    page,
    rowsPerPage,
    searchQuery,
    showDisabled,
    // loading,
    onPageChange,
    onRowsPerPageChange,
    onSearchChange,
    onToggleDisabled,
}: UsePatientListProps) => {
    
    // Memoized calculations
    const totalPages = useMemo(() => {
        return Math.ceil(totalPatients / rowsPerPage);
    }, [totalPatients, rowsPerPage]);

    const searchPlaceholder = useMemo(() => {
        return showDisabled ? 'Buscar pacientes inactivos...' : 'Buscar pacientes activos...';
    }, [showDisabled]);

    const emptyMessage = useMemo(() => {
        if (searchQuery.trim() !== '') {
            return showDisabled 
                ? 'No se encontraron pacientes inactivos que coincidan con la búsqueda'
                : 'No se encontraron pacientes activos que coincidan con la búsqueda';
        }
        return showDisabled 
            ? 'No hay pacientes inactivos registrados' 
            : 'No hay pacientes activos registrados';
    }, [searchQuery, showDisabled]);

    const listTitle = useMemo(() => {
        const count = totalPatients > 0 ? ` (${totalPatients})` : '';
        return `Lista de Pacientes ${showDisabled ? 'Inactivos' : 'Activos'}${count}`;
    }, [showDisabled, totalPatients]);

    // Event handlers
    const handleChangePage = useCallback((_event: unknown, newPage: number) => {
        onPageChange(newPage - 1); // Material-UI uses 1-based indexing, we use 0-based
    }, [onPageChange]);

    const handleChangeRowsPerPage = useCallback((event: SelectChangeEvent<number>) => {
        const newValue = typeof event.target.value === 'string' 
            ? parseInt(event.target.value, 10) 
            : event.target.value;
        onRowsPerPageChange(newValue);
    }, [onRowsPerPageChange]);

    const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(event.target.value);
    }, [onSearchChange]);

    const handleToggleDisabled = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onToggleDisabled(event.target.checked);
    }, [onToggleDisabled]);

    // Utility functions
    const formatDate = useCallback((dateString: string): string => {
        if (!dateString) return 'No registrada';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
        } catch (error) {
            console.error('Error al formatear la fecha:', error);
            return 'Fecha inválida';
        }
    }, []);

    // Additional computed values
    const hasPatients = useMemo(() => patients.length > 0, [patients.length]);
    
    const currentPageInfo = useMemo(() => {
        if (totalPatients === 0) return 'Sin resultados';
        
        const start = page * rowsPerPage + 1;
        const end = Math.min((page + 1) * rowsPerPage, totalPatients);
        return `Mostrando ${start}-${end} de ${totalPatients} pacientes`;
    }, [page, rowsPerPage, totalPatients]);

    return {
        // Computed values
        totalPages,
        searchPlaceholder,
        emptyMessage,
        listTitle,
        hasPatients,
        currentPageInfo,
        
        // Event handlers
        handleChangePage,
        handleChangeRowsPerPage,
        handleSearchChange,
        handleToggleDisabled,
        
        // Utility functions
        formatDate,
    };
};