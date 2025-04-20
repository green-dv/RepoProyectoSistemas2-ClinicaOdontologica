import { useCallback } from 'react';
import debounce from 'lodash/debounce';
import { Illness, IllnessDTO } from '@/domain/entities/Illnesses';
import { AlertColor } from '@mui/material';
import { 
  fetchIllnesses,
  createIllness,
  updateIllness,
  deleteIllness,
  restoreIllness,
  deleteIllnessPermanently
} from '@/application/usecases/illnesses';

// Definimos una interfaz para el estado que recibirá el hook
interface IllnessesState {
  illnesses: Illness[];
  open: boolean;
  searchTerm: string;
  newIllness: IllnessDTO;
  showDisabled: boolean;
  isLoading: boolean;
  selectedIllness: Illness | null;
  snackbar: { message: string; severity: AlertColor } | null;
  
  //Losss Setters
  setIllnesses: React.Dispatch<React.SetStateAction<Illness[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setNewIllness: React.Dispatch<React.SetStateAction<IllnessDTO>>;
  setShowDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIllness: React.Dispatch<React.SetStateAction<Illness | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<{ message: string; severity: AlertColor } | null>>;
  
  // Métodos auxiliaresss
  resetForm: () => void;
  showMessage: (message: string, severity: AlertColor) => void;
}

//  función debounce fuera del componente para que no se recree en cada render
const debouncedFetchIllnesses = debounce(async (
  query: string, 
  showDisabled: boolean, 
  setIsLoading: (value: boolean) => void,
  setIllnesses: React.Dispatch<React.SetStateAction<Illness[]>>,
  fetchIllnessesFunc: (query: string, showDisabled: boolean) => Promise<Illness[]>
) => {
  setIsLoading(true);
  try {
    const data = await fetchIllnessesFunc(query, showDisabled);
    setIllnesses(data);
  } catch (error) {
    console.log('Error al cargar las enfermedades', error);
  } finally {
    setIsLoading(false);
  }
}, 300);

export default function useIllnessHandlers(state: IllnessesState) {
  const {
    illnesses,
    searchTerm,
    selectedIllness,
    newIllness,
    showDisabled,
    setIllnesses,
    setIsLoading,
    setOpen,
    setSelectedIllness,
    resetForm,
    showMessage
  } = state;

  const handleSnackbarClose = () => {
    state.setSnackbar(null);
  };

  const handleFetchIllnesses = useCallback(
    (query: string) => {
      debouncedFetchIllnesses(
        query, 
        showDisabled, 
        setIsLoading, 
        setIllnesses, 
        fetchIllnesses
      );
    },
    [showDisabled, setIsLoading, setIllnesses]
  );

  const handleOpen = () => {
    setSelectedIllness(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    state.setNewIllness(prev => ({
      ...prev,
      [name]: value || ''
    }));
  };

  const handleEdit = (illness: Illness) => {
    state.setNewIllness({
      enfermedad: illness.enfermedad || ''
    });
    setSelectedIllness(illness);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteIllness(id);
      setIllnesses((prev) => prev.filter((illness) => illness.idenfermedad !== id));
      showMessage('Hábito eliminada correctamente', 'success');
    } catch {
      showMessage('Error al eliminar el hábito', 'error');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreIllness(id);
      setIllnesses((prev) => prev.filter((illness) => illness.idenfermedad !== id));
      showMessage('Hábito restaurada correctamente', 'success');
    } catch {
      showMessage('Error al restaurar el hábito', 'error');
    }
  };

  const handleDeletePermanently = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este hábito permanentemente? no hay vuelta atras.')) return;
    try {
      await deleteIllnessPermanently(id);
      showMessage('Hábito eliminada permanentemente', 'success');
      handleFetchIllnesses(searchTerm);
    } catch {
      showMessage('Error al eliminar el hábito', 'error');
    }
  };

  const handleSubmit = async () => { 
    try {
      // Verificar duplicaditos
      const isDuplicate = illnesses.some(
        illness => 
          illness.enfermedad.toLowerCase().trim() === newIllness.enfermedad.toLowerCase().trim()
      );

      if (isDuplicate) {
        showMessage('El tratamiento ya existe', 'error');
        return;
      }

      if (selectedIllness) {
        const updatedIllness = await updateIllness(selectedIllness.idenfermedad, newIllness);
        setIllnesses(prev =>
          prev.map((m) => m.idenfermedad === updatedIllness.idenfermedad ? updatedIllness : m)
        );
        showMessage('Hábito actualizada correctamente', 'success');
      } else {
        const addedIllness = await createIllness(newIllness);
        setIllnesses((prev) => [...prev, addedIllness]);
        showMessage('Hábito agregada correctamente', 'success');
      }
      handleFetchIllnesses(searchTerm);
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
    setIllnesses([]); 
    state.setSearchTerm(''); 
  };

  return {
    handleFetchIllnesses,
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