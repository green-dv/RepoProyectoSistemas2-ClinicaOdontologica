'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Close, PhotoCamera, DeleteOutline, AddPhotoAlternate, Save } from '@mui/icons-material';
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const hasExistingComprobante = !!enlaceComprobante;
  const hasNewComprobante = !!uploadedFile;
  const showEmptyState = !hasExistingComprobante && !hasNewComprobante;

  useEffect(() => {
    if (!open) {
      setPreviewUrl('');
      setUploadedFile(null);
      setError('');
      setUploadProgress(0);
    }
  }, [open]);

  useEffect(() => {
    if (enlaceComprobante && !previewUrl) {
      setPreviewUrl(enlaceComprobante);
    }
  }, [enlaceComprobante, previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const file = e.target.files[0];
    
    // Validaciones
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten (JPEG, PNG, etc.)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo no debe exceder 5MB');
      return;
    }
    
    setError('');
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

const handleSaveComprobante = async () => {
    if (!uploadedFile) return;
  
    setLoading(true);
    setError('');
  
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      
      formData.append('pinataMetadata', JSON.stringify({
        name: `comprobante-${idpago}-${Date.now()}`,
        keyvalues: {
          pagoId: idpago.toString(),
          tipo: 'comprobante'
        }
      }));
  
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al subir archivo');
      }
  
      const result = await response.json();
      const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
      
      const saveResponse = await fetch(`/api/payment/${idpago}/comprobante`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enlacecomprobante: gatewayUrl }),
      });
  
      if (!saveResponse.ok) {
        throw new Error('Error al guardar en base de datos');
      }
  
      onUpload(idpago, gatewayUrl);
      onClose();
  
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
};

  const handleRemove = () => {
    setPreviewUrl('');
    setUploadedFile(null);
    if (hasExistingComprobante) {
      onUpload(idpago, null);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {hasExistingComprobante ? 'Comprobante existente' : 'Subir comprobante'}
        <IconButton onClick={onClose} disabled={loading}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ py: 3 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          minHeight: 300
        }}>
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          {showEmptyState ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: 300,
              border: '2px dashed #e0e0e0',
              borderRadius: 1,
              backgroundColor: 'background.paper',
              p: 4,
              textAlign: 'center'
            }}>
              <AddPhotoAlternate sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No hay comprobante cargado
              </Typography>
              <Button
                component="label"
                variant="contained"
                startIcon={<PhotoCamera />}
                sx={{ mt: 2 }}
                disabled={loading}
              >
                Seleccionar imagen
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{
                width: '100%',
                height: 300,
                position: 'relative',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden'
              }}>
                <Image
                  src={previewUrl}
                  alt="Comprobante de pago"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                  unoptimized
                />
              </Box>
              
              {loading && (
                <Box sx={{ width: '100%', mt: 1 }}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="caption" color="text.secondary">
                    {uploadProgress < 100 ? `Subiendo: ${uploadProgress}%` : 'Guardando...'}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Box>
          {!showEmptyState && (
            <Button
              component="label"
              variant="outlined"
              startIcon={<PhotoCamera />}
              disabled={loading}
              sx={{ mr: 2 }}
            >
              {hasExistingComprobante ? 'Cambiar' : 'Seleccionar otra'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          )}
          
          {!showEmptyState && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutline />}
              onClick={handleRemove}
              disabled={loading}
            >
              Eliminar
            </Button>
          )}
        </Box>
        
        <Box>
          <Button onClick={onClose} sx={{ mr: 1 }} disabled={loading}>
            Cancelar
          </Button>
          {(hasNewComprobante || (hasExistingComprobante && !previewUrl)) && (
            <Button
              variant="contained"
              onClick={handleSaveComprobante}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ComprobanteDialog;