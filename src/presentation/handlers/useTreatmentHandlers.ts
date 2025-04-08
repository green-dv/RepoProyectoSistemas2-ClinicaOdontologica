import { useCallback } from 'react';
import debounce from 'lodash/debounce';
import { Treatment, TreatmentDTO } from '@/domain/entities/Treatments';
import { AlertColor } from '@mui/material';
import { 
  fetchTreatments,
  createTreatment,
  updateTreatment,
  deleteTreatment,
  restoreTreatment,
  deleteTreatmentPermanently
} from '@/application/usecases/treatments';

// Definimos una interfaz para el estado que recibirá el hook
interface TreatmentsState {
  treatments: Treatment[];
  open: boolean;
  searchTerm: string;
  newTreatment: TreatmentDTO;
  showDisabled: boolean;
  isLoading: boolean;
  selectedTreatment: Treatment | null;
  snackbar: { message: string; severity: AlertColor } | null;
  
  // Setters
  setTreatments: React.Dispatch<React.SetStateAction<Treatment[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setNewTreatment: React.Dispatch<React.SetStateAction<TreatmentDTO>>;
  setShowDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTreatment: React.Dispatch<React.SetStateAction<Treatment | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<{ message: string; severity: AlertColor } | null>>;
  
  // Métodos auxiliares
  resetForm: () => void;
  showMessage: (message: string, severity: AlertColor) => void;
}

// Creamos una función debounce fuera del componente para que no se recree en cada render
const debouncedFetchTreatments = debounce(async (
  query: string, 
  showDisabled: boolean, 
  setIsLoading: (value: boolean) => void,
  setTreatments: React.Dispatch<React.SetStateAction<Treatment[]>>,
  fetchTreatmentsFunc: (query: string, showDisabled: boolean) => Promise<Treatment[]>
) => {
  setIsLoading(true);
  try {
    const data = await fetchTreatmentsFunc(query, showDisabled);
    setTreatments(data);
  } catch (error) {
    console.log('Error al cargar los Tratamientos', error);
  } finally {
    setIsLoading(false);
  }
}, 300);

export default function useTreatmentHandlers(state: TreatmentsState) {
  const {
    treatments,
    searchTerm,
    selectedTreatment,
    newTreatment,
    showDisabled,
    setTreatments,
    setIsLoading,
    setOpen,
    setSelectedTreatment,
    resetForm,
    showMessage
  } = state;

  const handleSnackbarClose = () => {
    state.setSnackbar(null);
  };

  // Optimizado para evitar recreaciones innecesarias
  const handleFetchTreatments = useCallback(
    (query: string) => {
      debouncedFetchTreatments(
        query, 
        showDisabled, 
        setIsLoading, 
        setTreatments, 
        fetchTreatments
      );
    },
    [showDisabled, setIsLoading, setTreatments]
  );

  const handleOpen = () => {
    setSelectedTreatment(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'precio') {
      const numericValue = parseFloat(value) || 0;
      state.setNewTreatment(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      state.setNewTreatment(prev => ({
        ...prev, 
        [name]: value || ''  
      }));
    }
  };

  const handleEdit = (treatment: Treatment) => {
    state.setNewTreatment({
      nombre: treatment.nombre || '',
      descripcion: treatment.descripcion || '',
      precio: treatment.precio || 0,
    });
    setSelectedTreatment(treatment);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTreatment(id);
      setTreatments((prev) => prev.filter((treatment) => treatment.idtratamiento !== id));
      showMessage('Tratamiento eliminado correctamente', 'success');
    } catch {
      showMessage('Error al eliminar el tratamiento', 'error');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreTreatment(id);
      setTreatments((prev) => prev.filter((treatment) => treatment.idtratamiento !== id));
      showMessage('Tratamiento restaurado correctamente', 'success');
    } catch {
      showMessage('Error al restaurar el Tratamiento', 'error');
    }
  };

  const handleDeletePermanently = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este producto permanentemente? no hay vuelta atras.')) return;
    try {
      await deleteTreatmentPermanently(id);
      showMessage('Tratamiento eliminado permanentemente', 'success');
      handleFetchTreatments(searchTerm);
    } catch {
      showMessage('Error al eliminar el Tratamiento', 'error');
    }
  };

  const handleSubmit = async () => { 
    try {
      // Verificar duplicaditos
      const isDuplicate = treatments.some(
        treatment => 
          treatment.nombre.toLowerCase().trim() === newTreatment.nombre.toLowerCase().trim() && 
          treatment.idtratamiento !== selectedTreatment?.idtratamiento
      );

      if (isDuplicate) {
        showMessage('El tratamiento ya existe', 'error');
        return;
      }

      if (selectedTreatment) {
        const updatedTreatment = await updateTreatment(selectedTreatment.idtratamiento, newTreatment);
        setTreatments(prev =>
          prev.map((t) => t.idtratamiento === updatedTreatment.idtratamiento ? updatedTreatment : t)
        );
        showMessage('Tratamiento actualizado correctamente', 'success');
      } else {
        const addedTreatment = await createTreatment(newTreatment);
        setTreatments((prev) => [...prev, addedTreatment]);
        showMessage('Tratamiento agregado correctamente', 'success');
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
    setTreatments([]); 
    state.setSearchTerm(''); 
  };

  return {
    handleFetchTreatments,
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