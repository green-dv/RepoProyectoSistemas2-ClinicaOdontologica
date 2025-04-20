import { useState } from "react";
import { Date as DateObj, DateDTO } from "@/domain/entities/Dates";
import { AlertColor } from "@mui/material";

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

    resetForm,
    showMessage,
  }
}