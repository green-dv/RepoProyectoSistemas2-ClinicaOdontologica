"use client";
import{ Calendar } from '@/components/dates/BigCalendar';
import {Event as CalendarEvent} from 'react-big-calendar';
import DatesTable  from '@/components/dates/DatesTable';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';
import {Date as DateObj, DateDTO} from '@/domain/entities/Dates';
import * as React from 'react';
import { Add } from '@mui/icons-material';
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



export function CalendarComponent(){
    interface IEventoCalendario{
      title:string;
      start: globalThis.Date;
      end: globalThis.Date;
    }

    const [dates, setDates] = useState<DateObj[]>([]);
    const [open, setOpen] = useState(false);
    const [events, setEvents] = useState<IEventoCalendario[]>([]);
    const [showDisabled, setShowDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedTreatment, setSelectedDate] = useState<DateObj | null>(null);
    const [newTreatment, setNewDate] = useState<DateDTO>({
        fecha: '',   
        idpaciente: 1,
        idconsulta: 1,
        descripcion: '',
        idestadocita: 1,
        fechacita: '',
        duracionAprox: 0
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
                const ev = data.map((data) =>
                  {
                    const start = new Date(data.fechacita);
                    const end = new Date(start.getTime() + data.duracionaprox * 60 * 60 * 1000);
                    console.log(data.descripcion + ' = ' + start + ' = ' + end);
                    console.log('duracionAprox:', data.duracionaprox, 'typeof:', typeof data.duracionaprox);

                    return {
                      title: data.descripcion,
                      start: start,
                      end: end
                    };
                  }
                );
                setEvents(ev);
                console.log(events);
                console.log(ev);
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
            duracionAprox: 0
        });
        setSelectedDate(null);
      };
    
      const handleEdit = (date: DateObj) => {
        setNewDate({
            fecha: '',   
            idpaciente: 1,
            idconsulta: 1,
            descripcion: '',
            idestadocita: 1,
            fechacita: '',
            duracionAprox: 0
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
          
        } catch (error) {

        }
      };
    
      const toggleView = () => {
        setShowDisabled((prev) => !prev);
        setDates([]); 
        setSearchTerm(''); 
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
                        />
                    </Paper>
                </Grid>
                <Grid item xs={8}>
                    <Calendar
                        events={events}
                    />
                </Grid> 
            </Grid>
            
        </Box>
    );
}
export default CalendarComponent;