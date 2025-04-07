'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { DateDTO } from '@/domain/entities/Dates';

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
        <TextField
          label="Fecha Registrada"
          name="fecha"
          type='datetime-local'
          fullWidth
          margin="dense"
          value={date.fecha}
          onChange={handleChange}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Paciente"
          name="idpaciente"
          type='number'
          fullWidth
          margin="dense"
          value={date.idpaciente}
          onChange={handleChange}
        />
        <TextField
          label="Descripcion"
          name="descripcion"
          type='text'
          fullWidth
          margin="dense"
          value={date.descripcion}
          onChange={handleChange}
        />
        <TextField
          label="Consulta"
          name="idconsulta"
          type="number"
          fullWidth
          margin="dense"
          value={date.idconsulta}
          onChange={handleChange}
        />
        <TextField
          label="Estado"
          name="idestadocita"
          type="number"
          fullWidth
          margin="dense"
          value={date.idestadocita}
          onChange={handleChange}
        />
        <TextField
          label="Fecha Acordada"
          name="fechacita"
          type="datetime-local"
          fullWidth
          margin="dense"
          value={date.fechacita}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Duracion Aproximada"
          name="duracionaprox"
          type="number"
          fullWidth
          margin="dense"
          value={date.duracionaprox}
          onChange={handleChange}
        />
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