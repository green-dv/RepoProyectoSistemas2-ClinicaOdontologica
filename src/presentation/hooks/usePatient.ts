import { useState, useEffect, useCallback } from 'react';
import { Patient } from '@/domain/entities/Patient';
import { PatientResponse } from '@/domain/dto/patient';

export interface NotificationType {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export const usePatientsPage = () => {
 const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(searchQuery);
  const [showDisabled, setShowDisabled] = useState<boolean>(false);
    
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [formDialogOpen, setFormDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const [restoreDialogOpen, setRestoreDialogOpen] = useState<boolean>(false);
  const [deletePermanentlyDialogOpen, setDeletePermanentlyDialogOpen] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationType>({
      open: false,
      message: '',
       type: 'info',
  });

  

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    setPage(0);
  }, [showDisabled, debouncedSearchQuery]);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: String(page + 1), 
        limit: String(rowsPerPage),
      });

      if (debouncedSearchQuery) {
        queryParams.append('search', debouncedSearchQuery);
      }

      // Choose endpoint based on showDisabled state
      const endpoint = showDisabled 
        ? `/api/patients/disable?${queryParams}`
        : `/api/patients?${queryParams}`;

      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error('Error al cargar los pacientes');
      }
      
      const data: PatientResponse = await response.json();
      
      setPatients(data.data);
      setTotalPatients(data.pagination.totalItems);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, debouncedSearchQuery, showDisabled]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Dialog handlers
  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setViewDialogOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormDialogOpen(true);
  };

  const handleNewPatient = () => {
    setSelectedPatient(null);
    setFormDialogOpen(true);
  };

  const handleDeletePatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setDeleteDialogOpen(true);
  };

  const handleRestorePatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setRestoreDialogOpen(true);
  };

  const handleDeletePermanently = (patient: Patient) => {
    setSelectedPatient(patient);
    setDeletePermanentlyDialogOpen(true);
  };

  const handleConfirmDelete = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete patient');
      }
      
      await fetchPatients();
      
      const patientName = selectedPatient 
        ? `${selectedPatient.nombres} ${selectedPatient.apellidos}` 
        : 'Paciente';
      
      setNotification({
        open: true,
        message: showDisabled 
          ? `${patientName} habilitado con éxito`
          : `${patientName} deshabilitado con éxito`,
        type: 'success'
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting patient:', error);
      
      setNotification({
        open: true,
        message: showDisabled 
          ? 'Error al habilitar el paciente'
          : 'Error al deshabilitar el paciente',
        type: 'error'
      });
      
      return false;
    }
  };

   const handleConfirmRestore = async (): Promise<boolean> => {
    if (!selectedPatient) return false;
    
    try {
      setActionLoading(true);
      const response = await fetch(`/api/patients/${selectedPatient.idpaciente}/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to restore patient');
      }
      
      await fetchPatients();
      
      const patientName = `${selectedPatient.nombres} ${selectedPatient.apellidos}`;
      
      setNotification({
        open: true,
        message: `${patientName} restaurado con éxito`,
        type: 'success'
      });
      
      setRestoreDialogOpen(false);
      setSelectedPatient(null);
      
      return true;
    } catch (error) {
      console.error('Error restoring patient:', error);
      
      setNotification({
        open: true,
        message: 'Error al restaurar el paciente',
        type: 'error'
      });
      
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Nuevo handler para confirmar eliminación permanente
  const handleConfirmDeletePermanently = async (): Promise<boolean> => {
    if (!selectedPatient) return false;
    
    try {
      setActionLoading(true);
      const response = await fetch(`/api/patients/${selectedPatient.idpaciente}?permanent=true`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete patient permanently');
      }
      
      await fetchPatients();
      
      const patientName = `${selectedPatient.nombres} ${selectedPatient.apellidos}`;
      
      setNotification({
        open: true,
        message: `${patientName} eliminado permanentemente`,
        type: 'success'
      });
      
      setDeletePermanentlyDialogOpen(false);
      setSelectedPatient(null);
      
      return true;
    } catch (error) {
      console.error('Error deleting patient permanently:', error);
      
      setNotification({
        open: true,
        message: 'Error al eliminar el paciente permanentemente',
        type: 'error'
      });
      
      return false;
    } finally {
      setActionLoading(false);
    }
  };


  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
  };

  const handleCloseFormDialog = () => {
    setFormDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleCloseRestoreDialog = () => {
    setRestoreDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleCloseDeletePermanentlyDialog = () => {
    setDeletePermanentlyDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleFormSuccess = () => {
    fetchPatients();
    
    setNotification({
      open: true,
      message: selectedPatient?.idpaciente 
        ? 'Paciente actualizado con éxito' 
        : 'Nuevo paciente creado con éxito',
      type: 'success'
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleEditFromView = () => {
    setViewDialogOpen(false);
    setFormDialogOpen(true);
  };

  const handleRefresh = () => {
    fetchPatients();
  };

  const handleToggleDisabled = (disabled: boolean) => {
    setShowDisabled(disabled);
  };

  return {
    // States
    patients,
    loading,
    error,
    totalPatients,
    page,
    rowsPerPage,
    searchQuery,
    showDisabled,
    selectedPatient,
    viewDialogOpen,
    formDialogOpen,
    deleteDialogOpen,
    restoreDialogOpen,
    deletePermanentlyDialogOpen,
    actionLoading,
    notification,
    
    // Handlers
    handleViewPatient,
    handleEditPatient,
    handleNewPatient,
    handleDeletePatient,
    handleRestorePatient,
    handleDeletePermanently,
    handleConfirmDelete,
    handleConfirmRestore,
    handleConfirmDeletePermanently,
    handleCloseViewDialog,
    handleCloseFormDialog,
    handleCloseDeleteDialog,
    handleCloseRestoreDialog,
    handleCloseDeletePermanentlyDialog,
    handleFormSuccess,
    handleCloseNotification,
    handleSearchChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleEditFromView,
    handleRefresh,
    handleToggleDisabled,
    fetchPatients
  };
};