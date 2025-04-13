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
import { HabitDTO } from '@/domain/entities/Habits';

interface HabitDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  habit: HabitDTO;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
}

export default function habitDialog({
  open,
  onClose,
  onSubmit,
  habit,
  handleChange,
  isEditing
}: HabitDialogProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {isEditing ? 'Editar Hábito' : 'Añadir Hábito'}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Descripción"
          name="habito"
          fullWidth
          margin="dense"
          value={habit.habito}
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