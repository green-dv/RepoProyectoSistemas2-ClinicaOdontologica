import { useState } from 'react';
import { Patient, PatientDTO } from '@/domain/entities/Patient';
import { AlertColor } from '@mui/material';

export interface SnackbarMessage {
  message: string;
  severity: AlertColor;
}

export interface PatientState {
  patients: Patient[];
  open: boolean;
  searchTerm: string;
  newPatient: PatientDTO;
  showDisabled: boolean;
  isLoading: boolean;
  selectedPatient: Patient | null;
  snackbar: SnackbarMessage | null;
  
  // Setters
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setNewPatient: React.Dispatch<React.SetStateAction<PatientDTO>>;
  setShowDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPatient: React.Dispatch<React.SetStateAction<Patient | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarMessage | null>>;
  
  resetForm: () => void;
  showMessage: (message: string, severity: AlertColor) => void;
}

export default function usePatients(): PatientState {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newPatient, setNewPatient] = useState<PatientDTO>({
    nombres: '',
    apellidos: '',
    direccion: '',
    telefonodomicilio: null,
    telefonopersonal: '',
    lugarnacimiento: null,
    fechanacimiento: '',
    sexo: true,
    estadocivil: '',
    ocupacion: '',
    aseguradora: null,
  });
  const [showDisabled, setShowDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  const resetForm = () => {
    setNewPatient({
        nombres: '',
        apellidos: '',
        direccion: '',
        telefonodomicilio: null,
        telefonopersonal: '',
        lugarnacimiento: null,
        fechanacimiento: '',
        sexo: true,
        estadocivil: '',
        ocupacion: '',
        aseguradora: null,
    });
    setSelectedPatient(null);
  };

  const showMessage = (message: string, severity: AlertColor) => {
    setSnackbar({ message, severity });
  };

  return {
    // Estados
    patients,
    open,
    searchTerm,
    newPatient,
    showDisabled,
    isLoading,
    selectedPatient,
    snackbar,
    
    // Setters
    setPatients,
    setOpen,
    setSearchTerm,
    setNewPatient,
    setShowDisabled,
    setIsLoading,
    setSelectedPatient,
    setSnackbar,
    
    resetForm,
    showMessage
  };
}