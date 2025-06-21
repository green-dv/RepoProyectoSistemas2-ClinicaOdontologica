import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Alert
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Restore as RestoreIcon,
  DeleteForever as DeleteForeverIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
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

interface RestorePatientDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  patient: Patient | null;
  loading: boolean;
}

export const RestorePatientDialog: React.FC<RestorePatientDialogProps> = ({
  open,
  onClose,
  onConfirm,
  patient,
  loading,
}) => {
  if (!patient) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="restore-patient-dialog-title"
    >
      <DialogTitle id="restore-patient-dialog-title" sx={{ m: 0, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RestoreIcon color="success" />
          Restaurar Paciente
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          Esta acción restaurará el paciente y volverá a estar disponible en la lista de pacientes activos.
        </Alert>
        
        <Typography variant="body1" gutterBottom>
          ¿Está seguro que desea restaurar al siguiente paciente?
        </Typography>
        
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          bgcolor: 'background.default', 
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="h6" gutterBottom>
            {patient.nombres} {patient.apellidos}
          </Typography>
          
          {patient.telefonopersonal && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Teléfono: {patient.telefonopersonal}
            </Typography>
          )}
          
          <Typography variant="body2" color="text.secondary">
            ID: {patient.idpaciente}
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          color="inherit"
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="success"
          disabled={loading}
          startIcon={<RestoreIcon />}
        >
          {loading ? 'Restaurando...' : 'Restaurar Paciente'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Delete Permanently Dialog
interface DeletePermanentlyDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  patient: Patient | null;
  loading: boolean;
}

export const DeletePermanentlyDialog: React.FC<DeletePermanentlyDialogProps> = ({
  open,
  onClose,
  onConfirm,
  patient,
  loading,
}) => {
  if (!patient) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="delete-permanently-dialog-title"
    >
      <DialogTitle id="delete-permanently-dialog-title" sx={{ m: 0, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          Eliminar Permanentemente
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="error" sx={{ mb: 2 }}>
          <strong>¡ADVERTENCIA!</strong> Esta acción eliminará permanentemente el paciente de la base de datos.
          Esta operación no se puede deshacer.
        </Alert>
        
        <Typography variant="body1" gutterBottom>
          ¿Está completamente seguro que desea eliminar permanentemente al siguiente paciente?
        </Typography>
        
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          bgcolor: 'error.light', 
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'error.main',
          opacity: 0.9
        }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'error.contrastText' }}>
            {patient.nombres} {patient.apellidos}
          </Typography>
          
          {patient.telefonopersonal && (
            <Typography variant="body2" sx={{ color: 'error.contrastText', opacity: 0.8 }} gutterBottom>
              Teléfono: {patient.telefonopersonal}
            </Typography>
          )}
          
          <Typography variant="body2" sx={{ color: 'error.contrastText', opacity: 0.8 }}>
            ID: {patient.idpaciente}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
          Para confirmar, escriba ELIMINAR en el campo de abajo:
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          color="inherit"
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={<DeleteForeverIcon />}
        >
          {loading ? 'Eliminando...' : 'Eliminar Permanentemente'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};