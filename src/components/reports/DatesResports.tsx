'use client';

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Chip,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ClearIcon from '@mui/icons-material/Clear';
import { useReporteCitas } from '@/presentation/hooks/useReportDate';
import { createReporteCitasHandlers } from '@/presentation/handlers/useReportDateHandler';

const ReporteCitas: React.FC = () => {
  const {
    citas,
    loading,
    error,
    fechaInicio,
    fechaFin,
    setFechaInicio,
    setFechaFin,
    setCitas,
    setLoading,
    setError,
  } = useReporteCitas();

  const { handleBuscarCitas, handleExportarPDF, handleLimpiarFiltros } = 
    createReporteCitasHandlers({
      fechaInicio,
      fechaFin,
      citas,
      setLoading,
      setError,
      setCitas,
      setFechaInicio,
      setFechaFin,
    });

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'completada':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'cancelada':
        return 'error';
      default:
        return 'default';
    }
  };

  const today = new Date();
  const minDate = new Date('2010-01-01');

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reporte de Citas
        </Typography>
        
        {/* Filtros */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filtros de Búsqueda
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Fecha Inicio"
                value={fechaInicio}
                onChange={(newDate) => {
                  setFechaInicio(newDate);

                  // Limpiar fechaFin si es anterior a la nueva fechaInicio
                  if (fechaFin && newDate && newDate > fechaFin) {
                    setFechaFin(null);
                  }
                }}
                minDate={minDate}
                maxDate={today}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
             <DatePicker
                label="Fecha Fin"
                value={fechaFin}
                onChange={setFechaFin}
                minDate={fechaInicio || new Date('2010-01-01')}
                // maxDate eliminado para permitir fechas futuras
                disabled={!fechaInicio}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleBuscarCitas}
                  disabled={loading}
                >
                  Buscar Citas
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={handleExportarPDF}
                  disabled={citas.length === 0}
                  color="secondary"
                >
                  Exportar PDF
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleLimpiarFiltros}
                  color="error"
                >
                  Limpiar
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Resultados */}
        {citas.length > 0 && (
          <Paper sx={{ p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Resultados ({citas.length} citas encontradas)
              </Typography>
              <Button
                variant="outlined"
                startIcon={<PictureAsPdfIcon />}
                onClick={handleExportarPDF}
                color="secondary"
                size="small"
              >
                Exportar PDF
              </Button>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Fecha</strong></TableCell>
                    <TableCell><strong>Nombres</strong></TableCell>
                    <TableCell><strong>Apellidos</strong></TableCell>
                    <TableCell><strong>Estado</strong></TableCell>
                    <TableCell><strong>Descripción</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {citas.map((cita, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        {new Date(cita.fecha).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell>{cita.nombres}</TableCell>
                      <TableCell>{cita.apellidos}</TableCell>
                      <TableCell>
                        <Chip
                          label={cita.estado}
                          color={getEstadoColor(cita.estado)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{cita.descripcion}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Estado vacío */}
        {!loading && citas.length === 0 && !error && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No hay citas para mostrar
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Selecciona un rango de fechas y haz clic en Buscar Citas
            </Typography>
          </Paper>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default ReporteCitas;