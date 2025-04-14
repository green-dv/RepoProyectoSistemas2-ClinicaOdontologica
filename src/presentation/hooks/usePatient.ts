import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { Patient, PatientDTO } from '@/domain/entities/Patient';
import { AlertColor } from '@mui/material';
import { fetchPatients } from '@/application/usecases/patients';

export interface SnackbarMessage {
  message: string;
  severity: AlertColor;
}

export interface PatientState {
  patients: Patient[];
  open: boolean;
  searchTerm: string;
  newPatient: PatientDTO;
  showDisabled: boolean;
  isLoading: boolean;
  selectedPatient: Patient | null;
  snackbar: SnackbarMessage | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  
  // Setters
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setNewPatient: React.Dispatch<React.SetStateAction<PatientDTO>>;
  setShowDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPatient: React.Dispatch<React.SetStateAction<Patient | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarMessage | null>>;
  setPagination: React.Dispatch<React.SetStateAction<{
    page: number;
    pageSize: number;
    total: number;
  }>>;
  
  resetForm: () => void;
  showMessage: (message: string, severity: AlertColor) => void;
  fetchPatientsWithFilters: (query?: string, page?: number, pageSize?: number) => void;
}

export default function usePatients(): PatientState {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newPatient, setNewPatient] = useState<PatientDTO>({
    nombres: '',
    apellidos: '',
    direccion: '',
    telefonodomicilio: null,
    telefonopersonal: '',
    lugarnacimiento: null,
    fechanacimiento: '',
    sexo: true,
    estadocivil: 'Soltero',
    ocupacion: '',
    aseguradora: null,
  });
  const [showDisabled, setShowDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
    total: 0
  });

  const resetForm = () => {
    setNewPatient({
      nombres: '',
      apellidos: '',
      direccion: '',
      telefonodomicilio: null,
      telefonopersonal: '',
      lugarnacimiento: null,
      fechanacimiento: '',
      sexo: true,
      estadocivil: 'Soltero',
      ocupacion: '',
      aseguradora: null,
    });
    setSelectedPatient(null);
  };

  const showMessage = (message: string, severity: AlertColor) => {
    setSnackbar({ message, severity });
  };

  // Create a debounced function for fetching patients
  const debouncedFetchPatients = useCallback(
    debounce(async (
      query: string = '', 
      page: number = 1, 
      pageSize: number = 10
    ) => {
      setIsLoading(true);
      try {
        const response = await fetchPatients(query, showDisabled, page, pageSize);
        setPatients(response.data);
        setPagination({
          page: response.pagination.page - 1, // Convert to 0-based for MUI
          pageSize: response.pagination.limit,
          total: response.pagination.totalItems
        });
      } catch (error) {
        console.error('Error al cargar los pacientes:', error);
        showMessage('Error al cargar los pacientes', 'error');
      } finally {
        setIsLoading(false);
      }
    }, 300), // 300ms debounce delay
    [showDisabled] // Re-create debounced function when showDisabled changes
  );

  // Exposed method to trigger the fetch with filters
  const fetchPatientsWithFilters = useCallback((
    query: string = searchTerm,
    page: number = 1,
    pageSize: number = 10
  ) => {
    debouncedFetchPatients(query, page, pageSize);
  }, [debouncedFetchPatients, searchTerm]);

  // Effect to fetch patients when searchTerm or showDisabled changes
  useEffect(() => {
    fetchPatientsWithFilters();
  }, [searchTerm, showDisabled, fetchPatientsWithFilters]);

  return {
    // Estados
    patients,
    open,
    searchTerm,
    newPatient,
    showDisabled,
    isLoading,
    selectedPatient,
    snackbar,
    pagination,
    
    // Setters
    setPatients,
    setOpen,
    setSearchTerm,
    setNewPatient,
    setShowDisabled,
    setIsLoading,
    setSelectedPatient,
    setSnackbar,
    setPagination,
    
    resetForm,
    showMessage,
    fetchPatientsWithFilters
  };
}