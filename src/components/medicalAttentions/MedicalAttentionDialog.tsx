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
import { MedicalAttentionDTO } from '@/domain/entities/MedicalAttentions';

interface MedicalAttentionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  medicalAttention: MedicalAttentionDTO;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
}

export default function medicalAttentionDialog({
  open,
  onClose,
  onSubmit,
  medicalAttention,
  handleChange,
  isEditing
}: MedicalAttentionDialogProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {isEditing ? 'Editar Atención Médica' : 'Añadir Atención Médica'}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Descripción"
          name="atencion"
          fullWidth
          margin="dense"
          value={medicalAttention.atencion}
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