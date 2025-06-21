import { useCallback, useEffect } from "react";
import debounce from "lodash/debounce";
import moment from "moment";
import { Date as DateObj, DateDTO } from "@/domain/entities/Dates";
import { IEventoCalendario } from "@/components/calendar/BigCalendar";
import {
  fetchDates,
  createDate,
  updateDate,
  deleteDate,
} from "@/application/usecases/dates";
import { AlertColor } from "@mui/material";
import { Patient } from "@/domain/entities/Patient";
import { PatientResponse } from "@/domain/dto/patient";

interface CalendarState {
  dates: DateObj[];
  events: IEventoCalendario[];
  open: boolean;
  searchTerm: string;
  newDate: DateDTO;
  showDisabled: boolean;
  isLoading: boolean;
  selectedDate: DateObj | null;
  searchQueryDialog: string;
  debouncedSearchQueryDialog: string;
  snackbar: { message: string, severity: AlertColor } | null;
  setDates: React.Dispatch<React.SetStateAction<DateObj[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setSearchQueryDialog: React.Dispatch<React.SetStateAction<string>>;
  setShowDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setPatientsDialog: React.Dispatch<React.SetStateAction<Patient[]>>;
  setNewDate: React.Dispatch<React.SetStateAction<DateDTO>>;
  setEvents: React.Dispatch<React.SetStateAction<IEventoCalendario[]>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<DateObj | null>>;
  setDebouncedSearchQueryDialog: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  showMessage: (message: string, severity: AlertColor) => void;
  setSnackbar: React.Dispatch<React.SetStateAction<{ message: string, severity: AlertColor } | null>>;
  resetForm: () => void;
  
  timeError: boolean,
  patientError: boolean,
  descriptionError: boolean,
  accordedTimeError: boolean,
  aproximateTimeError: boolean,

  setAproximateTimeError: React.Dispatch<React.SetStateAction<boolean>>;
  setAccordedTimeError: React.Dispatch<React.SetStateAction<boolean>>;
  setDescriptionError: React.Dispatch<React.SetStateAction<boolean>>;
  setPatientError: React.Dispatch<React.SetStateAction<boolean>>;
  setTimeError: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function useCalendarHandler(state: CalendarState) {
  const { 
    dates,
    searchTerm,
    selectedDate,
    newDate,
    showDisabled,
    setDates,
    setOpen, 
    setEvents, 
    setIsLoading, 
    setSelectedDate,
    showMessage,
    resetForm,
    searchQueryDialog,
    setSearchTerm,
    setDebouncedSearchQueryDialog,
    debouncedSearchQueryDialog,
    setPatientsDialog,
    setSearchQueryDialog,

    timeError, setTimeError,
    patientError, setPatientError,
    descriptionError, setDescriptionError,
    accordedTimeError, setAccordedTimeError,
    aproximateTimeError, setAproximateTimeError,
  } = state;

  const handleFetchDates = useCallback(
    debounce(async (query: string) => {
      setIsLoading(true);
      try {
          const data: DateObj[] = await fetchDates(query, showDisabled);
          setDates(data);
          const ev = data.map((data) => {
            const start = moment(data.fechacita).toDate(); 
            const end = new Date(start.getTime() + data.duracionaprox * 60 * 60 * 1000); 
            return {
              id: data.idcita,
              title: data.descripcion,
              start,
              end,
            };
          });
          setEvents(ev);
      } catch {
          showMessage('Error al cargar las citas', 'error');
      } finally {
          setIsLoading(false);
      }
    }, 300),
    [showDisabled]
  );
  const handleSnackbarClose = () => {
    state.setSnackbar(null);
  };

  const handleOpen = () => {
    
    setSelectedDate(null);
    setOpen(true);
  };
    
  const handleClose = () => {
    setTimeError(false);
    setPatientError(false);
    setDescriptionError(false);
    setAccordedTimeError(false);
    setAproximateTimeError(false);
    setSearchQueryDialog('');
    setDebouncedSearchQueryDialog('');
    setOpen(false);
    resetForm();
  };
    
  const handleEdit = (id: number) => {
    const cita = dates.find(date => date.idcita === id);
    if (!cita) return;
  
    state.setNewDate({
      fecha: cita.fecha ? moment(cita.fecha).format('YYYY-MM-DDTHH:mm') : '',   
      idpaciente: cita.idpaciente || 1,
      idconsulta: cita.idconsulta ?? 0,
      descripcion: cita.descripcion || '',
      idestadocita: 1,
      fechacita: cita.fechacita ? moment(cita.fechacita).format('YYYY-MM-DDTHH:mm') : '',
      duracionaprox: cita.duracionaprox || 0
    });
    console.log(cita.paciente);
    setSearchQueryDialog(cita.paciente);
    setSelectedDate(cita);
    setOpen(true);
  };
      
    
  const handleDelete = async (id: number) => {
    try {
      await deleteDate(id);
      setDates((prev) => prev.filter((date) => date.idcita !== id));
      await handleFetchDates(searchTerm);
      showMessage('Cita eliminada correctamente', 'success');
    } catch {
      showMessage('Error al eliminar la cita', 'error');
    }
  };
  const handleSubmit = async () => { 
    setTimeError(false);
    setPatientError(false);
    setDescriptionError(false);
    setAccordedTimeError(false);
    setAproximateTimeError(false);
    try {
      
      const adjustedFecha = moment(newDate.fecha).subtract(4, 'hours').toISOString();
      const adjustedFechacita = moment(newDate.fechacita).subtract(4, 'hours').toISOString();

      const start = moment(newDate.fechacita);
      const end = start.clone().add(newDate.duracionaprox * 60, 'minutes');

      const appointmentHour = start.hour();
      const isOutOfHours = appointmentHour < 7 || appointmentHour >= 22;
      const nextDay = end.hour() >= 22;

      const adjustedNewDate = {
          ...newDate,
          fecha: adjustedFecha,
          fechacita: adjustedFechacita
      };
      const isRegisteredDateDuplicated = dates.some(
        date => 
          date.fechacita === newDate.fechacita
      );
      const isRegisteredAppointmentDuplicated = dates.some(
        date => 
          Number(date.idconsulta) === Number(newDate.idconsulta) && Number(newDate.idconsulta!= null) && Number(newDate.idconsulta != 0)
      );
      if(newDate.descripcion.length > 100){
        showMessage('La descripcion no puede tener mas de 100 caracteres', 'error');
        setDescriptionError(true);
        return;
      }
      if(isOutOfHours){
        showMessage('La hora ingresada no puede ser antes de las 7 am ni despues de las 10 pm', 'error');
        setAccordedTimeError(true);
        return;
      }
      if(nextDay){
        showMessage('No se puede trabajar hasta luego de las 10pm', 'error');
        setAccordedTimeError(true);
        return;
      }
      if(newDate.duracionaprox < 0.25){
        showMessage('La duración aproximada no puede ser menor a 15 minutos', 'error');
        setAproximateTimeError(true);
        return;
      }

      if(isRegisteredDateDuplicated){
        showMessage('Ya hay una cita registrada para esta fecha', 'error');
        setAccordedTimeError(true);
        return;
      }
      if(newDate.duracionaprox > 5){
        showMessage('La duración aproximada no puede ser mayor a 5 horas', 'error');
        setAproximateTimeError(true);
        return;
      }
      
      const citasParaComparar = selectedDate
        ? dates.filter(date => date.idcita !== selectedDate.idcita)
        : dates;

      const isOverlapping = citasParaComparar.some(date => {
        const start = moment(date.fechacita);
        const end = moment(date.fechacita).add(date.duracionaprox * 60, 'minutes');
        const newStart = moment(newDate.fechacita);
        const newEnd = moment(newDate.fechacita).add(newDate.duracionaprox * 60, 'minutes');

        return newStart.isBefore(end) && start.isBefore(newEnd);
      });

      const isRegisterDateValid = moment(newDate.fecha) > moment(Date.now()).add(-1, 'year');
      
      
      if (isOverlapping) {
        showMessage('Ya hay una cita registrada durante esta hora', 'error');
        setAccordedTimeError(true);
        return;
      }
      if(isRegisteredAppointmentDuplicated){
        showMessage('Ya hay una cita registrada para esta consulta', 'error');
        setAccordedTimeError(true);
        return;
      }
      if(newDate.duracionaprox <= 0){
        showMessage('Ingrese una duración aproximada correcta', 'error');
        setAproximateTimeError(true);
        return;
      }
      if(!isRegisterDateValid){
        showMessage('La fecha ingresada es muy antigua', 'error');
        setTimeError(true);
        return;
      }
      if(!selectedDate){
        if(moment(newDate.fechacita).toDate() < moment(Date.now()).toDate()){
          showMessage('No se puede ingresar una fecha anterior a la actual', 'error');
          setTimeError(true);
          setAccordedTimeError(true);
          return;
        }
        if(moment(newDate.fechacita).toDate() < moment(newDate.fecha).toDate()){
          showMessage('La fecha de registro no puede ser anterior a la fecha acordada', 'error');
          setTimeError(true);
          setAccordedTimeError(true);
          return;
        }
      }
      if(selectedDate){
        const updatedDate = await updateDate(selectedDate.idcita, adjustedNewDate)
        setDates(prev => 
          prev.map((d) => d.idcita === updatedDate.idcita ? updatedDate : d)
        );
        showMessage('Se actualizó la cita correctamente', 'success');
      } else {
        const addedDate = await createDate(adjustedNewDate);
      
        setDates(prev => {
          const updated = [...prev, addedDate];
          return updated.sort((a, b) => new Date(a.fechacita).getTime() - new Date(b.fechacita).getTime());
        });
      
        showMessage('Se agregó la cita correctamente', 'success');
      }
      await handleFetchDates(searchTerm);
      handleClose();
    } catch (error) {
      if(error instanceof Error){
        showMessage(error.message, 'error');
      } else{
        showMessage('Ocurrió un error inesperado', 'error');
      }
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
      
    if (name === 'precio') {
      const numericValue = parseFloat(value) || 0;
      state.setNewDate(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      state.setNewDate(prev => ({
        ...prev, 
        [name]: value || ''  
      }));
    }
  };
  useEffect(() => {

    const timer = setTimeout(() => {
      setDebouncedSearchQueryDialog(searchQueryDialog);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQueryDialog]);

  const fetchPatientsDialog = useCallback(async () => {
    if (!debouncedSearchQueryDialog.trim()) {
      setPatientsDialog([]);
      return;
    }

    try {

      const queryParams = new URLSearchParams({
        page: '1',
        limit: '10',
        search: debouncedSearchQueryDialog,
      });

      const response = await fetch(`/api/patients?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar los pacientes');
      }
      
      const data: PatientResponse = await response.json();
      setPatientsDialog(data.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setPatientsDialog([]);
    }
  }, [debouncedSearchQueryDialog]);
  useEffect(() => {
    fetchPatientsDialog();
  }, [fetchPatientsDialog]);

  return {
    handleFetchDates,
    handleOpen,
    handleClose,
    handleChange,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleSnackbarClose
  };
}