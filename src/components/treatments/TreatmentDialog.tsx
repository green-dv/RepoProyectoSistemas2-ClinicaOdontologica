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
import { TreatmentDTO } from '@/domain/entities/Treatments';

interface TreatmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  treatment: TreatmentDTO;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
}

export default function TreatmentDialog({
  open,
  onClose,
  onSubmit,
  treatment,
  handleChange,
  isEditing
}: TreatmentDialogProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {isEditing ? 'Editar Tratamiento' : 'Añadir Tratamiento'}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre"
          name="nombre"
          fullWidth
          margin="dense"
          value={treatment.nombre}
          onChange={handleChange}
          required
        />
        <TextField
          label="Descripción"
          name="descripcion"
          fullWidth
          margin="dense"
          value={treatment.descripcion}
          onChange={handleChange}
        />
        <TextField
          label="Precio"
          name="precio"
          type="number"
          fullWidth
          margin="dense"
          value={treatment.precio}
          onChange={handleChange}
          InputProps={{
            startAdornment: 'Bs '
          }}
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