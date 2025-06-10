'use client';

import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Divider } from '@mui/material';
import PiezaDentalSVG from './PIezaDental';
import DetalleDental from './DetalleDental';
import { Diagnosis } from '@/domain/entities/Diagnosis';
import useOdontogramHandlers from '@/presentation/handlers/useOdontogramaHandler';
import { DentalPiece, EstadoDental, CaraDental, Cara, Diente } from '@/presentation/config/odontogrmaConfig';
import { Description } from '@mui/icons-material';



const OdontogramaGrid: React.FC = () => {
  const{
    diagnosis,
    handleFetchDiagnosis,
    handleFetchLastOdontogram,
    odontogram
  } = useOdontogramHandlers();
  const [selectedTooth, setSelectedTooth] = useState<DentalPiece | null>(null);
  const [dentalStates, setDentalStates] = useState<Record<number, Record<CaraDental, EstadoDental>>>({});
  
 
  
  const maxilarSuperior = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const maxilarInferior = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];


  useEffect(() => {
    handleFetchDiagnosis();
    handleFetchLastOdontogram();
  }, []);

  useEffect(() => {
    if(odontogram && odontogram.descripciones){
      loadDentalStates();
    }
  }, [odontogram,diagnosis]);
  
  const loadDentalStates = () => {
    if(!odontogram?.descripciones || !diagnosis){
      return;
    }
    const newDentalStates: Record<number, Record<CaraDental, EstadoDental>> = {};
    [...maxilarSuperior, ...maxilarInferior].forEach(toothNumber => {
      newDentalStates[toothNumber] = {
        vestibular: 'sano',
        mesial: 'sano',
        lingual: 'sano',
        distal: 'sano',
        oclusal: 'sano'
      };
    });

    odontogram.descripciones.forEach(description => {
      const toothNumber =  description.codigofdi;
      const face = description.cara;
      
      const ItemDiagnosis = diagnosis.find(d => d.iddiagnostico === description.iddiagnostico);
      if(ItemDiagnosis && newDentalStates[toothNumber]){
        //const estado = mappear
      }
    });

    setDentalStates(newDentalStates)
    };

    const mapDiagnosis = (description:string) => {

    }

  

  const handleToothClick = (toothNumber: number) => {
    const toothData: DentalPiece = {
      numero: toothNumber,
      nombre: getToothName(toothNumber),
      cuadrante: Math.floor(toothNumber / 10),
      caras: dentalStates[toothNumber] || {
        vestibular: 'sano',
        mesial: 'sano',
        lingual: 'sano',
        distal: 'sano',
        oclusal: 'sano'
      },
    };
    setSelectedTooth(toothData);
  };

  const handleFaceStateChange = (toothNumber: number, cara: CaraDental, newState: string) => {
    setDentalStates(prev => ({
      ...prev,
      [toothNumber]: {
        ...prev[toothNumber],
        [cara]: newState
      }
    }));
    
    if (selectedTooth && selectedTooth.numero === toothNumber) {
      setSelectedTooth({
        ...selectedTooth,
        caras: {
          ...selectedTooth.caras,
          [cara]: newState
        }
      });
    }
  };

  const getToothName = (numero: number): string => {
    const position = numero % 10;
    const names = {
      1: 'Incisivo Central',
      2: 'Incisivo Lateral', 
      3: 'Canino',
      4: 'Primer Premolar',
      5: 'Segundo Premolar',
      6: 'Primer Molar',
      7: 'Segundo Molar',
      8: 'Tercer Molar'
    };
    return names[position as keyof typeof names] || 'Diente';
  };

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
                    caras={dentalStates[numero] || {
                      vestibular: 'sano',
                      mesial: 'sano',
                      lingual: 'sano',
                      distal: 'sano',
                      oclusal: 'sano'
                    }}
                    onToothClick={() => handleToothClick(numero)}
                    onFaceClick={(cara, estado) => handleFaceStateChange(numero, cara, estado)}
                    isSelected={selectedTooth?.numero === numero}
                  />
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 4 }}>
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                Línea Media Dental
              </Typography>
            </Divider>

            {/* Maxilar Inferior */}
            <Typography variant="h6" gutterBottom textAlign="center" color="primary">
              Maxilar Inferior
            </Typography>
            <Grid container spacing={1} justifyContent="center">
              {maxilarInferior.map((numero) => (
                <Grid item key={numero}>
                  <PiezaDentalSVG
                    numero={numero}
                    diagnosticos={diagnosis}
                    caras={dentalStates[numero] || {
                      vestibular: 'sano',
                      mesial: 'sano',
                      lingual: 'sano',
                      distal: 'sano',
                      oclusal: 'sano'
                    }}
                    onToothClick={() => handleToothClick(numero)}
                    onFaceClick={(cara, estado) => handleFaceStateChange(numero, cara, estado)}
                    isSelected={selectedTooth?.numero === numero}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* Panel de Detalles */}
        <Grid item xs={12} lg={4}>
          <DetalleDental
            diente={selectedTooth}
            onFaceStateChange={handleFaceStateChange}
            diagnosis={diagnosis}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default OdontogramaGrid;