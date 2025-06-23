'use client';
import React, { useEffect, useRef } from 'react';
import {
  Box, Typography, Button, Paper, TextField, Grid, IconButton,
  Card, CardContent, List, ListItem, ListItemText,
  LinearProgress
} from '@mui/material';
import {
  CloudUpload, PictureAsPdf, Save, Add
} from '@mui/icons-material';
import { Detection, Radiography } from '@/domain/entities/Radiography';

interface RadiographiesFormProps {
  p_patientId: number | null;
  creating: boolean;
  p_radiographyId: number | null;

  newRadiography: Radiography;
  detections: Detection[];
  selectedFile: File | null;
  error: string;
  previewUrl: string;
  uploadProgress: number;
  isUploading: boolean;
  drawImage: File | null;

  handleSaveRadiography: () => void;
  handleCreateRadiography: () => void;
  handleUploadAndPredict: () => void;
  handleConfiguration: (p_patientId: number | null, creating: boolean, p_radiographyId: number | null) => void;
  handlePreviewImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RadiographicsContent({
  p_patientId,
  creating,
  p_radiographyId,

  newRadiography,
  detections,
  selectedFile,
  error,
  previewUrl,
  uploadProgress,
  isUploading,
  drawImage,
  handlePreviewImageChange,
  handleSaveRadiography,
  handleCreateRadiography,
  handleUploadAndPredict,
  handleConfiguration,
}: RadiographiesFormProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cargar configuración inicial
  useEffect(() => {
    handleConfiguration(p_patientId, creating, p_radiographyId);
  }, []);

  // Renderizar imagen y detecciones
  useEffect(() => {
    if(!detections) return;
    if (!canvasRef.current || !previewUrl || detections.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Dibujar detecciones
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.font = '16px Arial';
      ctx.fillStyle = 'red';

      detections.forEach((det) => {
        const { x1, y1, x2, y2, problema } = det;
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        ctx.fillText(`${problema}`, x1 + 4, y1 + 18);
      });
    };

    img.src = previewUrl; // o imageUrl si lo estás usando
  }, [detections]);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {isUploading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
            Subiendo imagen... {uploadProgress.toFixed(0)}%
          </Typography>
        </Box>
      )}

      {/* Formulario */}
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h4">Reporte Radiologico</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {/* Mostrar <img> si aún no se ha renderizado el canvas */}
            {previewUrl && !canvasRef.current && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    marginBottom: '10px'
                  }}
                />
              </Box>
            )}

            {/* Mostrar canvas cuando esté disponible */}
            <Box sx={{ mt: 2 }}>
              <canvas
                ref={canvasRef}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '500px',
                  border: '1px solid #ddd',
                }}
              />
            </Box>
          </Grid>
          <CardContent>
          <Typography variant="h6" gutterBottom>
            Informe Radiográfico
          </Typography>

          {detections.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No se han detectado anomalías en la imagen.
            </Typography>
          ) : (
            <List dense>
              {detections.map((det, index) => {
                const nombreMostrado =
                  det.idproblema === 5 ? 'Diente Deformado o Desviado' : det.problema;
                console.log(nombreMostrado);

                return (
                  <ListItem key={index} disablePadding>
                    <ListItemText
                      primary={nombreMostrado}
                      secondary={`Confianza: ${(Number(det.confianza) * 100).toFixed(2)}%`}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </CardContent>
        </Grid>
        {!p_radiographyId && (
          <Box sx={{ mt: 3 }} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={handleUploadAndPredict}>
              Hacer Predicción
            </Button>
            <Box textAlign="center">
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="radiographic-upload"
                type="file"
                onChange={handlePreviewImageChange}
              />
              <label htmlFor="radiographic-upload">
                <Button variant="outlined" component="span" startIcon={<CloudUpload />}>
                  Cargar Imagen
                </Button>
              </label>
            </Box>
            <Button variant="contained" startIcon={<CloudUpload />} onClick={handleSaveRadiography}>
              Guardar Radiografia
            </Button>
            <Button variant="contained" color="primary" startIcon={<Save />} onClick={handleCreateRadiography}>
              Guardar Registro
            </Button>
          </Box>
        )}
        
        

          
        
      </Paper>
    </Box>
  );
}
