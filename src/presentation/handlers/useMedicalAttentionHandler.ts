import { useCallback } from 'react';
import debounce from 'lodash/debounce';
import { MedicalAttention, MedicalAttentionDTO } from '@/domain/entities/MedicalAttentions';
import { AlertColor } from '@mui/material';
import { 
  fetchMedicalAttentions,
  createMedicalAttention,
  updateMedicalAttention,
  deleteMedicalAttention,
  restoreMedicalAttention,
  deleteMedicalAttentionPermanently
} from '@/application/usecases/attentions';

// Definimos una interfaz para el estado que recibirá el hook
interface MedicalAttentionsState {
  medicalAttentions: MedicalAttention[];
  open: boolean;
  searchTerm: string;
  newMedicalAttention: MedicalAttentionDTO;
  showDisabled: boolean;
  isLoading: boolean;
  selectedMedicalAttention: MedicalAttention | null;
  snackbar: { message: string; severity: AlertColor } | null;
  
  //Losss Setters
  setMedicalAttentions: React.Dispatch<React.SetStateAction<MedicalAttention[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setNewMedicalAttention: React.Dispatch<React.SetStateAction<MedicalAttentionDTO>>;
  setShowDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMedicalAttention: React.Dispatch<React.SetStateAction<MedicalAttention | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<{ message: string; severity: AlertColor } | null>>;
  
  // Métodos auxiliaresss
  resetForm: () => void;
  showMessage: (message: string, severity: AlertColor) => void;
}

//  función debounce fuera del componente para que no se recree en cada render
const debouncedFetchMedicalAttentions = debounce(async (
  query: string, 
  showDisabled: boolean, 
  setIsLoading: (value: boolean) => void,
  setMedicalAttentions: React.Dispatch<React.SetStateAction<MedicalAttention[]>>,
  fetchMedicalAttentionsFunc: (query: string, showDisabled: boolean) => Promise<MedicalAttention[]>
) => {
  setIsLoading(true);
  try {
    const data = await fetchMedicalAttentionsFunc(query, showDisabled);
    setMedicalAttentions(data);
  } catch (error) {
    console.log('Error al cargar las atenciones médicas', error);
  } finally {
    setIsLoading(false);
  }
}, 300);

export default function useMedicalAttentionHandlers(state: MedicalAttentionsState) {
  const {
    medicalAttentions,
    searchTerm,
    selectedMedicalAttention,
    newMedicalAttention,
    showDisabled,
    setMedicalAttentions,
    setIsLoading,
    setOpen,
    setSelectedMedicalAttention,
    resetForm,
    showMessage
  } = state;

  const handleSnackbarClose = () => {
    state.setSnackbar(null);
  };

  const handleFetchMedicalAttentions = useCallback(
    (query: string) => {
      debouncedFetchMedicalAttentions(
        query, 
        showDisabled, 
        setIsLoading, 
        setMedicalAttentions, 
        fetchMedicalAttentions
      );
    },
    [showDisabled, setIsLoading, setMedicalAttentions]
  );

  const handleOpen = () => {
    setSelectedMedicalAttention(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    state.setNewMedicalAttention(prev => ({
      ...prev,
      [name]: value || ''
    }));
  };

  const handleEdit = (medicalAttention: MedicalAttention) => {
    state.setNewMedicalAttention({
      atencion: medicalAttention.atencion || ''
    });
    setSelectedMedicalAttention(medicalAttention);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMedicalAttention(id);
      setMedicalAttentions((prev) => prev.filter((medicalAttention) => medicalAttention.idatencionmedica !== id));
      showMessage('Atención médica eliminada correctamente', 'success');
    } catch {
      showMessage('Error al eliminar la atención médica', 'error');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreMedicalAttention(id);
      setMedicalAttentions((prev) => prev.filter((medicalAttention) => medicalAttention.idatencionmedica !== id));
      showMessage('Atención médica restaurada correctamente', 'success');
    } catch {
      showMessage('Error al restaurar la atención médica', 'error');
    }
  };

  const handleDeletePermanently = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar esta atención médica permanentemente? no hay vuelta atras.')) return;
    try {
      await deleteMedicalAttentionPermanently(id);
      showMessage('Atención médica eliminada permanentemente', 'success');
      handleFetchMedicalAttentions(searchTerm);
    } catch {
      showMessage('Error al eliminar la atención médica', 'error');
    }
  };

  const handleSubmit = async () => { 
    try {
      // Verificar duplicaditos
      const isDuplicate = medicalAttentions.some(
        medicalAttention => 
          medicalAttention.atencion.toLowerCase().trim() === newMedicalAttention.atencion.toLowerCase().trim()
      );

      if (isDuplicate) {
        showMessage('El tratamiento ya existe', 'error');
        return;
      }

      if (selectedMedicalAttention) {
        const updatedMedicalAttention = await updateMedicalAttention(selectedMedicalAttention.idatencionmedica, newMedicalAttention);
        setMedicalAttentions(prev =>
          prev.map((m) => m.idatencionmedica === updatedMedicalAttention.idatencionmedica ? updatedMedicalAttention : m)
        );
        showMessage('Atención médica actualizada correctamente', 'success');
      } else {
        const addedMedicalAttention = await createMedicalAttention(newMedicalAttention);
        setMedicalAttentions((prev) => [...prev, addedMedicalAttention]);
        showMessage('Atención médica agregada correctamente', 'success');
      }
      handleFetchMedicalAttentions(searchTerm);
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
    setMedicalAttentions([]); 
    state.setSearchTerm(''); 
  };

  return {
    handleFetchMedicalAttentions,
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