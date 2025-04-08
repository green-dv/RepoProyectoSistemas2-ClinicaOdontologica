import { useState } from 'react';
import { Treatment, TreatmentDTO } from '@/domain/entities/Treatments';
import { AlertColor } from '@mui/material';

// Definimos el tipo para el mensaje de snackbar
export interface SnackbarMessage {
  message: string;
  severity: AlertColor;
}

// Esta interfaz debe coincidir con la definida en useTreatmentHandlers.ts
export interface TreatmentsState {
  treatments: Treatment[];
  open: boolean;
  searchTerm: string;
  newTreatment: TreatmentDTO;
  showDisabled: boolean;
  isLoading: boolean;
  selectedTreatment: Treatment | null;
  snackbar: SnackbarMessage | null;
  
  // Setters
  setTreatments: React.Dispatch<React.SetStateAction<Treatment[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setNewTreatment: React.Dispatch<React.SetStateAction<TreatmentDTO>>;
  setShowDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTreatment: React.Dispatch<React.SetStateAction<Treatment | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarMessage | null>>;
  
  // Métodos auxiliares
  resetForm: () => void;
  showMessage: (message: string, severity: AlertColor) => void;
}

export default function useTreatments(): TreatmentsState {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newTreatment, setNewTreatment] = useState<TreatmentDTO>({
    nombre: '',   
    descripcion: '',
    precio: 0,
  });
  const [showDisabled, setShowDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  const resetForm = () => {
    setNewTreatment({
      nombre: '',
      descripcion: '',
      precio: 0,
    });
    setSelectedTreatment(null);
  };

  const showMessage = (message: string, severity: AlertColor) => {
    setSnackbar({ message, severity });
  };

  return {
    // Estado
    treatments,
    open,
    searchTerm,
    newTreatment,
    showDisabled,
    isLoading,
    selectedTreatment,
    snackbar,
    
    // Setters
    setTreatments,
    setOpen,
    setSearchTerm,
    setNewTreatment,
    setShowDisabled,
    setIsLoading,
    setSelectedTreatment,
    setSnackbar,
    
    // Métodos auxiliares
    resetForm,
    showMessage
  };
}