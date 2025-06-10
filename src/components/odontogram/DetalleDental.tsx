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

import { Diagnosis } from '@/domain/entities/Diagnosis';
import { Cara, DentalPiece } from '@/presentation/config/odontogrmaConfig';

interface DetalleDentalProps {
  diente: DentalPiece | null;
  diagnosis: Diagnosis[] | null;
  onFaceStateChange: (idpieza: number, idcara: number, iddiagnostico: number, codigofdi: number, nombrepieza: string, cara: string, idodontograma: number) => void;
}

const DetalleDental: React.FC<DetalleDentalProps> = ({
  diente,
  diagnosis,
  onFaceStateChange
}) => {
  const facesConfig = [
    { id: 1, name: 'Vestibular' },
    { id: 2, name: 'Mesial' },
    { id: 3, name: 'Distal' },
    { id: 4, name: 'Lingual' },
    { id: 5, name: 'Oclusal/Incisal' }
  ];

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

  const getCuadranteNombre = (cuadrante: number): string => {
    const nombres = {
      1: 'Superior Derecho',
      2: 'Superior Izquierdo',
      3: 'Inferior Izquierdo',
      4: 'Inferior Derecho'
    };
    return nombres[cuadrante as keyof typeof nombres] || 'Desconocido';
  };

  const getCaraData = (nombre: string): Cara | undefined =>
    diente.caras.find((c) => c.nombrecara.toLowerCase() === nombre.toLowerCase());

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

      <Box mb={3}>
        {facesConfig.map(({ name }) => {
          const cara = getCaraData(name);
          if (!cara) return null;

          return (
            <Box key={name} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="body2" sx={{ minWidth: 100 }}>
                {name}:
              </Typography>
              <Chip
                label={cara.descripciondiagnostico}
                size="small"
                sx={{
                  backgroundColor: cara.colorDiagnostico || '#000000',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ my: 2 }} />

      {facesConfig.map(({ id, name }) => {
        const cara = getCaraData(name);
        if (!cara) return null;

        return (
          <Accordion key={name} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2" fontWeight="medium">
                Editar {name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1}>
                {diagnosis?.map((estado, index) => {
                  const esSeleccionado = cara.iddiagnostico === estado.iddiagnostico;

                  return (
                    <Grid item xs={6} key={`${name}-${estado.iddiagnostico ?? index}`}>
                      <Button
                        fullWidth
                        variant={esSeleccionado ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => onFaceStateChange(
                          diente.numero,
                          id,
                          estado.iddiagnostico,
                          diente.numero,
                          diente.nombre,
                          name.toLowerCase(),
                          0
                        )}
                        sx={{
                          mb: 0.5,
                          textTransform: 'none',
                          fontSize: '0.75rem',
                          backgroundColor: esSeleccionado ? estado.enlaceicono : 'transparent',
                          color: esSeleccionado ? 'white' : 'inherit',
                          '&:hover': {
                            backgroundColor: esSeleccionado
                              ? estado.enlaceicono
                              : 'rgba(0,0,0,0.04)',
                          },
                        }}
                      >
                        {estado.descripcion}
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Paper>
  );
};

export default DetalleDental;
