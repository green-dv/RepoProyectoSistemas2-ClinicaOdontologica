import { useState, useEffect, useCallback } from 'react';
import { Patient } from '@/domain/entities/Patient';
import { PatientResponse } from '@/domain/dto/patient';

export interface NotificationType {
  open: boolean;
  message: string;
  type: 'success' | 'error';
}

export const usePatientsPage = () => {
  // Data state
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(searchQuery);
    
  // Dialog control state
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [formDialogOpen, setFormDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  
  // Notification state
  const [notification, setNotification] = useState<NotificationType>({
    open: false,
    message: '',
    type: 'success'
  });

  // Set up debounce for search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Fetch patients data from API
  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: String(page + 1), // API expects 1-based index
        limit: String(rowsPerPage),
      });

      if (debouncedSearchQuery) {
        queryParams.append('search', debouncedSearchQuery);
      }

      const response = await fetch(`/api/patients?${queryParams}`);
      
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
  }, [page, rowsPerPage, debouncedSearchQuery]);

  // Load patients on initial render and when dependencies change
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

  const handleConfirmDelete = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete patient');
      }
      
      // Refresh the patient list
      await fetchPatients();
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Paciente eliminado con éxito',
        type: 'success'
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting patient:', error);
      
      // Show error notification
      setNotification({
        open: true,
        message: 'Error al eliminar el paciente',
        type: 'error'
      });
      
      return false;
    }
  };

  // Close dialog handlers
  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    // Don't reset selected patient immediately in case we want to edit
  };

  const handleCloseFormDialog = () => {
    setFormDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedPatient(null);
  };

  // Handle form submission success
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

  // Other handlers
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(0); // Reset to first page when search changes
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page when rows per page changes
  };

  // View to Edit transition
  const handleEditFromView = () => {
    setViewDialogOpen(false);
    setFormDialogOpen(true);
  };

  // Manual refresh handler
  const handleRefresh = () => {
    fetchPatients();
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
    selectedPatient,
    viewDialogOpen,
    formDialogOpen,
    deleteDialogOpen,
    notification,
    
    // Handlers
    handleViewPatient,
    handleEditPatient,
    handleNewPatient,
    handleDeletePatient,
    handleConfirmDelete,
    handleCloseViewDialog,
    handleCloseFormDialog,
    handleCloseDeleteDialog,
    handleFormSuccess,
    handleCloseNotification,
    handleSearchChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleEditFromView,
    handleRefresh,
    fetchPatients
  };
};