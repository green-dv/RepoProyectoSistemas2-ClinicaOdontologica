import { useState } from "react";
import { Date as DateObj, DateDTO } from "@/domain/entities/Dates";
import { AlertColor } from "@mui/material";
import { Patient } from "@/domain/entities/Patient";

export interface SnackbarMessage{
  message: string;
  severity: AlertColor;
}

export interface DatesState{
  dates: DateObj[];
  open: boolean;
  searchTerm: string;
  newDate: DateDTO;
  showDisabled: boolean;
  isLoading: boolean;
  selectedDate: DateObj | null;
  snackbar: SnackbarMessage | null;
  estadoFiltro: number | null;
  fechaInicio: moment.Moment | null;
  fechaFin: moment.Moment | null;
  pacienteId: number | null;

  //PACIENTES
  searchQuery: string | '';
  debouncedSearchQuery: string | '';
  patients: Patient[] | [];
  selectedPatient: Patient | null;
  loading: boolean | false;
  searchLoading: boolean | false;
  error: string | null;
  shouldSearch: boolean;

  setDates: React.Dispatch<React.SetStateAction<DateObj[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setNewDate: React.Dispatch<React.SetStateAction<DateDTO>>;
  setShowDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<DateObj | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarMessage | null>>;

  setEstadoFiltro: React.Dispatch<React.SetStateAction<number | null>>;
  setFechaInicio: React.Dispatch<React.SetStateAction<moment.Moment | null>>;
  setFechaFin: React.Dispatch<React.SetStateAction<moment.Moment | null>>;
  setPacienteId: React.Dispatch<React.SetStateAction<number | null>>;

  //PACIENTES
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setDebouncedSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  setSelectedPatient: React.Dispatch<React.SetStateAction<Patient | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setShouldSearch: React.Dispatch<React.SetStateAction<boolean>>;
  
  resetForm: () => void;
  showMessage: (message: string, severity: AlertColor) => void;
}

export default function useDates(): DatesState{
  const [dates, setDates] = useState<DateObj[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newDate, setNewDate] = useState<DateDTO>({
    fecha: '',   
    idpaciente: 0,
    idconsulta: 0,
    descripcion: '',
    idestadocita: 1,
    fechacita: '',
    duracionaprox: 0
  });
  const [showDisabled, setShowDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState<number | null>(null);
  const [fechaInicio, setFechaInicio] = useState<moment.Moment | null>(null);
  const [fechaFin, setFechaFin] = useState<moment.Moment | null>(null);
  const [pacienteId, setPacienteId] = useState<number | null>(0);
  const [selectedDate, setSelectedDate] = useState<DateObj | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  //PACIENTES
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldSearch, setShouldSearch] = useState(true);

  const resetForm = () => {
    setNewDate({
        fecha: '',   
        idpaciente: 0,
        idconsulta: 0,
        descripcion: '',
        idestadocita: 1,
        fechacita: '',
        duracionaprox: 0
    });
    setSelectedDate(null);
  };
  const showMessage = (message: string, severity: AlertColor) => {
    setSnackbar({ message, severity });
  };
  return{
    dates,
    open,
    searchTerm,
    newDate,
    showDisabled,
    isLoading,
    selectedDate,
    snackbar,
    estadoFiltro,
    fechaInicio,
    fechaFin,
    pacienteId,

    setDates,
    setOpen,
    setSearchTerm,
    setNewDate,
    setShowDisabled,
    setIsLoading,
    setSelectedDate,
    setSnackbar,
    setEstadoFiltro,
    setFechaInicio,
    setFechaFin,
    setPacienteId,

    //PACIENTES
    searchQuery,
    debouncedSearchQuery,
    patients,
    selectedPatient,
    loading,
    searchLoading,
    error,
    setSearchQuery,
    setDebouncedSearchQuery,
    setPatients,
    setSelectedPatient,
    setLoading,
    setSearchLoading,
    setError,
    shouldSearch,
    setShouldSearch,

    resetForm,
    showMessage,
  }
}