import { useState } from 'react';
import { Medication, MedicationDTO } from '@/domain/entities/Medications';
import { AlertColor } from '@mui/material';

export interface SnackbarMessage {
  message: string;
  severity: AlertColor;
}

export interface MedicationsState {
  medications: Medication[];
  open: boolean;
  searchTerm: string;
  newMedication: MedicationDTO;
  showDisabled: boolean;
  isLoading: boolean;
  selectedMedication: Medication | null;
  snackbar: SnackbarMessage | null;
  
  setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setNewMedication: React.Dispatch<React.SetStateAction<MedicationDTO>>;
  setShowDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMedication: React.Dispatch<React.SetStateAction<Medication | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarMessage | null>>;
  
  resetForm: () => void;
  showMessage: (message: string, severity: AlertColor) => void;
}

export default function useMedications(): MedicationsState {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newMedication, setNewMedication] = useState<MedicationDTO>({
    medicacion: '',
  });
  const [showDisabled, setShowDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  const resetForm = () => {
    setNewMedication({
      medicacion: '',
    });
    setSelectedMedication(null);
  };

  const showMessage = (message: string, severity: AlertColor) => {
    setSnackbar({ message, severity });
  };

  return {
    medications,
    open,
    searchTerm,
    newMedication,
    showDisabled,
    isLoading,
    selectedMedication,
    snackbar,
    
    setMedications,
    setOpen,
    setSearchTerm,
    setNewMedication,
    setShowDisabled,
    setIsLoading,
    setSelectedMedication,
    setSnackbar,
    
    resetForm,
    showMessage
  };
}