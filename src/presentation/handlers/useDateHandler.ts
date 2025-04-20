import { useCallback } from "react";
import debounce from 'lodash/debounce';
import { Date as DateObj, DateDTO } from "@/domain/entities/Dates";
import { AlertColor } from "@mui/material";
import moment from 'moment';
import{
  fetchDates,
  createDate,
  updateDate,
  deleteDate,
  restoreDate,
  deleteDatePermanently
} from '@/application/usecases/dates';

interface DatesState{
  dates: DateObj[];
  open: boolean;
  searchTerm: string;
  newDate: DateDTO;
  showDisabled: boolean;
  isLoading: boolean;
  selectedDate: DateObj | null;
  snackbar: { message: string, severity: AlertColor } | null;
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
  setSnackbar: React.Dispatch<React.SetStateAction<{ message: string, severity: AlertColor } | null>>;

  setEstadoFiltro: React.Dispatch<React.SetStateAction<number | null>>;
  setFechaInicio: React.Dispatch<React.SetStateAction<moment.Moment | null>>;
  setFechaFin: React.Dispatch<React.SetStateAction<moment.Moment | null>>;
  setPacienteId: React.Dispatch<React.SetStateAction<number | null>>;

  resetForm: () => void;
  showMessage: (message: string, severity: AlertColor) => void;

}

export default function useDatesHandlers(state: DatesState){
  const{
    dates,
    searchTerm,
    selectedDate,
    newDate,
    showDisabled,
    estadoFiltro,
    fechaInicio,
    fechaFin,
    pacienteId,
    setDates,
    setIsLoading,
    setOpen,
    setSelectedDate,
    resetForm,
    showMessage,
    setEstadoFiltro,
    setFechaInicio,
    setFechaFin,
    setPacienteId,
  } = state;


  const handleSnackbarClose = () => {
    state.setSnackbar(null);
  };
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
                    title: data.descripcion,
                    start,
                    end,
                };
            });
        } catch (error) {
            showMessage('Error al cargar las citas', 'error');
        } finally {
            setIsLoading(false);
        }
    }, 300),
    [showDisabled]
  );

  const handleOpen = () => {
    setSelectedDate(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleEdit = (date: DateObj) => {
    state.setNewDate({
      fecha: date.fecha ? moment(date.fecha).format('YYYY-MM-DDTHH:mm') : '',   
      idpaciente: date.idpaciente || 1,
      idconsulta: date.idconsulta || 0,
      descripcion: date.descripcion || '',
      idestadocita: 1, // Adjust this if `idestadocita` is part of the `DateObj`
      fechacita: date.fechacita ? moment(date.fechacita).format('YYYY-MM-DDTHH:mm') : '',
      duracionaprox: date.duracionaprox || 0
  });
    setSelectedDate(date);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDate(id);
      setDates((prev) => prev.filter((date) => date.idcita !== id));
      showMessage('Cita eliminada correctamente', 'success');
    } catch {
      showMessage('Error al eliminar la cita', 'error');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreDate(id);
      setDates((prev) => prev.filter((date) => date.idcita !== id));
      showMessage('Cita restaurada correctamente', 'success');
    } catch {
      showMessage('Error al restaurar la cita', 'error');
    }
  };

  const handleDeletePermanently = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este producto permanentemente? no hay vuelta atras.')) return;
    try {
      await deleteDatePermanently(id);
      showMessage('Cita eliminada permanentemente', 'success');
      handleFetchDates(searchTerm);
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
      const isOverlapping = dates.some(date => {
        if(newDate.fecha === date.fecha && selectedDate) return false;
        const start = moment(date.fechacita);
        const end = moment(date.fechacita).add(date.duracionaprox * 60, 'minutes');
        const newStart = moment(newDate.fechacita);
        const newEnd = moment(newDate.fechacita).add(newDate.duracionaprox * 60, 'minutes');
      
        return newStart.isBefore(end) && start.isBefore(newEnd);
      });
      
      
      if (isOverlapping) {
        showMessage('Ya hay una cita registrada durante esta hora', 'error');
        return;
      }
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
        if(moment(newDate.fechacita).toDate() < moment(Date.now()).toDate()){
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

  const toggleView = () => {
    state.setShowDisabled((prev) => !prev);
    setDates([]); 
    state.setSearchTerm(''); 
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

  const handleDatesFilter = () => {
    return dates.filter(cita => {
      const fecha = moment(cita.fechacita);
  
      const coincideEstado = estadoFiltro !== null ? cita.idestado === estadoFiltro : true;
      const coincideFechaInicio = fechaInicio ? fecha.isSameOrAfter(fechaInicio, 'day') : true;
      const coincideFechaFin = fechaFin ? fecha.isSameOrBefore(fechaFin, 'day') : true;
      const coincidePaciente = pacienteId ? Number(cita.idpaciente) === pacienteId : true;
  
      return coincideEstado && coincideFechaInicio && coincideFechaFin && coincidePaciente;
    });
  };
  

  return {
    handleFetchDates,
    handleOpen,
    handleClose,
    handleChange,
    handleEdit,
    handleDelete,
    handleRestore,
    handleDeletePermanently,
    handleSubmit,
    toggleView,
    handleSnackbarClose,
    handleDatesFilter,
    setPacienteId,
    setFechaFin,
    setFechaInicio,
    setEstadoFiltro
  };

}
