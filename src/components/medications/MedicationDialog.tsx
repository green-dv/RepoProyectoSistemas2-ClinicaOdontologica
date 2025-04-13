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
import { MedicationDTO } from '@/domain/entities/Medications';

interface MedicationDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  medication: MedicationDTO;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
}

export default function medicationDialog({
  open,
  onClose,
  onSubmit,
  medication,
  handleChange,
  isEditing
}: MedicationDialogProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {isEditing ? 'Editar Medicación' : 'Añadir Medicación'}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Descripción"
          name="medicacion"
          fullWidth
          margin="dense"
          value={medication.medicacion}
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