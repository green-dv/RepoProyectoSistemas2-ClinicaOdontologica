"use client";
import { Calendar } from '@/components/dates/BigCalendar';
import { useEffect, useState, useCallback } from 'react';

import debounce from 'lodash/debounce';
import moment from 'moment';
import { Date as DateObj } from '@/domain/entities/Dates';
import { DateDTO} from '@/domain/entities/Dates';
import SnackbarAlert, { SnackbarMessage } from '@/components/SnackbarAlert';
import DatesDialog from './DatesDialog';
import { 
  fetchDates,
  createDate,
  updateDate,
  deleteDate,
  restoreDate,
  deleteDatePermanently
} from '@/application/usecases/dates';

import {
    Box,
    Paper,
    Grid,
    AlertColor,
    Button
} from '@mui/material';
import { Views } from 'react-big-calendar'; // Ensure this matches the library you're using for the calendar

export function CalendarComponent ({ initialDate }: { initialDate: string }) {
  console.log(initialDate);

  interface IEventoCalendario {
    title: string;
    start: globalThis.Date;
    end: globalThis.Date;
  }

  const [events, setEvents] = useState<IEventoCalendario[]>([]);
  const [showDisabled, setShowDisabled] = useState(false);
  const [dates, setDates] = useState<DateObj[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date(initialDate));
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<DateObj | null>(null);
  const [currentView, setCurrentView] = useState<typeof Views[keyof typeof Views]>('month');
  const [newDate, setNewDate] = useState<DateDTO>({
    fecha: '',   
    idpaciente: 1,
    idconsulta: 0,
    descripcion: '',
    idestadocita: 1,
    fechacita: '',
    duracionaprox: 0
  });
      
  useEffect(() => {
    if (initialDate) {
        const parsedDate = new Date(initialDate);
        // Validar si la fecha es válida
        if (!isNaN(parsedDate.getTime())) {
            setCurrentDate(parsedDate);
        } else {
            // Si no es válida, usa la fecha actual como fallback
            setCurrentDate(new Date());
        }
    } else {
        // Si no hay fecha, usar la fecha actual
        setCurrentDate(new Date());
    }
}, [initialDate]);

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

  useEffect(() => {
    handleFetchDates(searchTerm);
    return () => handleFetchDates.cancel();
  }, [handleFetchDates]);

  const handleSnackbarClose = () => {
    setSnackbar(null);
  };
  const showMessage = (message: string, severity: AlertColor) => {
      setSnackbar({ message, severity });
  };
  useEffect(() => {
      handleFetchDates(searchTerm);
      return () => handleFetchDates.cancel();
  }, [searchTerm, handleFetchDates]);

  const handleOpen = () => {
      setSelectedDate(null);
      setOpen(true);
    };
  
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };


  const resetForm = () => {
    setNewDate({
        fecha: '',   
        idpaciente: 1,
        idconsulta: 0,
        descripcion: '',
        idestadocita: 1,
        fechacita: '',
        duracionaprox: 0
    });
    setSelectedDate(null);
  };

  const handleEdit = (id: number) => {
    const cita = dates.find(date => date.idcita === id);
    if (!cita) return;
  
    setNewDate({
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
        // Restar 4 horas a las fechas
        const adjustedFecha = moment(newDate.fecha).subtract(4, 'hours').toISOString();
        const adjustedFechacita = moment(newDate.fechacita).subtract(4, 'hours').toISOString();

        // Actualizar las fechas ajustadas en el objeto `newDate`
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
      /*const isDuplicated = dates.some(
        date =>
          date.idcita === newDate.id
      );*/
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
      
      /*if(isDuplicated){
        showMessage('La cita ya existe', 'error');
        return;
      }*/
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
      setNewDate(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setNewDate(prev => ({
        ...prev, 
        [name]: value || ''  
      }));
    }
  };

  const handleSelectSlot = (slotInfo: any) => {
    const start = moment(slotInfo.start);
    const end = moment(slotInfo.end);
    
    setNewDate({
      fecha: '', 
      fechacita: start.format('YYYY-MM-DDTHH:mm'),
      duracionaprox: end.diff(start, 'hours') || 1,
      idpaciente: 1,
      idconsulta: 0,
      descripcion: '',
      idestadocita: 1,
    });
    setSelectedDate(null);
    setOpen(true);
  };

  const handleContextMenu = (event: React.MouseEvent, calendarEvent: any) => {
      event.preventDefault();
      console.log('Menu contextual para evento:', calendarEvent);
  };

  return (
    <div style={{ height: '100%', padding: '1rem' }}>
      <Calendar
        events={events}
        // 3️⃣ En lugar de defaultDate, pasá date y onNavigate
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)}
        // opcionalmente también podés dejar defaultDate para el primer render
        defaultDate={new Date(initialDate)}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleEdit}
        onContextMenu={handleContextMenu}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUpdate={() => handleFetchDates(searchTerm)}
        view={currentView}               // 👈 vista controlada
        onView={(view) => setCurrentView(view)}  // 👈 capturás el cambio
        views={['month', 'week', 'day']}
      />
      <DatesDialog 
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        date={newDate}
        handleChange={handleChange}
        isEditing={!!selectedDate}
      /> 
      <SnackbarAlert 
        snackbar={snackbar}
        onClose={handleSnackbarClose}
      />
    </div>
    
  );
}

export default CalendarComponent;
