'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  TextFieldProps,
  Typography,
  InputAdornment,
  CircularProgress,
  IconButton,
  Paper
} from '@mui/material';
import { DateDTO } from '@/domain/entities/Dates';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Patient } from '@/domain/entities/Patient';
import { Clear, Search } from '@mui/icons-material';

interface DateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  date: DateDTO;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
  patients: Patient[];
  searchQueryDialog: string;
  setSearchQueryDialog: (q: string) => void;
  searchLoadingDialog: boolean;
  setSelectedPatientDialog: (p: Patient | null) => void;
  timeError: boolean;
  patientError: boolean;
  descriptionError: boolean;
  accordedTimeError: boolean;
  aproximateTimeError: boolean;
}

export default function DatesDialog({
  open,
  onClose,
  onSubmit,
  date,
  handleChange,
  isEditing,
  patients,
  searchQueryDialog,
  setSearchQueryDialog,
  searchLoadingDialog,
  setSelectedPatientDialog,
  timeError,
  patientError,
  descriptionError,
  accordedTimeError,
  aproximateTimeError,
}: DateDialogProps) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const handleClearSearch = () => {
    setSearchQueryDialog('');
    setSelectedPatientDialog(null);
    handleChange({
      target: {
        name: 'idpaciente',
        value: 0,
      },
    } as any);
  };

  // Inicializar horas/minutos cuando cambia date.duracionaprox
  useEffect(() => {
    if (date.duracionaprox !== undefined) {
      setHours(Math.floor(date.duracionaprox));
      setMinutes(Math.round((date.duracionaprox % 1) * 60));
    }
  }, [date.duracionaprox]);

  const updateDuracionAprox = (newHours: number, newMinutes: number) => {
    const duracionAprox = newHours + newMinutes / 60;
    handleChange({
      target: { name: 'duracionaprox', value: duracionAprox.toString() }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handlePatientSelectDialog = (patient: Patient) => {
    setSelectedPatientDialog(patient);
    setSearchQueryDialog(`${patient.nombres} ${patient.apellidos} ${patient.idpaciente}`);
  };

  

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {isEditing ? 'Editar Cita' : 'Añadir Cita'}
      </DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            // DateTimePicker does NOT have a direct 'id' or 'error' prop that affects the root element.
            // The 'id' and 'error' props are passed to the underlying TextField via slotProps.
            label="Fecha Registrada"
            value={date.fecha ? new Date(date.fecha) : null}
            onChange={(newValue) =>
              handleChange({
                target: { name: 'fecha', value: newValue?.toISOString() || '' }
              } as any)
            }
            slots={{ textField: TextField }}
            slotProps={{
              textField: {
                id: timeError ? 'outlined-error-helper-text' : 'time',
                error: timeError,
                fullWidth: true,
                margin: 'dense',
                required: true,
                InputLabelProps: { shrink: true },
              } as TextFieldProps
            }}
          />
        </LocalizationProvider>

        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            id={patientError ? 'outlined-error-helper-text' : 'patient'}
            error={patientError}
            placeholder="Buscar paciente por nombre, apellido o ID..."
            value={searchQueryDialog}
            onChange={(e) => {
              setSearchQueryDialog(e.target.value);
            }}
            onFocus={() => {
              if (!searchQueryDialog) setSearchQueryDialog(""); // Forzar búsqueda inicial
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {searchLoadingDialog && (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  )}
                  {searchQueryDialog && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClearSearch} size="small">
                        <Clear/>
                      </IconButton>
                    </InputAdornment>
                  )}
                </>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          {/* Lista de pacientes */}
          {patients.length > 0 && (
            <Paper
              elevation={4}
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 1300,
                maxHeight: 300,
                overflow: 'auto',
                mt: 1,
              }}
            >
              {patients.map((patient) => (
                <Box
                  key={patient.idpaciente}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                  onClick={() => {
                    handlePatientSelectDialog(patient); // actualiza selectedPatient y otros estados en el padre
                    handleChange({
                      target: {
                        name: 'idpaciente',
                        value: patient.idpaciente,
                      },
                    } as any); // para que se actualice también en DateDTO
                    setSearchQueryDialog(`${patient.nombres} ${patient.apellidos}`);
                  }}
                >
                  <Typography variant="body1" fontWeight="medium">
                    {patient.nombres} {patient.apellidos}
                  </Typography>
                </Box>
              ))}
            </Paper>
          )}
        </Box>

        <TextField
          label="Descripción"
          name="descripcion"
          id={descriptionError ? 'outlined-error-helper-text' : 'description'}
          error={descriptionError}
          type="text"
          fullWidth
          margin="dense"
          value={date.descripcion}
          onChange={handleChange}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Fecha Acordada"
            value={date.fechacita ? new Date(date.fechacita) : null}
            onChange={(newValue) =>
              handleChange({
                target: { name: 'fechacita', value: newValue?.toISOString() || '' }
              } as any)
            }
            slots={{ textField: TextField }}
            slotProps={{
              textField: {
                id: accordedTimeError ? 'outlined-error-helper-text' : 'accordedTime',
                error: accordedTimeError,
                fullWidth: true,
                margin: 'dense',
                required: true,
                InputLabelProps: { shrink: true },
              } as TextFieldProps
            }}
          />
        </LocalizationProvider>

        <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={2}>
          <Typography>Tiempo de consulta estimado:</Typography>
          <TextField
            id={aproximateTimeError ? 'outlined-error-helper-text' : 'horas'}
            error={aproximateTimeError}
            label="Horas"
            type="number"
            inputProps={{ min: 0 }}
            value={hours || ''}
            onChange={e => {
              const h = parseInt(e.target.value) || 0;
              setHours(h);
              updateDuracionAprox(h, minutes);
            }}
            placeholder="00"
            style={{ maxWidth: 70 }}
          />
          <TextField
            label="Minutos"
            type="number"
            id={aproximateTimeError ? 'outlined-error-helper-text' : 'minutos'}
            error={aproximateTimeError}
            inputProps={{ min: 0, max: 59 }}
            value={minutes || ''}
            onChange={e => {
              let m = parseInt(e.target.value) || 0;
              if (m > 59) m = 59;
              setMinutes(m);
              updateDuracionAprox(hours, m);
            }}
            placeholder="00"
            style={{ maxWidth: 70 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSubmit} variant="contained">
          {isEditing ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
