'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Autocomplete
} from '@mui/material';
import { DateDTO } from '@/domain/entities/Dates';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Patient } from '@/domain/entities/Patient';
import debounce from 'lodash/debounce';

interface DateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  date: DateDTO;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
  patients: Patient[];                          // ahora viene por props
  fetchPatients: (query: string) => void;       // función para buscar pacientes
}

export default function DatesDialog({
  open,
  onClose,
  onSubmit,
  date,
  handleChange,
  isEditing,
  patients,
  fetchPatients
}: DateDialogProps) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  // Si quieres debounce aquí:
  const debouncedFetchPatients = useMemo(
    () => debounce((q: string) => fetchPatients(q), 300),
    [fetchPatients]
  );

  useEffect(() => {
    return () => {
      debouncedFetchPatients.cancel();
    };
  }, [debouncedFetchPatients]);

  // Calcular paciente seleccionado a partir del prop patients
  const selectedPatient = useMemo(
    () => patients.find(p => p.idpaciente === date.idpaciente) || null,
    [patients, date.idpaciente]
  );

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
                fullWidth: true,
                margin: 'dense',
                required: true,
                InputLabelProps: { shrink: true },
              } as TextFieldProps
            }}
          />
        </LocalizationProvider>

        <Autocomplete
          options={patients}
          value={selectedPatient}
          getOptionLabel={o => `${o.nombres} ${o.apellidos}`}
          onChange={(_, newVal) => {
            handleChange({
              target: { name: 'idpaciente', value: newVal?.idpaciente || '' }
            } as any);
          }}
          onInputChange={(_, value, reason) => {
            if (reason === 'input') {
              debouncedFetchPatients(value);
            }
          }}
          renderInput={params => (
            <TextField {...params} label="Buscar Paciente" fullWidth margin="dense" />
          )}
          isOptionEqualToValue={(o, v) => o.idpaciente === v?.idpaciente}
        />

        <TextField
          label="Descripción"
          name="descripcion"
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
