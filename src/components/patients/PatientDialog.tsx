import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface PatientDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  children?: React.ReactNode;
  disableBackdropClick?: boolean;
  fullWidth?: boolean;
  showActions?: boolean;
}

export const PatientDialog: React.FC<PatientDialogProps> = ({
  open,
  onClose,
  title,
  description,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  onConfirm,
  confirmColor = 'primary',
  maxWidth = 'sm',
  loading = false,
  children,
  disableBackdropClick = false,
  fullWidth = true,
  showActions = true
}) => {
  
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disableBackdropClick) {
      event.stopPropagation();
      return;
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm && !loading) {
      onConfirm();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      onClick={handleBackdropClick}
      aria-labelledby="patient-dialog-title"
    >
      <DialogTitle id="patient-dialog-title">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <IconButton aria-label="close" onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {description && (
          <DialogContentText sx={{ mb: 2 }}>
            {description}
          </DialogContentText>
        )}
        {children}
      </DialogContent>
      
      {showActions && (
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button 
            onClick={handleConfirm} 
            color={confirmColor} 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {confirmText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};