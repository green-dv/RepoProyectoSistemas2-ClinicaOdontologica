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
import { IllnessDTO } from '@/domain/entities/Illnesses';

interface IllnessDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  illness: IllnessDTO;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
}

export default function illnessDialog({
  open,
  onClose,
  onSubmit,
  illness,
  handleChange,
  isEditing
}: IllnessDialogProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {isEditing ? 'Editar Enfermedad' : 'Añadir Enfermedad'}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Descripción"
          name="enfermedad"
          fullWidth
          margin="dense"
          value={illness.enfermedad}
          onChange={handleChange}
          required
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