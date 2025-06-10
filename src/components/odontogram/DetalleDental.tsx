'use client';

import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DentalPiece, EstadoDental, CaraDental } from '@/presentation/config/odontogrmaConfig';


interface DetalleDentalProps {
  //selectedTooth: number | null;
  diente: DentalPiece | null;
  diagnosis: Diagnosis[] | null;
  onFaceStateChange: (numero: number, cara: CaraDental, estado: string) => void;
}
import { Diagnosis } from '@/domain/entities/Diagnosis';
import { Cara } from '@/domain/entities/Cara';

const DetalleDental: React.FC<DetalleDentalProps> = ({
  diente,
  diagnosis,
  onFaceStateChange
}) => {


  const estados: string[] = diagnosis ? diagnosis.map(d => d.descripcion) : ['sano', 'caries'];
  /*const estados: EstadoDental[] = [
    'sano', 'caries', 'obturado', 'extraido', 
    'endodoncia', 'corona', 'implante'
  ];*/

  const caras: CaraDental[] = ['vestibular', 'mesial', 'lingual', 'distal', 'oclusal'];

  let getEstadoLabel = (estado: string): string => estado; // por defecto
  let getEstadoColor = (estado: string): string => '#000000'; // color por defecto

  if (diagnosis) {
    const labels: Record<string, string> = {};
    const colors: Record<string, string> = {};

    diagnosis.forEach((diag) => {
      labels[diag.descripcion] = diag.descripcion;
      colors[diag.descripcion] = diag.enlaceicono || '#000000';
    });

    getEstadoLabel = (estado: string): string => {
      return labels[estado] || estado;
    };

    getEstadoColor = (estado: string): string => {
      return colors[estado] || '#000000';
    };
  } else {
    const fallbackLabels: Record<string, string> = {
      sano: 'Sano',
      caries: 'Caries',
    };

    const fallbackColors: Record<string, string> = {
      sano: '#4caf50',
      caries: '#f44336',
    };

    getEstadoLabel = (estado: string): string => {
      return fallbackLabels[estado] || estado;
    };

    getEstadoColor = (estado: string): string => {
      return fallbackColors[estado] || '#000000';
    };
  }
  

  const getCaraLabel = (cara: CaraDental): string => {
    const labels = {
      vestibular: 'Vestibular',
      mesial: 'Mesial',
      lingual: 'Lingual/Palatina',
      distal: 'Distal',
      oclusal: 'Oclusal/Incisal'
    };
    return labels[cara];
  };

  const getCuadranteNombre = (cuadrante: number): string => {
    const nombres = {
      1: 'Superior Derecho',
      2: 'Superior Izquierdo',
      3: 'Inferior Izquierdo',
      4: 'Inferior Derecho'
    };
    return nombres[cuadrante as keyof typeof nombres] || 'Desconocido';
  };

  /*const getEstadoColor = (estado: EstadoDental): string => {
    const colors = {
      sano: '#4caf50',
      caries: '#f44336',
      obturado: '#2196f3',
      extraido: '#9e9e9e',
      endodoncia: '#ff9800',
      corona: '#9c27b0',
      implante: '#607d8b'
    };
    return colors[estado];
  };*/

  if (!diente) {
    return (
      <Paper sx={{ p: 3, height: 'fit-content' }}>
        <Typography variant="h6" gutterBottom color="primary">
          Información del Diente
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Selecciona un diente para ver sus detalles y editar cada cara dental
        </Typography>
        <Box 
          sx={{ 
            mt: 4, 
            textAlign: 'center',
            opacity: 0.5,
            fontSize: '3rem'
          }}
        >
          🦷
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, height: 'fit-content' }}>
      <Typography variant="h6" gutterBottom color="primary">
        Diente {diente.numero}
      </Typography>
      
      <Box mb={3}>
        <Typography variant="subtitle1" gutterBottom>
          {diente.nombre}
        </Typography>
        <Chip 
          label={getCuadranteNombre(diente.cuadrante)}
          variant="outlined"
          size="small"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" gutterBottom>
        Estado por Caras:
      </Typography>

      {/* Estado actual de cada cara */}
      <Box mb={3}>
        {caras.map((cara) => (
          <Box key={cara} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography variant="body2" sx={{ minWidth: 100 }}>
              {getCaraLabel(cara)}:
            </Typography>
            <Chip
              label={getEstadoLabel(diente.caras[cara])}
              size="small"
              sx={{
                backgroundColor: getEstadoColor(diente.caras[cara]),
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Controles para cambiar estado por cara */}
      {caras.map((cara) => (
        <Accordion key={cara} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" fontWeight="medium">
              Editar {getCaraLabel(cara)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1}>
              {estados.map((estado) => (
                <Grid item xs={6} key={`${cara}-${estado}`}>
                  <Button
                    fullWidth
                    variant={diente.caras[cara] === estado ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => onFaceStateChange(diente.numero, cara, estado)}
                    sx={{ 
                      mb: 0.5,
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      backgroundColor: diente.caras[cara] === estado ? getEstadoColor(estado) : 'transparent',
                      '&:hover': {
                        backgroundColor: diente.caras[cara] === estado ? getEstadoColor(estado) : 'rgba(0,0,0,0.04)',
                      }
                    }}
                  >
                    {getEstadoLabel(estado)}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
};

export default DetalleDental;