'use client';

import React, { useEffect } from 'react';
import { Grid, Box, Typography, Divider, Button, List, Chip } from '@mui/material';
import PiezaDentalSVG from './PIezaDental';
import DetalleDental from './DetalleDental';
import useOdontogramHandlers from '@/presentation/handlers/useOdontogramaHandler';
import "@/app/styles/odontogram-print.css";
import SnackbarAlert from '@/components/SnackbarAlert';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { useSearchParams } from 'next/navigation';



const OdontogramaGrid = () => {
  const searchParams = useSearchParams();
  const idpaciente = parseInt(searchParams.get('idpaciente') ?? '0', 10);
  const idconsultaParam = searchParams.get('idconsulta');
  const creating = searchParams.get('creating') === 'true';

  const idconsulta = idconsultaParam ? parseInt(idconsultaParam) : null;
  const{
    diagnosis,
    handleFetchDiagnosis,
    odontogram,
    isCreating,
    handleFaceClick,
    createdDescriptions,
    handleFaceStateChange,
    selectedTooth,
    handleSelectTooth,
    handlePostOdontogram,
    handleChange,
    observation,
    observationError,
    handleOdontogramConfiguration,
    handleSnackbarClose,
    snackbar
  } = useOdontogramHandlers();
  
 
  
  const maxilarSuperior = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const dientesLecheSuperior = [51, 52, 53, 54, 55, 61, 62, 63, 64, 65];

  const dientesLecheInferior = [71, 72, 73, 74, 75, 81, 82, 83, 84, 85];  
  const maxilarInferior = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];


  useEffect(() => {
    console.log('idPaciente: ' + idpaciente);
    handleOdontogramConfiguration(creating, idpaciente, idconsulta);
    handleFetchDiagnosis();
  }, []);

  

  return (
    <Box className="odontogram-page">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        px={2}
        py={1}
        sx={{
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          border: '1px solid #ccc',
        }}
      >
        <Typography variant="h6" color="primary">
          Paciente: {odontogram?.paciente ?? 'No encontrado'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Fecha: {odontogram?.fechacreacion
            ? new Date(odontogram.fechacreacion).toISOString().slice(0, 10)
            : 'No especificado'}
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {/* Odontograma Principal */}
        <Grid item xs={12} lg={8}>
          <Box>
            {/* Maxilar Superior */}
            <Typography variant="h6" gutterBottom textAlign="center">
              Maxilar Superior
            </Typography>
            <Grid container spacing={1} justifyContent="center" mb={1}>
              {maxilarSuperior.map((numero) => (
                <Grid item key={numero}>
                  <PiezaDentalSVG
                    numero={numero}
                    diagnosticos={diagnosis}
                    odontogramDescriptions={odontogram?.descripciones ?? null}
                    isCreating={isCreating}
                    onClickFace={handleFaceClick}
                    createdOdontogramDescriptions={createdDescriptions}
                    handleSelectTooth={handleSelectTooth}
                  />
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={1} justifyContent="center" mb={1}>
              {dientesLecheSuperior.map((numero) => (
                <Grid item key={numero}>
                  <PiezaDentalSVG
                    numero={numero}
                    diagnosticos={diagnosis}
                    odontogramDescriptions={odontogram?.descripciones ?? null}
                    isCreating={isCreating}
                    onClickFace={handleFaceClick}
                    createdOdontogramDescriptions={createdDescriptions}
                    handleSelectTooth={handleSelectTooth}
                  />
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 4 }}>
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                Línea Media Dental
              </Typography>
            </Divider>

            <Typography variant="h6" gutterBottom textAlign="center" color="primary">
              Maxilar Inferior
            </Typography>

            <Grid container spacing={1} justifyContent="center" mb={1}>
              {dientesLecheInferior.map((numero) => (
                <Grid item key={numero}>
                  <PiezaDentalSVG
                    numero={numero}
                    diagnosticos={diagnosis}
                    odontogramDescriptions={odontogram?.descripciones ?? null}
                    isCreating={isCreating}
                    onClickFace={handleFaceClick}
                    createdOdontogramDescriptions={createdDescriptions}
                    handleSelectTooth={handleSelectTooth}
                  />
                </Grid>
              ))}
            </Grid>
            <Grid container spacing={1} justifyContent="center">
              {maxilarInferior.map((numero) => (
                <Grid item key={numero}>
                  <PiezaDentalSVG
                    numero={numero}
                    diagnosticos={diagnosis}
                    odontogramDescriptions={odontogram?.descripciones ?? null}
                    isCreating={isCreating}
                    onClickFace={handleFaceClick}
                    createdOdontogramDescriptions={createdDescriptions}
                    handleSelectTooth={handleSelectTooth}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} lg={4} sx={{ '@media print': { display: 'none' } }} >
        {
          <DetalleDental
            diente={selectedTooth}
            handleChange={handleChange}
            onFaceStateChange={handleFaceStateChange}
            isCreating={isCreating}
            diagnosis={diagnosis}
            observation={observation}
            observationError={observationError}
            handleSubmit={handlePostOdontogram}
            odontogramDescriptions={createdDescriptions}
          />
        }
        </Grid>
        <Grid
          item
          xs={12}
          lg={4}
          sx={{
            display: 'none',
            '@media print': {
              display: 'block',
            },
          }}
        >
          <List dense disablePadding>
            {diagnosis?.map((diag) => (
              <Box
                key={diag.iddiagnostico}
                display="flex"
                alignItems="center"
                mb={0.5}
                gap={1}
              >
                <Chip
                  label=""
                  size="small"
                  className="color-chip"
                  sx={{
                    backgroundColor: diag.enlaceicono,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                  }}
                />
                <Typography variant="body2">{diag.descripcion}</Typography>
              </Box>
            ))}
          </List>
        </Grid>
      </Grid>
      {
        !creating ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.print()}
            startIcon={<LocalPrintshopIcon />}
            sx={{'@media print': {display: 'none'}}}
          >
            Imprimir
          </Button>
        ) : null
      }
      
      <SnackbarAlert
        snackbar={snackbar}
        onClose={handleSnackbarClose}
      />
    </Box>
    
  );
};

export default OdontogramaGrid;