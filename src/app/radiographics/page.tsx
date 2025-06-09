'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, TextField, Grid, IconButton,
  Divider, useTheme, Card, CardContent, List, ListItem, ListItemText
} from '@mui/material';
import {
  Print, PictureAsPdf, CloudUpload, Close, Edit, Save, Add, Delete
} from '@mui/icons-material';
import jsPDF from 'jspdf';
//import { v4 as uuidv4 } from 'uuid';

type Report = {
  id: string;
  patientName: string;
  date: string;
  description: string;
  image: string;
  markings: {x: number, y: number, type: string}[];
};

export default function RadiographicsPage() {
  const theme = useTheme();
  const [image, setImage] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawings, setDrawings] = useState<{x: number, y: number, type: string}[]>([]);
  const [currentTool, setCurrentTool] = useState<'circle' | 'cross' | null>(null);
  const [reportText, setReportText] = useState('');
  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reports, setReports] = useState<Report[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'new' | 'edit' | 'view'>('list');
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cargar reportes guardados al iniciar
  useEffect(() => {
    const savedReports = localStorage.getItem('dentalReports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
  }, []);

  // Obtener el reporte actual cuando cambia el modo de vista
  const currentReport = currentReportId 
    ? reports.find(report => report.id === currentReportId)
    : null;

  // Cargar datos del reporte cuando entramos en modo edición/visualización
  useEffect(() => {
    if (viewMode === 'edit' || viewMode === 'view') {
      if (currentReport) {
        setPatientName(currentReport.patientName);
        setDate(currentReport.date);
        setReportText(currentReport.description);
        setImage(currentReport.image);
        setDrawings(currentReport.markings);
      }
    } else if (viewMode === 'new') {
      // Resetear formulario para nuevo reporte
      setPatientName('');
      setDate(new Date().toISOString().split('T')[0]);
      setReportText('');
      setImage(null);
      setDrawings([]);
      setCurrentReportId(null);
    }
  }, [viewMode, currentReportId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!currentTool || !canvasRef.current || viewMode !== 'new' && viewMode !== 'edit') return;
    
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    setDrawings([...drawings, { x, y, type: currentTool }]);
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  const clearDrawings = () => {
    setDrawings([]);
  };

  const saveReport = () => {
    if (!image || !reportText || !patientName) return;
    
    const reportData = {
      id: currentReportId,
      patientName,
      date,
      description: reportText,
      image,
      markings: drawings
    };
    
    let updatedReports;
    if (currentReportId) {
      // Editar reporte existente
      updatedReports = reports.map(report => 
        report.id === currentReportId ? reportData : report
      );
    } else {
      // Nuevo reporte
      updatedReports = [...reports, reportData];
    }
    
    setReports(updatedReports);
    localStorage.setItem('dentalReports', JSON.stringify(updatedReports));
    
    // Volver a la lista
    setViewMode('list');
  };

  const deleteReport = (id: string) => {
    const updatedReports = reports.filter(report => report.id !== id);
    setReports(updatedReports);
    localStorage.setItem('dentalReports', JSON.stringify(updatedReports));
  };

  const renderCanvas = () => {
    if (!canvasRef.current || !image) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      
      // Draw markings
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 3;
      
      for (let i = 0; i < drawings.length; i++) {
        const mark = drawings[i];
        
        if (mark.type === 'circle') {
          ctx.beginPath();
          ctx.arc(mark.x, mark.y, 20, 0, 2 * Math.PI);
          ctx.stroke();
        } 
        else if (mark.type === 'cross') {
          ctx.beginPath();
          ctx.moveTo(mark.x - 15, mark.y - 15);
          ctx.lineTo(mark.x + 15, mark.y + 15);
          ctx.moveTo(mark.x + 15, mark.y - 15);
          ctx.lineTo(mark.x - 15, mark.y + 15);
          ctx.stroke();
        }
      }
    };
  };

  useEffect(() => {
    renderCanvas();
  }, [drawings, image]);

  const exportPDF = () => {
    if (!image || !reportText) return;
    
    const pdf = new jsPDF();
    
    // Título
    pdf.setFontSize(18);
    pdf.text('Reporte Radiográfico Dental', 105, 15, { align: 'center' });
    
    // Información del paciente
    pdf.setFontSize(12);
    pdf.text(`Paciente: ${patientName}`, 15, 25);
    pdf.text(`Fecha: ${new Date(date).toLocaleDateString()}`, 15, 30);
    
    // Descripción
    pdf.text('Observaciones:', 15, 40);
    const splitText = pdf.splitTextToSize(reportText, 180);
    pdf.text(splitText, 15, 45);
    
    // Imagen (ajustada al ancho de la página)
    const img = new Image();
    img.src = image;
    
    const imgWidth = 180;
    const imgHeight = (img.height * imgWidth) / img.width;
    pdf.addImage(image, 'JPEG', 15, 60, imgWidth, imgHeight);
    
    pdf.save(`reporte-${patientName}.pdf`);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {viewMode === 'list' && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="h4">Radiografías Guardadas</Typography>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={() => setViewMode('new')}
            >
              Nuevo Reporte
            </Button>
          </Box>
          
          <List>
            {reports.length === 0 ? (
              <Typography variant="body1" sx={{ p: 2 }}>
                No hay radiografías guardadas
              </Typography>
            ) : (
              reports.map((report) => (
                <ListItem 
                  key={report.id}
                  secondaryAction={
                    <>
                      <IconButton 
                        onClick={() => {
                          setCurrentReportId(report.id);
                          setViewMode('edit');
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        onClick={() => {
                          setCurrentReportId(report.id);
                          setViewMode('view');
                        }}
                      >
                        <Save />
                      </IconButton>
                      <IconButton onClick={() => deleteReport(report.id)}>
                        <Delete color="error" />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={report.patientName}
                    secondary={`${report.date} - ${report.description.substring(0, 50)}...`}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      )}

      {(viewMode === 'new' || viewMode === 'edit' || viewMode === 'view') && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="h4">
              {viewMode === 'new' ? 'Nuevo Reporte' : 
               viewMode === 'edit' ? 'Editar Reporte' : 'Ver Reporte'}
            </Typography>
            <Button onClick={() => setViewMode('list')}>
              Volver a la lista
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Información del Paciente
                  </Typography>
                  <TextField
                    fullWidth
                    label="Nombre del Paciente"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    disabled={viewMode === 'view'}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Fecha"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={viewMode === 'view'}
                    InputLabelProps={{ shrink: true }}
                  />
                </CardContent>
              </Card>

              {(!image && viewMode !== 'view') && (
                <Card sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box textAlign="center">
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="radiographic-upload"
                      type="file"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="radiographic-upload">
                      <Button variant="outlined" component="span" startIcon={<CloudUpload />}>
                        Subir Radiografía
                      </Button>
                    </label>
                  </Box>
                </Card>
              )}

              {(image || viewMode === 'view') && (
                <Box sx={{ position: 'relative' }}>
                  <canvas
                    ref={canvasRef}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseUp={handleCanvasMouseUp}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '500px',
                      border: '1px solid #ddd',
                      cursor: (viewMode === 'new' || viewMode === 'edit') && currentTool ? 'crosshair' : 'default',
                    }}
                  />
                  
                  {(viewMode === 'new' || viewMode === 'edit') && (
                    <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        color={currentTool === 'circle' ? 'primary' : 'default'}
                        onClick={() => setCurrentTool(currentTool === 'circle' ? null : 'circle')}
                        title="Marcar caries"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color={currentTool === 'cross' ? 'primary' : 'default'}
                        onClick={() => setCurrentTool(currentTool === 'cross' ? null : 'cross')}
                        title="Marcar con cruz"
                      >
                        <Close fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={clearDrawings}
                        title="Limpiar marcas"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Informe Radiográfico
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={12}
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    disabled={viewMode === 'view'}
                    placeholder="Descripción de hallazgos, caries, tratamientos recomendados..."
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {(viewMode === 'new' || viewMode === 'edit') && (
            <Box sx={{ mt: 3 }} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={() => setViewMode('list')}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={saveReport}
                disabled={!image || !reportText || !patientName}
                startIcon={<Save />}
              >
                {viewMode === 'new' ? 'Guardar Reporte' : 'Actualizar Reporte'}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={exportPDF}
                disabled={!image || !reportText}
                startIcon={<PictureAsPdf />}
              >
                Exportar PDF
              </Button>
            </Box>
          )}

          {viewMode === 'view' && (
            <Box sx={{ mt: 3 }} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={() => setViewMode('list')}>
                Volver
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={exportPDF}
                startIcon={<PictureAsPdf />}
              >
                Exportar PDF
              </Button>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}