import { useState } from "react";
import { Date as DateObj, DateDTO } from "@/domain/entities/Dates";
import { AlertColor } from "@mui/material";
import { View, Views } from "react-big-calendar";

export interface SnackbarMessage {
  message: string;
  severity: AlertColor;
}
interface IEventoCalendario {
  title: string;
  start: globalThis.Date;
  end: globalThis.Date;
}
export interface CalendarState {
  dates: DateObj[];
  events: IEventoCalendario[];
  currentDate: Date;
  currentView: View;
  open: boolean;
  searchTerm: string;
  newDate: DateDTO;
  showDisabled: boolean;
  isLoading: boolean;
  selectedDate: DateObj | null;
  snackbar: SnackbarMessage | null;

  setDates: React.Dispatch<React.SetStateAction<DateObj[]>>;
  setEvents: React.Dispatch<React.SetStateAction<IEventoCalendario[]>>;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  setCurrentView: React.Dispatch<React.SetStateAction<typeof Views[keyof typeof Views]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setNewDate: React.Dispatch<React.SetStateAction<DateDTO>>;
  setShowDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<DateObj | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarMessage | null>>;

  resetForm: () => void;
  showMessage: (message: string, severity: AlertColor) => void;
}

export default function useCalendar(): CalendarState {
  const [dates, setDates] = useState<DateObj[]>([]);
  const [events, setEvents] = useState<IEventoCalendario[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<typeof Views[keyof typeof Views]>('month');
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newDate, setNewDate] = useState<DateDTO>({
    fecha: "",
    idpaciente: 1,
    idconsulta: 0,
    descripcion: "",
    idestadocita: 1,
    fechacita: "",
    duracionaprox: 0,
  });
  const [showDisabled, setShowDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateObj | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  const resetForm = () => {
    setNewDate({
      fecha: "",
      idpaciente: 1,
      idconsulta: 0,
      descripcion: "",
      idestadocita: 1,
      fechacita: "",
      duracionaprox: 0,
    });
    setSelectedDate(null);
  };

  const showMessage = (message: string, severity: AlertColor) => {
    setSnackbar({ message, severity });
  };

  return {
    dates,
    events,
    currentDate,
    currentView,
    open,
    searchTerm,
    newDate,
    showDisabled,
    isLoading,
    selectedDate,
    snackbar,

    setDates,
    setEvents,
    setCurrentDate,
    setCurrentView,
    setOpen,
    setSearchTerm,
    setNewDate,
    setShowDisabled,
    setIsLoading,
    setSelectedDate,
    setSnackbar,

    resetForm,
    showMessage,
  };
}