import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Patient } from '@/domain/entities/Patient';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PatientConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  patient: Patient | null;
  isEditing: boolean;
}

export const PatientConfirmationDialog: React.FC<PatientConfirmationDialogProps> = ({
  open,
  onClose,
  patient,
  isEditing
}) => {
  if (!patient) {
    return null;
  }

  // Format date if available
  const formattedBirthDate = patient.fechanacimiento 
    ? format(new Date(patient.fechanacimiento), 'dd MMMM yyyy', { locale: es })
    : 'No registrada';

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="patient-confirmation-dialog-title"
    >
      <DialogTitle id="patient-confirmation-dialog-title" sx={{ m: 0, p: 2 }}>
        {isEditing ? 'Paciente Actualizado' : 'Paciente Creado'}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2, pb: 3 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h6" align="center" gutterBottom>
            {isEditing
              ? 'Los datos del paciente han sido actualizados con éxito'
              : 'El paciente ha sido registrado con éxito'}
          </Typography>
          
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            bgcolor: 'background.default', 
            borderRadius: 1,
            width: '100%'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {patient.nombres} {patient.apellidos}
            </Typography>
            
            {patient.telefonopersonal && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Teléfono: {patient.telefonopersonal}
              </Typography>
            )}
            
            {patient.fechanacimiento && (
              <Typography variant="body2" color="text.secondary">
                Fecha de nacimiento: {formattedBirthDate}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClose}
          fullWidth
        >
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
};