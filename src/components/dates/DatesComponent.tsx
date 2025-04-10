"use client";
import{ Calendar } from '@/components/dates/BigCalendar';
import DateCard  from '@/components/dates/DateCard';
import { toZonedTime } from 'date-fns-tz';
import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';
import {Date as DateObj, DateDTO} from '@/domain/entities/Dates';
import * as React from 'react';
import { Add, Preview } from '@mui/icons-material';
import ToggleButtonGroupComponent from '@/components/calendar/ToggleButtonGroup';
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



export function DatesComponent(){
    const timeZone = 'America/La_Paz';
    const [dates, setDates] = useState<DateObj[]>([]);
    const [open, setOpen] = useState(false);
    const [showDisabled, setShowDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<DateObj | null>(null);
    const [newDate, setNewDate] = useState<DateDTO>({
        fecha: '',   
        idpaciente: 1,
        idconsulta: 0,
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
    
      const handleEdit = (date: DateObj) => {
        setNewDate({
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
            <ToggleButtonGroupComponent/>
            </Box>
            <DateCard
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
export default DatesComponent;