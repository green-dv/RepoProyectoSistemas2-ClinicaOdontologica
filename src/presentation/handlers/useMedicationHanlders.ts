import { useCallback } from 'react';
import debounce from 'lodash/debounce';
import { Medication, MedicationDTO } from '@/domain/entities/Medications';
import { AlertColor } from '@mui/material';
import { 
  fetchMedications,
  createMedications,
  updateMedications,
  deleteMedication,
  restoreMedications,
  deleteMedicationPermanently
} from '@/application/usecases/medications';

// Definimos una interfaz para el estado que recibirá el hook
interface MedicationsState {
  medications: Medication[];
  open: boolean;
  searchTerm: string;
  newMedication: MedicationDTO;
  showDisabled: boolean;
  isLoading: boolean;
  selectedMedication: Medication | null;
  snackbar: { message: string; severity: AlertColor } | null;
  
  //Losss Setters
  setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setNewMedication: React.Dispatch<React.SetStateAction<MedicationDTO>>;
  setShowDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMedication: React.Dispatch<React.SetStateAction<Medication | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<{ message: string; severity: AlertColor } | null>>;
  
  // Métodos auxiliaresss
  resetForm: () => void;
  showMessage: (message: string, severity: AlertColor) => void;
}

//  función debounce fuera del componente para que no se recree en cada render
const debouncedFetchMedications = debounce(async (
  query: string, 
  showDisabled: boolean, 
  setIsLoading: (value: boolean) => void,
  setMedications: React.Dispatch<React.SetStateAction<Medication[]>>,
  fetchMedicationsFunc: (query: string, showDisabled: boolean) => Promise<Medication[]>
) => {
  setIsLoading(true);
  try {
    const data = await fetchMedicationsFunc(query, showDisabled);
    setMedications(data);
  } catch (error) {
    console.log('Error al cargar las medicaciones', error);
  } finally {
    setIsLoading(false);
  }
}, 300);

export default function useMedicationHandlers(state: MedicationsState) {
  const {
    medications,
    searchTerm,
    selectedMedication,
    newMedication,
    showDisabled,
    setMedications,
    setIsLoading,
    setOpen,
    setSelectedMedication,
    resetForm,
    showMessage
  } = state;

  const handleSnackbarClose = () => {
    state.setSnackbar(null);
  };

  const handleFetchMedications = useCallback(
    (query: string) => {
      debouncedFetchMedications(
        query, 
        showDisabled, 
        setIsLoading, 
        setMedications, 
        fetchMedications
      );
    },
    [showDisabled, setIsLoading, setMedications]
  );

  const handleOpen = () => {
    setSelectedMedication(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    state.setNewMedication(prev => ({
      ...prev,
      [name]: value || ''
    }));
  };

  const handleEdit = (medication: Medication) => {
    state.setNewMedication({
      medicacion: medication.medicacion || ''
    });
    setSelectedMedication(medication);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMedication(id);
      setMedications((prev) => prev.filter((medication) => medication.idmedicacion !== id));
      showMessage('Medicación eliminada correctamente', 'success');
    } catch {
      showMessage('Error al eliminar la medicación', 'error');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreMedications(id);
      setMedications((prev) => prev.filter((medication) => medication.idmedicacion !== id));
      showMessage('Medicación restaurada correctamente', 'success');
    } catch {
      showMessage('Error al restaurar la medicación', 'error');
    }
  };

  const handleDeletePermanently = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar esta medicación permanentemente? no hay vuelta atras.')) return;
    try {
      await deleteMedicationPermanently(id);
      showMessage('Medicación eliminada permanentemente', 'success');
      handleFetchMedications(searchTerm);
    } catch {
      showMessage('Error al eliminar la medicación', 'error');
    }
  };

  const handleSubmit = async () => { 
    try {
      // Verificar duplicaditos
      const isDuplicate = medications.some(
        medication => 
          medication.medicacion.toLowerCase().trim() === newMedication.medicacion.toLowerCase().trim()
      );

      if (isDuplicate) {
        showMessage('El tratamiento ya existe', 'error');
        return;
      }

      if (selectedMedication) {
        const updatedMedication = await updateMedications(selectedMedication.idmedicacion, newMedication);
        setMedications(prev =>
          prev.map((m) => m.idmedicacion === updatedMedication.idmedicacion ? updatedMedication : m)
        );
        showMessage('Medicación actualizada correctamente', 'success');
      } else {
        const addedMedication = await createMedications(newMedication);
        setMedications((prev) => [...prev, addedMedication]);
        showMessage('Medicación agregada correctamente', 'success');
      }
      handleFetchMedications(searchTerm);
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
    setMedications([]); 
    state.setSearchTerm(''); 
  };

  return {
    handleFetchMedications,
    handleOpen,
    handleClose,
    handleChange,
    handleEdit,
    handleDelete,
    handleRestore,
    handleDeletePermanently,
    handleSubmit,
    toggleView,
    handleSnackbarClose
  };
}