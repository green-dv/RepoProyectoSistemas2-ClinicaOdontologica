import { useState } from 'react';
import { Illness, IllnessDTO } from '@/domain/entities/Illnesses';
import { AlertColor } from '@mui/material';

export interface SnackbarMessage {
  message: string;
  severity: AlertColor;
}

export interface IllnessesState {
  illnesses: Illness[];
  open: boolean;
  searchTerm: string;
  newIllness: IllnessDTO;
  showDisabled: boolean;
  isLoading: boolean;
  selectedIllness: Illness | null;
  snackbar: SnackbarMessage | null;
  
  setIllnesses: React.Dispatch<React.SetStateAction<Illness[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setNewIllness: React.Dispatch<React.SetStateAction<IllnessDTO>>;
  setShowDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIllness: React.Dispatch<React.SetStateAction<Illness | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarMessage | null>>;
  
  resetForm: () => void;
  showMessage: (message: string, severity: AlertColor) => void;
}

export default function useIllnesses(): IllnessesState {
  const [illnesses, setIllnesses] = useState<Illness[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newIllness, setNewIllness] = useState<IllnessDTO>({
    enfermedad: '',
  });
  const [showDisabled, setShowDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIllness, setSelectedIllness] = useState<Illness | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  const resetForm = () => {
    setNewIllness({
      enfermedad: '',
    });
    setSelectedIllness(null);
  };

  const showMessage = (message: string, severity: AlertColor) => {
    setSnackbar({ message, severity });
  };

  return {
    illnesses,
    open,
    searchTerm,
    newIllness,
    showDisabled,
    isLoading,
    selectedIllness,
    snackbar,
    
    setIllnesses,
    setOpen,
    setSearchTerm,
    setNewIllness,
    setShowDisabled,
    setIsLoading,
    setSelectedIllness,
    setSnackbar,
    
    resetForm,
    showMessage
  };
}