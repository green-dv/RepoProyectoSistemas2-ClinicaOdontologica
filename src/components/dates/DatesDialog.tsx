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
  Typography
} from '@mui/material';
import { DateDTO } from '@/domain/entities/Dates';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';


interface DateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  date: DateDTO;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
}

export default function DatesDialog({
  open,
  onClose,
  onSubmit,
  date,
  handleChange,
  isEditing
}: DateDialogProps) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    if (date && date.duracionaprox !== undefined) {
      setHours(Math.floor(date.duracionaprox));
      setMinutes(Math.round((date.duracionaprox % 1) * 60));
    }
  }, [date.duracionaprox]);

  const updateDuracionAprox = (newHours: number, newMinutes: number) => {
    const duracionAprox = newHours + newMinutes / 60;
    const event = {
      target: { name: 'duracionaprox', value: duracionAprox.toString() }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
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
          onChange={(newValue) => {
            handleChange({
              target: { name: 'fecha', value: newValue?.toISOString() || '' }
            } as any);
          }}
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
        <TextField
          label="Paciente"
          name="idpaciente"
          type="number"
          fullWidth
          margin="dense"
          value={date.idpaciente}
          onChange={handleChange}
        />
        <TextField
          label="Descripcion"
          name="descripcion"
          type="text"
          fullWidth
          margin="dense"
          value={date.descripcion}
          onChange={handleChange}
        />
        <TextField
          name="idconsulta"
          type="hidden"
          value={''}
        />
        <TextField
          name="idestadocita"
          type="hidden"
          value={1}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Fecha Acordada"
            value={date.fechacita ? new Date(date.fechacita) : null}
            onChange={(newValue) => {
              handleChange({
                target: { name: 'fechacita', value: newValue?.toISOString() || '' }
              } as any);
            }}
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
        <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
          <Typography>
            Tiempo de consulta estimado:
          </Typography>
          <TextField
            label="Horas"
            type="number"
            inputProps={{ min: 0 }}
            value={hours || ""}
            onChange={(e) => {
              const h = parseInt(e.target.value) || 0;
              setHours(h);
              updateDuracionAprox(h, minutes);
            }}
            placeholder="00"
            fullWidth
            style={{ maxWidth: '70px' }} // Limitar el ancho del input
          />
          <TextField
            label="Minutos"
            type="number"
            inputProps={{ min: 0, max: 59 }}
            value={minutes || ""}
            onChange={(e) => {
              let m = parseInt(e.target.value) || 0;
              if (m > 59) m = 59;
              setMinutes(m);
              updateDuracionAprox(hours, m);
            }}
            placeholder="00"
            fullWidth
            style={{ maxWidth: '70px' }} // Limitar el ancho del input
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
