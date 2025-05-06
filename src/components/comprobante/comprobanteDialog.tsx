'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, LinearProgress,
  IconButton, CircularProgress, Alert, Snackbar,
  Paper, Divider, Fade
} from '@mui/material';
import { 
  Close, 
  PhotoCamera, 
  DeleteOutline, 
  AddPhotoAlternate, 
  Save,
  FileUpload,
  InsertDriveFile
} from '@mui/icons-material';
import Image from 'next/image';

interface ComprobanteDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (idpago: number, enlaceComprobante: string | null) => void;
  enlaceComprobante: string | null;
  idpago: number;
}

const ComprobanteDialog: React.FC<ComprobanteDialogProps> = ({
  open,
  onClose,
  onUpload,
  enlaceComprobante,
  idpago
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const hasExistingComprobante = !!enlaceComprobante;
  const hasNewComprobante = !!uploadedFile;
  const showEmptyState = !hasExistingComprobante && !hasNewComprobante;

  useEffect(() => {
    if (!open) {
      setError('');
      setUploadProgress(0);
      setSuccess(false);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      if (enlaceComprobante) {
        setPreviewUrl(enlaceComprobante);
        setImageLoading(true);
        setUploadedFile(null);
      } else {
        setPreviewUrl('');
        setUploadedFile(null);
        setImageLoading(false);
      }
    }
  }, [enlaceComprobante, open]);

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

  const handleSaveComprobante = async () => {
    if (!uploadedFile && !hasExistingComprobante) return;

    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      if (uploadedFile) {
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const newProgress = prev + Math.random() * 15;
            return newProgress > 95 ? 95 : newProgress;
          });
        }, 500);

        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('pinataMetadata', JSON.stringify({
          name: `comprobante-${idpago}-${Date.now()}`,
          keyvalues: { pagoId: idpago.toString(), tipo: 'comprobante' }
        }));
        formData.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));

        const response = await fetch('/api/files', {
          method: 'POST',
          body: formData,
        });

        clearInterval(progressInterval);
        setUploadProgress(96);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al subir a Pinata');
        }

        const data = await response.json();
        const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;

        setUploadProgress(98);

        const saveResponse = await fetch(`/api/payments/${idpago}/comprobante`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enlacecomprobante: gatewayUrl }),
        });

        if (!saveResponse.ok) throw new Error('Error al guardar en base de datos');
        const saveData = await saveResponse.json();
        if (!saveData.success) throw new Error(saveData.error || 'Error al guardar');

        setUploadProgress(100);
        setSuccess(true);
        setTimeout(() => {
          onUpload(idpago, gatewayUrl);
          onClose();
        }, 1000);
      } else if (hasExistingComprobante && !previewUrl) {
        const saveResponse = await fetch(`/api/payments/${idpago}/comprobante`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enlacecomprobante: null }),
        });

        if (!saveResponse.ok) throw new Error('Error al eliminar comprobante');
        const data = await saveResponse.json();
        if (!data.success) throw new Error(data.error || 'Error al eliminar comprobante');

        onUpload(idpago, null);
        onClose();
      }
    } catch (err) {
      console.error('Error al guardar comprobante:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido');
      }
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
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
          {/* Left side buttons */}
          <Box>
            {!showEmptyState && (
              <>
                <Button 
                  component="label" 
                  variant="outlined" 
                  startIcon={<PhotoCamera />} 
                  disabled={loading}
                  sx={{ mr: 1, borderRadius: 28 }}
                >
                  {hasExistingComprobante && !hasNewComprobante ? 'Cambiar' : 'Seleccionar otra'}
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  startIcon={<DeleteOutline />} 
                  onClick={handleRemove} 
                  disabled={loading}
                  sx={{ borderRadius: 28 }}
                >
                  Eliminar
                </Button>
              </>
            )}
          </Box>

          {/* Right side buttons */}
          <Box>
            <Button 
              onClick={onClose} 
              disabled={loading}
              sx={{ mr: 1, borderRadius: 28 }}
            >
              Cancelar
            </Button>
            {(hasNewComprobante || (hasExistingComprobante && !previewUrl)) && (
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

export default ComprobanteDialog;