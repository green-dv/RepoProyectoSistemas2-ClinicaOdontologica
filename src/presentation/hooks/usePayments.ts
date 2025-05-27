import React, { useState } from 'react';
import { AlertColor } from '@mui/material';
import { Payment } from '@/domain/entities/Payments';

export interface SnackbarMessage {
  message: string;
  severity: AlertColor;
}

export interface PaymentPlansState {
  paymentIndex: number | null;

  status: string | 'pendiente';
  comprobanteDialogOpen: boolean | false;
  selectedPayment: Payment | null;
  selectedIndex: number | 0;
  fechapago: Date;
  montopago: number;

  setPaymentIndex: React.Dispatch<React.SetStateAction<number>>;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  setComprobanteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPayment: React.Dispatch<React.SetStateAction<Payment | null>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  setFechaPago: React.Dispatch<React.SetStateAction<Date>>;
  setMontoPago: React.Dispatch<React.SetStateAction<number>>;

  setPreviewUrl: React.Dispatch<React.SetStateAction<string>>;
  setUploadedFile: React.Dispatch<React.SetStateAction<File | null>>;
  setLoadingPayment: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setImageLoading: React.Dispatch<React.SetStateAction<boolean>>;

  //Imagenes
  previewUrl: string;
  uploadedFile: File | null;
  loadingPayment: boolean;
  error: string;
  uploadProgress: number;
  success: boolean;
  imageLoading: boolean;

  snackbar: SnackbarMessage | null;
  showMessage: (message: string, severity: AlertColor) => void;
}

export default function usePaymentPlans(): PaymentPlansState {
  const [paymentIndex, setPaymentIndex] = useState(0);
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  const [status, setStatus] = React.useState('pendiente');
  const [comprobanteDialogOpen, setComprobanteDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedIndex ,setSelectedIndex] = useState(0);
  const [fechapago ,setFechaPago] = useState(new Date());
  const [montopago ,setMontoPago] = useState(0);

  //imagenes
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const showMessage = (message: string, severity: AlertColor) => {
    setSnackbar({ message, severity });
  };

  return {
    paymentIndex,
    status,
    comprobanteDialogOpen,
    selectedPayment,
    selectedIndex,
    fechapago,
    montopago,

    setPaymentIndex,
    setStatus,
    setComprobanteDialogOpen,
    setSelectedPayment,
    setSelectedIndex,
    setFechaPago,
    setMontoPago,

    //Imagenes
    previewUrl,
    uploadedFile,
    loadingPayment,
    error,
    uploadProgress,
    success,
    imageLoading,

    setPreviewUrl,
    setUploadedFile,
    setLoadingPayment,
    setError,
    setUploadProgress,
    setSuccess,
    setImageLoading,

    snackbar,
    showMessage
  };
}