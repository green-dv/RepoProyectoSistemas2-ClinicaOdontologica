import { useState } from 'react';
import { Habit, HabitDTO } from '@/domain/entities/Habits';
import { AlertColor } from '@mui/material';

export interface SnackbarMessage {
  message: string;
  severity: AlertColor;
}

export interface HabitsState {
  habits: Habit[];
  open: boolean;
  searchTerm: string;
  newHabit: HabitDTO;
  showDisabled: boolean;
  isLoading: boolean;
  selectedHabit: Habit | null;
  snackbar: SnackbarMessage | null;
  
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setNewHabit: React.Dispatch<React.SetStateAction<HabitDTO>>;
  setShowDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedHabit: React.Dispatch<React.SetStateAction<Habit | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarMessage | null>>;
  
  resetForm: () => void;
  showMessage: (message: string, severity: AlertColor) => void;
}

export default function useHabits(): HabitsState {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newHabit, setNewHabit] = useState<HabitDTO>({
    habito: '',
  });
  const [showDisabled, setShowDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  const resetForm = () => {
    setNewHabit({
      habito: '',
    });
    setSelectedHabit(null);
  };

  const showMessage = (message: string, severity: AlertColor) => {
    setSnackbar({ message, severity });
  };

  return {
    habits,
    open,
    searchTerm,
    newHabit,
    showDisabled,
    isLoading,
    selectedHabit,
    snackbar,
    
    setHabits,
    setOpen,
    setSearchTerm,
    setNewHabit,
    setShowDisabled,
    setIsLoading,
    setSelectedHabit,
    setSnackbar,
    
    resetForm,
    showMessage
  };
}