import { useState } from 'react';
import { MedicalAttention, MedicalAttentionDTO } from '@/domain/entities/MedicalAttentions';
import { AlertColor } from '@mui/material';

export interface SnackbarMessage {
  message: string;
  severity: AlertColor;
}

export interface MedicalAttentionsState {
  medicalAttentions: MedicalAttention[];
  open: boolean;
  searchTerm: string;
  newMedicalAttention: MedicalAttentionDTO;
  showDisabled: boolean;
  isLoading: boolean;
  selectedMedicalAttention: MedicalAttention | null;
  snackbar: SnackbarMessage | null;
  
  setMedicalAttentions: React.Dispatch<React.SetStateAction<MedicalAttention[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setNewMedicalAttention: React.Dispatch<React.SetStateAction<MedicalAttentionDTO>>;
  setShowDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMedicalAttention: React.Dispatch<React.SetStateAction<MedicalAttention | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarMessage | null>>;
  
  resetForm: () => void;
  showMessage: (message: string, severity: AlertColor) => void;
}

export default function useMedicalAttentions(): MedicalAttentionsState {
  const [medicalAttentions, setMedicalAttentions] = useState<MedicalAttention[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newMedicalAttention, setNewMedicalAttention] = useState<MedicalAttentionDTO>({
    atencion: '',
  });
  const [showDisabled, setShowDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMedicalAttention, setSelectedMedicalAttention] = useState<MedicalAttention | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  const resetForm = () => {
    setNewMedicalAttention({
      atencion: '',
    });
    setSelectedMedicalAttention(null);
  };

  const showMessage = (message: string, severity: AlertColor) => {
    setSnackbar({ message, severity });
  };

  return {
    medicalAttentions,
    open,
    searchTerm,
    newMedicalAttention,
    showDisabled,
    isLoading,
    selectedMedicalAttention,
    snackbar,
    
    setMedicalAttentions,
    setOpen,
    setSearchTerm,
    setNewMedicalAttention,
    setShowDisabled,
    setIsLoading,
    setSelectedMedicalAttention,
    setSnackbar,
    
    resetForm,
    showMessage
  };
}