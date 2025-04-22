import { useCallback } from 'react';
import debounce from 'lodash/debounce';
import { Habit, HabitDTO } from '@/domain/entities/Habits';
import { AlertColor } from '@mui/material';
import { 
  fetchHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  restoreHabit,
  deleteHabitPermanently
} from '@/application/usecases/habits';

// Definimos una interfaz para el estado que recibirá el hook
interface HabitsState {
  habits: Habit[];
  open: boolean;
  searchTerm: string;
  newHabit: HabitDTO;
  showDisabled: boolean;
  isLoading: boolean;
  selectedHabit: Habit | null;
  snackbar: { message: string; severity: AlertColor } | null;
  
  //Losss Setters
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setNewHabit: React.Dispatch<React.SetStateAction<HabitDTO>>;
  setShowDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedHabit: React.Dispatch<React.SetStateAction<Habit | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<{ message: string; severity: AlertColor } | null>>;
  
  // Métodos auxiliaresss
  resetForm: () => void;
  showMessage: (message: string, severity: AlertColor) => void;
}

//  función debounce fuera del componente para que no se recree en cada render
const debouncedFetchHabits = debounce(async (
  query: string, 
  showDisabled: boolean, 
  setIsLoading: (value: boolean) => void,
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>,
  fetchHabitsFunc: (query: string, showDisabled: boolean) => Promise<Habit[]>
) => {
  setIsLoading(true);
  try {
    const data = await fetchHabitsFunc(query, showDisabled);
    setHabits(data);
  } catch (error) {
    console.log('Error al cargar los habitos', error);
  } finally {
    setIsLoading(false);
  }
}, 300);

export default function useHabitHandlers(state: HabitsState) {
  const {
    habits,
    searchTerm,
    selectedHabit,
    newHabit,
    showDisabled,
    setHabits,
    setIsLoading,
    setOpen,
    setSelectedHabit,
    resetForm,
    showMessage
  } = state;

  const handleSnackbarClose = () => {
    state.setSnackbar(null);
  };

  const handleFetchHabits = useCallback(
    (query: string) => {
      debouncedFetchHabits(
        query, 
        showDisabled, 
        setIsLoading, 
        setHabits, 
        fetchHabits
      );
    },
    [showDisabled, setIsLoading, setHabits]
  );

  const handleOpen = () => {
    setSelectedHabit(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    state.setNewHabit(prev => ({
      ...prev,
      [name]: value || ''
    }));
  };

  const handleEdit = (habit: Habit) => {
    state.setNewHabit({
      habito: habit.habito || ''
    });
    setSelectedHabit(habit);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteHabit(id);
      setHabits((prev) => prev.filter((habit) => habit.idhabito !== id));
      showMessage('Hábito eliminada correctamente', 'success');
    } catch {
      showMessage('Error al eliminar el hábito', 'error');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreHabit(id);
      setHabits((prev) => prev.filter((habit) => habit.idhabito !== id));
      showMessage('Hábito restaurada correctamente', 'success');
    } catch {
      showMessage('Error al restaurar el hábito', 'error');
    }
  };

  const handleDeletePermanently = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este hábito permanentemente? no hay vuelta atras.')) return;
    try {
      await deleteHabitPermanently(id);
      showMessage('Hábito eliminada permanentemente', 'success');
      handleFetchHabits(searchTerm);
    } catch {
      showMessage('Error al eliminar el hábito', 'error');
    }
  };

  const handleSubmit = async () => { 
    try {
      // Verificar duplicaditos
      const isDuplicate = habits.some(
        habit => 
          habit.habito.toLowerCase().trim() === newHabit.habito.toLowerCase().trim()
      );

      if (isDuplicate) {
        showMessage('El tratamiento ya existe', 'error');
        return;
      }

      if (selectedHabit) {
        const updatedHabit = await updateHabit(selectedHabit.idhabito, newHabit);
        setHabits(prev =>
          prev.map((m) => m.idhabito === updatedHabit.idhabito ? updatedHabit : m)
        );
        showMessage('Hábito actualizada correctamente', 'success');
      } else {
        const addedHabit = await createHabit(newHabit);
        setHabits((prev) => [...prev, addedHabit]);
        showMessage('Hábito agregada correctamente', 'success');
      }
      handleFetchHabits(searchTerm);
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
    setHabits([]); 
    state.setSearchTerm(''); 
  };

  return {
    handleFetchHabits,
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