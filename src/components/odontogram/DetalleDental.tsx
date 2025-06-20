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
  AccordionDetails,
  TextField
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Diagnosis } from '@/domain/entities/Diagnosis';
import { Cara, DentalPiece, piezaMap } from '@/presentation/config/odontogrmaConfig';
import { OdontogramDescription } from '@/domain/entities/OdontogramDescription';

interface DetalleDentalProps {
  diente: DentalPiece | null;
  diagnosis: Diagnosis[] | null;
  isCreating: boolean;
  odontogramDescriptions: OdontogramDescription[] | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  observation: string;
  observationError: boolean;
  handleSubmit: () => void;
  onFaceStateChange: (idcara: number, iddiagnostico: number, codigofdi: number, nombrepieza: string, cara: string, idodontograma: number) => void;
}

const DetalleDental: React.FC<DetalleDentalProps> = ({
  diente,
  diagnosis,
  isCreating,
  handleChange,
  observation,
  observationError,
  handleSubmit,
  onFaceStateChange,
  odontogramDescriptions,
}) => {
  let filteredList: OdontogramDescription[] = [];
  if(diente && odontogramDescriptions) filteredList = odontogramDescriptions.filter((desc) => diente.numero === desc.codigofdi)
  const carasCombinadas = diente?.caras.map((cara) => {
    const actualizada = filteredList.find(
      (desc) => desc.cara.toLowerCase() === cara.nombrecara.toLowerCase()
    );
    return {
      ...cara,
      iddiagnostico: actualizada?.iddiagnostico ?? cara.iddiagnostico,
      descripciondiagnostico: actualizada?.diagnostico ?? cara.descripciondiagnostico,
      colorDiagnostico: actualizada?.enlaceicono ?? cara.colorDiagnostico,
    };
  });
  
  const facesConfig = [
    { id: 1, name: 'Vestibular' },
    { id: 2, name: 'Mesial' },
    { id: 3, name: 'Distal' },
    { id: 4, name: 'Lingual' },
    { id: 5, name: 'Oclusal/Incisal' }
  ];

  

  const observacionesSection = isCreating ? (
    <>
      <TextField
        label="Observaciones"
        multiline
        rows={4}
        name="observation"
        fullWidth
        margin="normal"
        value={observation}
        onChange={handleChange}
        helperText={`${observation.length}/150`}
        id={observationError ? 'outlined-error' : 'observations'}
        error={observationError}
      />

      <Button onClick={handleSubmit}>
        Registrar
      </Button>
    </>
  ) : (
    <>
      <Typography variant="body2" fontWeight="medium" gutterBottom>
        Observaciones
      </Typography>
      <Typography
        variant="body2"
        sx={{
          whiteSpace: 'pre-line',
          border: '1px solid #ccc',
          borderRadius: 1,
          p: 1,
          backgroundColor: '#f9f9f9',
          minHeight: '80px',
        }}
      >
        {observation || 'Sin observaciones registradas.'}
      </Typography>
    </>
  );

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
        {observacionesSection}
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

  const getCaraData = (nombre: string): OdontogramDescription | undefined =>
    filteredList.find((c) => c.cara.toLowerCase() === nombre.toLowerCase());
  const getCaraData2 = (nombre: string): Cara | undefined =>
    diente.caras.find((c) => c.nombrecara.toLowerCase() === nombre.toLowerCase());

  return (
    <Paper sx={{ p: 3, height: 'fit-content' }}>
      <Typography variant="h6" gutterBottom color="primary">
        Diente {diente.numero}
      </Typography>

      <Box mb={3}>
        <Typography variant="subtitle1" gutterBottom>
          {piezaMap[diente.numero].cuadrante}
        </Typography>
        <Chip 
          label={piezaMap[diente.numero].descripcion}
          variant="outlined"
          size="small"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" gutterBottom>
        Estado por Caras:
      </Typography>

      <Box mb={3}>
      {carasCombinadas?.map((cara) => (
        <Box key={cara.nombrecara} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="body2" sx={{ minWidth: 100 }}>
            {cara.nombrecara}:
          </Typography>
          <Chip
            label={cara.descripciondiagnostico || 'Sano'}
            size="small"
            sx={{
              backgroundColor: cara.colorDiagnostico || '#000000',
              color: 'black',
              fontWeight: 'bold'
            }}
          />
        </Box>
      ))}
    </Box>

    <Divider sx={{ my: 2 }} />

    {isCreating ? (
      <>
        {facesConfig.map(({ id, name }) => {
          const baseCara = getCaraData2(name); // de diente.caras
          if (!baseCara) return null;

          const updatedCara = getCaraData(name); // de odontogramDescriptions

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
                    const esSeleccionado = updatedCara?.iddiagnostico === estado.iddiagnostico;


                    return (
                      <Grid item xs={6} key={`${name}-${estado.iddiagnostico ?? index}`}>
                        <Button
                          fullWidth
                          variant={esSeleccionado ? 'contained' : 'outlined'}
                          size="small"
                          onClick={() =>
                            onFaceStateChange(
                              id,
                              estado.iddiagnostico,
                              diente.numero,
                              diente.nombre,
                              name.toLowerCase(),
                              0
                            )
                          }
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
      </>
    ) : (
      <>
        
      </>
    )}
    {observacionesSection}
    </Paper>
  );
}

export default DetalleDental;
