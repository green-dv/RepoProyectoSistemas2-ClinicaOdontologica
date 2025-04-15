import { useCallback } from "react";
import debounce from "lodash/debounce";
import moment from "moment";
import { Date as DateObj, DateDTO } from "@/domain/entities/Dates";
import {
  fetchDates,
  createDate,
  updateDate,
  deleteDate,
  restoreDate,
  deleteDatePermanently,
} from "@/application/usecases/dates";
import { AlertColor } from "@mui/material";
interface IEventoCalendario {
  title: string;
  start: globalThis.Date;
  end: globalThis.Date;
}
interface CalendarState {
  dates: DateObj[];
  events: IEventoCalendario[];
  open: boolean;
  searchTerm: string;
  newDate: DateDTO;
  showDisabled: boolean;
  isLoading: boolean;
  selectedDate: DateObj | null;
  snackbar: { message: string, severity: AlertColor } | null;
  setDates: React.Dispatch<React.SetStateAction<DateObj[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setShowDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setNewDate: React.Dispatch<React.SetStateAction<DateDTO>>;
  setEvents: React.Dispatch<React.SetStateAction<IEventoCalendario[]>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<DateObj | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  showMessage: (message: string, severity: AlertColor) => void;
  setSnackbar: React.Dispatch<React.SetStateAction<{ message: string, severity: AlertColor } | null>>;
  resetForm: () => void;
    
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
    resetForm
  } = state;

  const handleFetchDates = useCallback(
    debounce(async (query: string) => {
      setIsLoading(true);
      try {
          const data: DateObj[] = await fetchDates(query, showDisabled);
          setDates(data);
          console.log(dates);
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
      } catch (error) {
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
    setOpen(false);
    resetForm();
  };
    
  const handleEdit = (id: number) => {
    const cita = dates.find(date => date.idcita === id);
    if (!cita) return;
  
    state.setNewDate({
      fecha: cita.fecha ? moment(cita.fecha).format('YYYY-MM-DDTHH:mm') : '',   
      idpaciente: cita.idpaciente || 1,
      idconsulta: cita.idconsulta || 0,
      descripcion: cita.descripcion || '',
      idestadocita: 1,
      fechacita: cita.fechacita ? moment(cita.fechacita).format('YYYY-MM-DDTHH:mm') : '',
      duracionaprox: cita.duracionaprox || 0
    });
  
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
    try {
      const adjustedFecha = moment(newDate.fecha).subtract(4, 'hours').toISOString();
      const adjustedFechacita = moment(newDate.fechacita).subtract(4, 'hours').toISOString();

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
      if(isRegisteredDateDuplicated){
        showMessage('Ya hay una cita registrada para esta fecha', 'error');
        return;
      }
      if(isRegisteredAppointmentDuplicated){
        showMessage('Ya hay una cita registrada para esta consulta', 'error');
        return;
      }
      if(newDate.duracionaprox <= 0){
        showMessage('Ingrese una duración aproximada correcta', 'error');
        return;
      }
      if(!selectedDate){
        if(moment(newDate.fecha).toDate() < moment(Date.now()).toDate()||
          moment(newDate.fechacita).toDate() < moment(Date.now()).toDate()){
          showMessage('No se puede ingresar una fecha anterior a la actual', 'error');
          return;
        }
        if(moment(newDate.fechacita).toDate() < moment(newDate.fecha).toDate()){
          showMessage('La fecha de registro no puede ser anterior a la fecha acordada', 'error');
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