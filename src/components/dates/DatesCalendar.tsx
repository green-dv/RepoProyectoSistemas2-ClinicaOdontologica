"use client";
import{ Calendar } from '@/components/dates/BigCalendar';
import {Event as CalendarEvent} from 'react-big-calendar'
import DatesTable  from '@/components/dates/DatesTable';
import { toZonedTime } from 'date-fns-tz';
import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';
import {Date as DateObj, DateDTO} from '@/domain/entities/Dates';
import * as React from 'react';
import { Add, Preview } from '@mui/icons-material';
import {
    Box,
    Paper,
    Grid,
    AlertColor,
    Button
} from '@mui/material';
import moment from 'moment';
import { 
  fetchDates,
  createDate,
  updateDate,
  deleteDate,
  restoreDate,
  deleteDatePermanently
} from '@/application/usecases/dates';
import SnackbarAlert, { SnackbarMessage } from '@/components/SnackbarAlert';
import DatesDialog from './DatesDialog';



export function CalendarComponent(){
    interface IEventoCalendario{
      title:string;
      start: globalThis.Date;
      end: globalThis.Date;
    }
    const timeZone = 'America/La_Paz';
    const [dates, setDates] = useState<DateObj[]>([]);
    const [open, setOpen] = useState(false);
    const [events, setEvents] = useState<IEventoCalendario[]>([]);
    const [showDisabled, setShowDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<DateObj | null>(null);
    const [newDate, setNewDate] = useState<DateDTO>({
        fecha: '',   
        idpaciente: 1,
        idconsulta: 1,
        descripcion: '',
        idestadocita: 1,
        fechacita: '',
        duracionaprox: 0
      });

    const handleSnackbarClose = () => {
        setSnackbar(null);
    };
    const showMessage = (message: string, severity: AlertColor) => {
        setSnackbar({ message, severity });
    };

    const handleFetchDates = useCallback(
        debounce(async (query: string) => {
            setIsLoading(true);
            try {
                const data: DateObj[] = await fetchDates(query, showDisabled);
                setDates(data);
                console.log(dates);
                const ev = data.map((data) => {
                    const start = moment(data.fechacita).add(4, 'hours').toDate(); 
                    const end = new Date(start.getTime() + data.duracionaprox * 60 * 60 * 1000); 
                    return {
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
            idconsulta: 1,
            descripcion: '',
            idestadocita: 1,
            fechacita: '',
            duracionaprox: 0
        });
        setSelectedDate(null);
      };
    
      const handleEdit = (date: DateObj) => {
        setNewDate({
          fecha: date.fecha ? moment(date.fecha).format('YYYY-MM-DDTHH:mm') : '',   
          idpaciente: date.idpaciente || 1,
          idconsulta: date.idconsulta || 1,
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
          showMessage('Tratamiento eliminado correctamente', 'success');
        } catch {
          showMessage('Error al eliminar el tratamiento', 'error');
        }
      };
    
      const handleRestore = async (id: number) => {
        try {
          await restoreDate(id);
          setDates((prev) => prev.filter((date) => date.idcita !== id));
          showMessage('Tratamiento restaurado correctamente', 'success');
        } catch {
          showMessage('Error al restaurar el Tratamiento', 'error');
        }
      };
    
      const handleDeletePermanently = async (id: number) => {
        if (!window.confirm('¿Está seguro de eliminar este producto permanentemente? no hay vuelta atras.')) return;
        try {
          await deleteDatePermanently(id);
          showMessage('Tratamiento eliminado permanentemente', 'success');
          handleFetchDates(searchTerm);
        } catch {
          showMessage('Error al eliminar el Tratamiento', 'error');
        }
      };
    
      const handleSubmit = async () => { 
        try {
          const isRegisteredDateDuplicated = dates.some(
            date => 
              date.fechacita === newDate.fechacita
          );
          const isRegisteredAppointmentDuplicated = dates.some(
            date => 
              Number(date.idconsulta) === Number(newDate.idconsulta)
          );
          /*const isDuplicated = dates.some(
            date =>
              date.idcita === newDate.id
          );*/
          console.log('fecha duplicada?', isRegisteredDateDuplicated);
          console.log('consulta duplicada?', isRegisteredAppointmentDuplicated);

          if(isRegisteredDateDuplicated){
            showMessage('Ya hay una cita registrada para esta fecha', 'error');
            return;
          }
          if(isRegisteredAppointmentDuplicated){
            showMessage('Ya hay una cita registrada para esta consulta', 'error');
            return;
          }
          /*if(isDuplicated){
            showMessage('La cita ya existe', 'error');
            return;
          }*/
          if(selectedDate){
            const updatedDate = await updateDate(selectedDate.idcita, newDate)
            setDates(prev => 
              prev.map((d) => d.idcita === updatedDate.idcita ? updatedDate : d)
            );
            showMessage('Se actualizó la cita correctamente', 'success');
          } else {
            const addedDate = await createDate(newDate);
          
            setDates(prev => {
              const updated = [...prev, addedDate];
              return updated.sort((a, b) => new Date(a.fechacita).getTime() - new Date(b.fechacita).getTime());
            });
          
            const start = new Date(addedDate.fechacita);
            const end = new Date(start.getTime() + addedDate.duracionaprox * 60 * 60 * 1000);
          
            setEvents(prev => [
              ...prev,
              {
                title: addedDate.descripcion,
                start,
                end
              }
            ]);
          
            showMessage('Se agregó la cita correctamente', 'success');
          }
          //await handleFetchDates(searchTerm);
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
        setShowDisabled((prev) => !prev);
        setDates([]); 
        setSearchTerm(''); 
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

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Button variant="outlined" color="primary" onClick={toggleView}>
                                {showDisabled ? 'Ver Habilitados' : 'Ver Inhabilitados'}
                            </Button>
                            {!showDisabled && (
                            <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
                                Añadir Cita
                            </Button>
                        )}
                        </Box>
                        <DatesTable
                            dates={dates}
                            isLoading={isLoading}
                            showDisabled={showDisabled}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onRestore={handleRestore}
                            onDeletePermanently={handleDeletePermanently}
                            onUpdate={()=>handleFetchDates(searchTerm)}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={8}>
                  <Calendar events={events} />
                </Grid> 
            </Grid>
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
        </Box>
        
    );
}
export default CalendarComponent;