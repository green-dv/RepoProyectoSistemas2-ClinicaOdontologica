import React, { useState } from 'react';
import { Odontogram, CreateOdontogram } from '@/domain/entities/Odontogram';
import { OdontogramDescription, OdontogramDescriptionDTO } from '@/domain/entities/OdontogramDescription';
import { Diagnosis } from '@/domain/entities/Diagnosis';
import { AlertColor } from '@mui/material';


export interface SnackbarMessage {
  message: string;
  severity: AlertColor;
}

export interface OdontogramState{
  odontograms: Odontogram[] | null;
  odontogram: Odontogram | null;
  searchTerm: string;
  descriptions: OdontogramDescription[] | null;
  createDescription: OdontogramDescriptionDTO | null;
  createOdontogram: CreateOdontogram | null;
  createdDescriptions: OdontogramDescription[] | null;
  diagnosis: Diagnosis[] | null ;
  selectedDiagnosis: Diagnosis | null;

  page: number;
  rowsperpage: number;
  total: number;

  open: boolean;
  
  isLoading: boolean;
  snackbar: SnackbarMessage | null;



  //setters
  setOdontograms: React.Dispatch<React.SetStateAction<Odontogram[] | null>>;
  setOdontogram: React.Dispatch<React.SetStateAction<Odontogram | null>>;
  setCreateOdontogram: React.Dispatch<React.SetStateAction<Odontogram | null>>;
  setCreateDestiption: React.Dispatch<React.SetStateAction<OdontogramDescriptionDTO | null>>;
  setCreatedDestiptions: React.Dispatch<React.SetStateAction<OdontogramDescription[] | null>>;
  setDescriptions: React.Dispatch<React.SetStateAction<OdontogramDescription[] | null>>;
  setDiagnosis: React.Dispatch<React.SetStateAction<Diagnosis[] | null>>;
  setSelectedDiagnosis: React.Dispatch<React.SetStateAction<Diagnosis | null>>;

  setPage: React.Dispatch<React.SetStateAction<number>>;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setIsLoanding: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarMessage | null>>;

  showMessage: (message: string, severity: AlertColor) => void;
  resetForm: () => void;
}

export default function useOdontogram(): OdontogramState {
  const[odontograms, setOdontograms] = useState<Odontogram[] | null>(null);
  const[odontogram, setOdontogram] = useState<Odontogram | null>(null);
  const[searchTerm, setSearchTerm] = useState<string>('');
  const[descriptions, setDescriptions] = useState<OdontogramDescription[] | null>(null);
  const[createDescription, setCreateDestiption] = useState<OdontogramDescriptionDTO | null>(null);
  const[createOdontogram, setCreateOdontogram] = useState<Odontogram | null>(null);
  const[createdDescriptions, setCreatedDestiptions] = useState<OdontogramDescription[] | null>(null);
  const[diagnosis, setDiagnosis] = useState<Diagnosis[] | null>(null);
  const[selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);
  const[open, setOpen] = useState<boolean>(false);
  const[isLoading, setIsLoanding] = useState<boolean>(false);
  const[snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  const[page, setPage] = useState<number>(0);
  const[rowsperpage, setRowsPerPage] = useState<number>(0);
  const[total, setTotal] = useState<number>(0);

  const showMessage = (message: string, severity: AlertColor) => {
    setSnackbar({ message, severity });
  };
  const resetForm = () => {
    setCreateOdontogram(null)
    setCreatedDestiptions(null);
  };

  return{
    odontograms,
    odontogram,
    searchTerm,
    descriptions,
    createDescription,
    createOdontogram,
    createdDescriptions,
    diagnosis,
    selectedDiagnosis,

    open,
    
    isLoading,
    snackbar,

    page,
    rowsperpage,
    total,

    setPage,
    setRowsPerPage,
    setTotal,

    //setters
    setOdontograms,
    setOdontogram,
    setCreateOdontogram,
    setCreateDestiption,
    setCreatedDestiptions,
    setDescriptions,
    setDiagnosis,
    setSelectedDiagnosis,
    
    setOpen,
    setSearchTerm,
    setIsLoanding,
    setSnackbar,
    showMessage,
    resetForm,

  }
}