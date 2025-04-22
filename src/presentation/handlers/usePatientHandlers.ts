import { useCallback } from 'react';
import debounce from 'lodash/debounce';
import { Patient, PatientDTO } from '@/domain/entities/Patient';
import { AlertColor } from '@mui/material';
import { 
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
    restorePatient,
    deletePatientPermanently
} from '@/application/usecases/patients';


interface PatientsState {
  patients: Patient[];
  open: boolean;
  searchTerm: string;
  newPatient: PatientDTO;
  showDisabled: boolean;
  isLoading: boolean;
  selectedPatient: Patient | null;
  snackbar: { message: string; severity: AlertColor } | null;
  
  // Setters
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setNewPatient: React.Dispatch<React.SetStateAction<PatientDTO>>;
  setShowDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPatient: React.Dispatch<React.SetStateAction<Patient | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<{ message: string; severity: AlertColor } | null>>;
  
  // auxxs
  resetForm: () => void;
  showMessage: (message: string, severity: AlertColor) => void;
}

// filtro debouce
const debouncedFetchPatients = debounce(async (
  query: string, 
  showDisabled: boolean, 
  setIsLoading: (value: boolean) => void,
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>,
  fetchPatientsFunc: (query: string, showDisabled: boolean) => Promise<Patient[]>
) => {
  setIsLoading(true);
  try {
    const data = await fetchPatientsFunc(query, showDisabled);
    setPatients(data);
  } catch (error) {
    console.log('Error al cargar los Pacientes', error);
  } finally {
    setIsLoading(false);
  }
}, 300);

export default function usePatientHandlers(state: PatientsState) {
  const {
    patients,
    searchTerm,
    selectedPatient,
    newPatient,
    showDisabled,
    setPatients,
    setIsLoading,
    setOpen,
    setSelectedPatient,
    resetForm,
    showMessage
  } = state;

  const handleSnackbarClose = () => {
    state.setSnackbar(null);
  };

  const handleFetchPatients = useCallback(
    (query: string) => {
      debouncedFetchPatients(
        query, 
        showDisabled, 
        setIsLoading, 
        setPatients, 
        fetchPatients
      );
    },
    [showDisabled, setIsLoading, setPatients]
  );

  const handleOpen = () => {
    setSelectedPatient(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    state.setNewPatient((prev) => ({ ...prev, [name as string]: value }));
  };

  // Para el genero pishe bool
  const handleBooleanChange = (name: keyof PatientDTO) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    state.setNewPatient((prev) => ({ ...prev, [name]: checked }));
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    state.setNewPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (patient: Patient) => {
    state.setNewPatient({
        nombres: patient.nombres || '',
        apellidos: patient.apellidos || '',
        direccion: patient.direccion || '',
        telefonodomicilio: patient.telefonodomicilio || null,
        telefonopersonal: patient.telefonopersonal || '',
        lugarnacimiento: patient.lugarnacimiento || null,
        fechanacimiento: patient.fechanacimiento || '',
        sexo: patient.sexo || true,
        estadocivil: patient.estadocivil || '',
        ocupacion: patient.ocupacion || '',
        aseguradora: patient.aseguradora || null,
    });
    setSelectedPatient(patient);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePatient(id);
      setPatients((prev) => prev.filter((patient) => patient.idpaciente !== id));
      showMessage('Paciente eliminado correctamente', 'success');
    } catch {
      showMessage('Error al eliminar el paciente', 'error');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restorePatient(id);
      setPatients((prev) => prev.filter((patient) => patient.idpaciente !== id));
      showMessage('Paciente restaurado correctamente', 'success');
    } catch {
      showMessage('Error al restaurar el paciente', 'error');
    }
  };

  const handleDeletePermanently = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este paciente permanentemente? no hay vuelta atras.')) return;
    try {
      await deletePatientPermanently(id);
      showMessage('Paciente eliminado permanentemente', 'success');
      handleFetchPatients(searchTerm);
    } catch {
      showMessage('Error al eliminar el paciente', 'error');
    }
  };

  const handleSubmit = async () => { 
    try {
      // Verificar duplicaditos
      const isDuplicate = patients.some(
        patient => 
          patient.nombres.toLowerCase().trim() === newPatient.nombres.toLowerCase().trim() && 
          patient.idpaciente !== selectedPatient?.idpaciente
      );

      if (isDuplicate) {
        showMessage('El paciente ya esta registrado', 'error');
        return;
      }

      if (selectedPatient) {
        const updatedPatient = await updatePatient(selectedPatient.idpaciente, newPatient);
        setPatients(prev =>
          prev.map((p) => p.idpaciente === updatedPatient.idpaciente ? updatedPatient : p)
        );
        showMessage('Paciente actualizado correctamente', 'success');
      } else {
        const addedPatient = await createPatient(newPatient);
        setPatients((prev) => [...prev, addedPatient]);
        showMessage('Paciente agregado correctamente', 'success');
      }
      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        showMessage(error.message, 'error');
      } else {
        showMessage('Ocurrió un error inesperado', 'error');
      }
    }
  };

  const toggleView = () => {
    state.setShowDisabled((prev) => !prev);
    setPatients([]); 
    state.setSearchTerm(''); 
  };

  return {
    handleFetchPatients,
    handleOpen,
    handleClose,
    handleChange,
    handleBooleanChange,
    handleDateChange,
    handleEdit,
    handleDelete,
    handleRestore,
    handleDeletePermanently,
    handleSubmit,
    toggleView,
    handleSnackbarClose
  };
}