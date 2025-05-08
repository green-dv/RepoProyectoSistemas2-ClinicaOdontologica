import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Box,
  Typography
} from '@mui/material';
import { Delete as DeleteIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { Patient } from '@/domain/entities/Patient';

interface PatientDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  patient: Patient | null;
  onConfirmDelete: (id: number) => Promise<boolean>;
}

export const PatientDeleteDialog: React.FC<PatientDeleteDialogProps> = ({
  open,
  onClose,
  patient,
  onConfirmDelete
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  if (!patient) {
    return null;
  }

  const handleDelete = async () => {
    if (!patient.idpaciente) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await onConfirmDelete(patient.idpaciente);
      
      if (result) {
        setSuccess(true);
        // Close dialog after showing success message briefly
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 1500);
      } else {
        throw new Error('No se pudo eliminar el paciente');
      }
    } catch (err) {
      console.error('Error en eliminación:', err);
      setError('Ocurrió un error al intentar eliminar el paciente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      aria-labelledby="delete-dialog-title"
    >
      <DialogTitle id="delete-dialog-title">
        Confirmar Eliminación
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Paciente eliminado con éxito
          </Alert>
        )}
        
        {!success && (
          <>
            <DialogContentText>
              ¿Está seguro que desea eliminar el siguiente paciente?
            </DialogContentText>
            
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {patient.nombres} {patient.apellidos}
              </Typography>
              {patient.telefonopersonal && (
                <Typography variant="body2" color="text.secondary">
                  Teléfono: {patient.telefonopersonal}
                </Typography>
              )}
            </Box>
            
            <DialogContentText sx={{ mt: 2, color: 'error.main', fontWeight: 'medium' }}>
              Esta acción no se puede deshacer. El paciente será inhabilitado en el sistema.
            </DialogContentText>
          </>
        )}
      </DialogContent>
      <DialogActions>
        {!success && (
          <>
            <Button 
              onClick={onClose}
              disabled={loading}
              startIcon={<CancelIcon />}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleDelete}
              color="error"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
            >
              Eliminar
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};