import { useState, useEffect, useCallback } from 'react';
import { Patient } from '@/domain/entities/Patient';

interface PatientsResponse {
  patients: Patient[];
  totalPatients: number;
  currentPage: number;
  totalPages: number;
}

interface UsePatientsDataProps {
  initialPage?: number;
  initialRowsPerPage?: number;
  initialSearchQuery?: string;
  initialShowDisabled?: boolean;
}

export const usePatientsData = ({
  initialPage = 0,
  initialRowsPerPage = 10,
  initialSearchQuery = '',
  initialShowDisabled = false,
}: UsePatientsDataProps = {}) => {
  // State management
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [page, setPage] = useState<number>(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState<number>(initialRowsPerPage);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [showDisabled, setShowDisabled] = useState<boolean>(initialShowDisabled);

  const [actionLoading, setActionLoading] = useState<boolean>(false);
  // Fetch patients function
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
      });

      if (searchQuery.trim()) {
        queryParams.append('search', searchQuery.trim());
      }

      const endpoint = showDisabled 
        ? `/api/patients/disable?${queryParams.toString()}`
        : `/api/patients?${queryParams.toString()}`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PatientsResponse = await response.json();
      
      setPatients(data.patients || []);
      setTotalPatients(data.totalPatients || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar pacientes';
      setError(`Error al cargar pacientes: ${errorMessage}`);
      setPatients([]);
      setTotalPatients(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery, showDisabled]);

  const handleRestorePatient = useCallback(async (patient: Patient): Promise<boolean> => {
    setActionLoading(true);
    setError(null);
    try {
      const endpoint = `/api/patients/${patient.idpaciente}/restore`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchPatients();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al restaurar paciente';
      setError(`Error al restaurar paciente: ${errorMessage}`);
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [fetchPatients]);

  const handleDeletePermanently = useCallback(async (patient: Patient): Promise<boolean> => {
    setActionLoading(true);
    setError(null);
    try {
      const endpoint = `/api/patients/${patient.idpaciente}?permanent=true`;
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchPatients();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar paciente';
      setError(`Error al eliminar paciente: ${errorMessage}`);
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [fetchPatients]);

  useEffect(() => {
    if (page !== 0) {
      setPage(0);
    }
  }, [searchQuery, showDisabled]);

  // Event handlers
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0); 
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleToggleDisabled = useCallback((disabled: boolean) => {
    setShowDisabled(disabled);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchPatients();
  }, [fetchPatients]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    patients,
    loading,
    error,
    totalPatients,
    page,
    rowsPerPage,
    searchQuery,
    showDisabled,
    actionLoading,

    // Actions
    handlePageChange,
    handleRowsPerPageChange,
    handleSearchChange,
    handleToggleDisabled,
    handleRefresh,
    clearError,
    handleRestorePatient,
    handleDeletePermanently,
    
    // Manual fetch function
    fetchPatients,
  };
};