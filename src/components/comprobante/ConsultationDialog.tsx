'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, LinearProgress,
  IconButton, CircularProgress, Alert, Snackbar,
  Paper, Divider, Fade,
  TextField
} from '@mui/material';
import { 
  Close, 
  PhotoCamera,
  AddPhotoAlternate, 
  Save,
  FileUpload,
  InsertDriveFile,
  Check
} from '@mui/icons-material';
import Image from 'next/image';
import { Payment } from '@/domain/entities/Payments';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import useConsultationPaymentPlanHandlers from '@/presentation/handlers/useConsultationPaymentPlanHandler';

interface ComprobanteDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (idpago: number, enlaceComprobante: string | null) => void;
  payment: Payment;
  idpago: number;
  montotal: number;
  cuotas: number;
  paymentIndex: number;
  fechapago: Date;
  montopago: number;
  setFechaPago: (v_fecha: Date) => void;
  setMontoPago: (v_monto: number) => void;
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
}

const ConsultationDialog: React.FC<ComprobanteDialogProps> = ({
  open,
  onClose,
  payment,
  idpago,
  setMontoPago,
  setFechaPago,
  montotal,
  cuotas,
  fechapago,
  montopago,
  paymentIndex,
  payments,
  setPayments
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [montoPagoOriginal, setMontoPagoOriginal] = useState(0);

  const hasExistingComprobante = !!payment.enlacecomprobante;
  const hasNewComprobante = !!uploadedFile;
  const showEmptyState = !hasExistingComprobante && !hasNewComprobante;

  const {recalculatePayments2} = useConsultationPaymentPlanHandlers();


  useEffect(() => {
    if (!open) {
      setError('');
      setUploadProgress(0);
      setSuccess(false);
      setMontoPago(0);
      setFechaPago(new Date());
    } else{
      setMontoPagoOriginal(payment.montopagado ?? 0);
      setMontoPago(payment.montopagado ?? 0);
      setFechaPago(new Date(payment.fechapago ?? new Date()));
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      if (payment.enlacecomprobante) {
        setPreviewUrl(payment.enlacecomprobante);
        setImageLoading(true);
        setUploadedFile(null);
      } else {
        setPreviewUrl('');
        setUploadedFile(null);
        setImageLoading(false);
      }
    }
  }, [payment.enlacecomprobante, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo no debe exceder 5MB');
      return;
    }

    setError('');
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageLoading(true);
  };
  const handleClose = async () => {
    setError('');
    const isValid = await handleInputValidations();
    if (!isValid) {
      return;
    }

    const updatedPayments = handleGuardarPago();

    console.log('Updated Payments');
    console.log(updatedPayments);

    const payments2 = recalculatePayments2(montotal, cuotas, updatedPayments);

    console.log('new Payments');
    console.log(await payments2);

    setPayments(await payments2);
    handleSaveComprobante();
    onClose();
  };


  const handleInputValidations = async () => {
    console.log('Se entro a las validaciones');
    const pagosPagados = payments.filter(
      (p) =>
        p.montopagado &&
        p.montopagado > 0
    );
    const pagosPendientes = payments.filter(
      (p) => 
        (p.estado === 'pendiente' ||
        p.estado === 'editado') &&
        Number(p.montopagado ?? 0) === 0
    );
    console.log('Todos los pagos');
    console.log(payments);
    console.log('Pagos pendientes');
    console.log(pagosPendientes);
    const montoPagadoTotal = pagosPagados.reduce((total, p) => total + Number(p.montopagado ?? 0), 0);
    const montoPendienteTotal = pagosPendientes.reduce((total, p) => total + Number(p.montoesperado ?? 0), 0);
    if(montopago < 20){
      setError('EL monto ingresado tiene que ser mayor a 20');
      return false;
    }
    const fechaPagoDate = new Date(fechapago);
    const now = new Date();

    // Establecer fecha mínima permitida: primer día del mes anterior
    const fechaMinima = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    if (fechaPagoDate < fechaMinima) {
      /*setError('La fecha ingresada es muy antigua');
      return false;*/
    }

    if(new Date(fechapago).getDate() > new Date().getDate()+2){
      setError('La fecha ingresada no puede ser posterior a la fecha actual');
      return false;
    }
    if(montoPagadoTotal + montopago - montoPagoOriginal > montoPagadoTotal + montoPendienteTotal){
      const a = montoPagadoTotal + montopago - montoPagoOriginal;
      const b = montoPendienteTotal;
      setError('La suma de los pagos es superior al monto a pagar en el plan de pagos (' + b + ')');
      console.log('La suma de los pagos es superior al monto a pagar en el plan de pagos');
      console.log(a + ' - ' + b);
      return false;
    }
    console.log('se salieron de las validaciones');
    return true;
  };

  const handleImageChange = (value: string | null) => {
    setPayments(prev =>
      prev.map((p, i) =>
        i === paymentIndex ? { ...p, enlacecomprobante: value } : p
      )
    );
  };
  
  const handleSaveComprobante = async () => {
    // si no hay ni archivo nuevo ni comprobante existente, nada que hacer
    if (!uploadedFile && !hasExistingComprobante) return;
  
    setLoading(true);
    setError('');
    setUploadProgress(0);
  
    try {
      if (uploadedFile) {
        // Simulación de progreso
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + Math.random() * 15, 95));
        }, 500);
  
        // Preparamos el FormData para Pinata
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append(
          'pinataMetadata',
          JSON.stringify({
            name: `comprobante-${idpago}-${Date.now()}`,
            keyvalues: { pagoId: idpago.toString(), tipo: 'comprobante' }
          })
        );
        formData.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));
  
        // Subimos a Pinata
        const resp = await fetch('/api/files', {
          method: 'POST',
          body: formData
        });
  
        clearInterval(progressInterval);
        setUploadProgress(96);
  
        if (!resp.ok) {
          const err = await resp.json();
          throw new Error(err.error ?? 'Error al subir a Pinata');
        }
  
        const { IpfsHash } = await resp.json();
        const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
  
        // 👉 Aquí delegamos al primer handler para actualizar el state
        handleImageChange(gatewayUrl);
  
        setUploadProgress(100);
        setSuccess(true);
  
      }
      else if (hasExistingComprobante && !previewUrl) {
        // quitar comprobante
        handleImageChange(null);
        setSuccess(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = () => {
    setPreviewUrl('');
    setUploadedFile(null);
    setError('');
  };

  const handleCloseSnackbar = () => setSuccess(false);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleGuardarPago = (): Payment[] => {
    const updatedPayment: Payment = {
      ...payments[idpago],
      montopagado: montopago,
      fechapago: fechapago ?? new Date(),
      estado: payment?.estado,
      enlacecomprobante: previewUrl || null,
    };

    const updatedPayments = [...payments];
    updatedPayments[idpago] = updatedPayment;

    setPayments(updatedPayments);

    return updatedPayments;
  };

  

  return (
    <>
      <Dialog 
        open={open} 
        onClose={loading ? undefined : onClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            bgcolor: 'primary.main',
            color: 'white',
            py: 1.5
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {hasExistingComprobante && !hasNewComprobante ? (
              <InsertDriveFile fontSize="small" />
            ) : (
              <FileUpload fontSize="small" />
            )}
            <Typography variant="h6">
              {hasExistingComprobante && !hasNewComprobante ? 'Comprobante de Pago' : 'Subir Comprobante'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} disabled={loading} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ width: '100%', mb: 1 }}
                variant="filled"
              >
                {error}
              </Alert>
            )}

            {/* Empty state */}
            {showEmptyState ? (
              <Paper 
                sx={{
                  width: '100%', 
                  height: 350, 
                  border: '2px dashed #ccc',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexDirection: 'column',
                  bgcolor: 'grey.50',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'grey.100'
                  }
                }}
                component="label"
              >
                <AddPhotoAlternate sx={{ fontSize: 64, color: 'primary.light', mb: 2 }} />
                <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                  No hay comprobante cargado
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<PhotoCamera />} 
                  disabled={loading}
                  sx={{ borderRadius: 28 }}
                  //onClick={()=>{handleFileChange(e.)}}
                >
                  Seleccionar imagen
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>
              </Paper>
            ) : (
              <>
                {/* Image preview */}
                <Paper 
                  elevation={3} 
                  sx={{ 
                    width: '100%',
                    height: 350, 
                    position: 'relative', 
                    bgcolor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    borderRadius: 2
                  }}
                >
                  {imageLoading && previewUrl && (
                    <Box sx={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                      <CircularProgress size={40} />
                    </Box>
                  )}
                  
                  {previewUrl ? (
                    <Fade in={!imageLoading} timeout={500}>
                      <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                        <Image
                          src={previewUrl}
                          alt="Vista previa del comprobante"
                          fill
                          style={{ objectFit: 'contain' }}
                          unoptimized
                          onLoad={handleImageLoad}
                          onError={() => {
                            setError('Error al cargar la imagen');
                            setImageLoading(false);
                          }}
                        />
                      </Box>
                    </Fade>
                  ) : (
                    <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
                      Vista previa no disponible
                    </Typography>
                  )}
                </Paper>

                {/* Upload progress bar */}
                {loading && (
                  <Box sx={{ width: '100%', mt: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={uploadProgress} 
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {uploadProgress < 100 ? `Subiendo... ${Math.round(uploadProgress)}%` : 'Procesando...'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {Math.round(uploadProgress)}%
                      </Typography>
                    </Box>
                  </Box>
                )}
              </>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* ...tu código existente para preview o empty state... */}

              {
                payment.estado !== 'completado' ? (
                  <>
                    {/* Date Picker para la fecha de pago */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Fecha de pago"
                        value={fechapago}
                        onChange={(newValue: Date | null) => {
                          setFechaPago(newValue ?? new Date());
                        }}
                        slotProps={{ textField: { fullWidth: true } }}
                        disableFuture
                      />
                    </LocalizationProvider>

                    {/* Input para monto pagado */}
                    <TextField
                      label="Monto pagado"
                      type="number"
                      fullWidth
                      value={montopago}
                      onChange={(e) => setMontoPago(Number(e.target.value))}
                      inputProps={{ min: 0 }}
                    />
                  </>
                ) : (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Fecha de pago: {payment.fechapago ? new Date(payment.fechapago).toLocaleDateString() : 'No registrada'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Monto pagado: {payment.montopagado ?? 0} Bs.
                    </Typography>
                  </>
                )
              }
              
            </Box>
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
          {/* Left side buttons */}
          <Box>
            <Button 
              component="label" 
              variant="outlined" 
              startIcon={<PhotoCamera />} 
              disabled={loading}
              sx={{ mr: 1, borderRadius: 28 }}
            >
              {!hasNewComprobante ? 'Cambiar' : 'Seleccionar otra'}
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            <Button 
              variant="outlined" 
              color="success" 
              startIcon={<Check />} 
              onClick={handleClose}
              sx={{ mr:1, borderRadius: 28 }}
            >
              Confirmar
            </Button>
          </Box>

          {/* Right side buttons */}
          <Box>
            <Button 
              onClick={() => {
              console.log(payments);
              onClose();
              }}
              disabled={loading}
              sx={{ mr: 1, borderRadius: 28 }}
            >
              Cancelar
            </Button>
            {(previewUrl && !loading) && (
              <Button
                variant="contained"
                onClick={handleSaveComprobante}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                sx={{ borderRadius: 28 }}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      {/* Success notification */}
      <Snackbar open={success} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
          Comprobante guardado exitosamente
        </Alert>
      </Snackbar>
    </>
  );
};

export default ConsultationDialog;
