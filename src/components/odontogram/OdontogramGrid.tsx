'use client';

import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Divider } from '@mui/material';
import PiezaDentalSVG from './PIezaDental';
import DetalleDental from './DetalleDental';
import { Diagnosis } from '@/domain/entities/Diagnosis';
import useOdontogramHandlers from '@/presentation/handlers/useOdontogramaHandler';



const OdontogramaGrid: React.FC = () => {
  const{
    diagnosis,
    handleFetchDiagnosis,
    handleFetchLastOdontogram,
    odontogram,
    isCreating,
    handleFaceClick,
    createdDescriptions,
    handleFaceStateChange,
    selectedTooth,
    handleSelectTooth,
  } = useOdontogramHandlers();
  
 
  
  const maxilarSuperior = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const dientesLecheSuperior = [51, 52, 53, 54, 55, 61, 62, 63, 64, 65];

  const dientesLecheInferior = [71, 72, 73, 74, 75, 81, 82, 83, 84, 85];  
  const maxilarInferior = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];


  useEffect(() => {
    handleFetchDiagnosis();
    handleFetchLastOdontogram();
  }, []);
  useEffect(() => {
    console.log(odontogram);
  }, [odontogram]);

  return (
    <Box>
      <Grid container spacing={4}>
        {/* Odontograma Principal */}
        <Grid item xs={12} lg={8}>
          <Box>
            {/* Maxilar Superior */}
            <Typography variant="h6" gutterBottom textAlign="center" color="primary">
              Maxilar Superior
            </Typography>
            <Grid container spacing={1} justifyContent="center" mb={4}>
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

            <Divider sx={{ my: 4 }}>
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                Línea Media Dental
              </Typography>
            </Divider>

            <Typography variant="h6" gutterBottom textAlign="center" color="primary">
              Maxilar Inferior
            </Typography>
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

        <Grid item xs={12} lg={4}>
        {
          <DetalleDental
            diente={selectedTooth}
            onFaceStateChange={handleFaceStateChange}
            diagnosis={diagnosis}
          />
        }
        </Grid>
      </Grid>
    </Box>
  );
};

export default OdontogramaGrid;