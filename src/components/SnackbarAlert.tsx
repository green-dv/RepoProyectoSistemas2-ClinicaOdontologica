'use client';

import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

export interface SnackbarMessage {
  message: string;
  severity: AlertColor;
}

interface SnackbarAlertProps {
  snackbar: SnackbarMessage | null;
  onClose: () => void;
}

export default function SnackbarAlert({ snackbar, onClose }: SnackbarAlertProps) {
  if (!snackbar) return null;
  
  return (
    <Snackbar 
      open={true}
      autoHideDuration={6000} 
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert 
        onClose={onClose} 
        severity={snackbar.severity}
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}