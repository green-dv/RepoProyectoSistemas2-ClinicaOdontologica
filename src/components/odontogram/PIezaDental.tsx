import React, { useState, useMemo } from 'react';
import { Box, Paper, Typography, Tooltip } from '@mui/material';
import { Diagnosis } from '@/domain/entities/Diagnosis';
import { OdontogramDescription } from '@/domain/entities/OdontogramDescription';
import { Cara, piezaMap } from '@/presentation/config/odontogrmaConfig';

interface PiezaDentalSVGProps {
  numero: number;
  nombre?: string;
  cuadrante?: number;
  diagnosticos: Diagnosis[] | null;
  odontogramDescriptions: OdontogramDescription[] | null;
  createdOdontogramDescriptions: OdontogramDescription[] | null;
  isCreating: boolean;
  onClickFace: (numero: number, cara: string, idcara: number, iddiagnostico: number, idpieza: number) => void;
  handleSelectTooth: (numerofdi: number, nombre: string, cuadrante: number, caras: Cara[]) => void;
}

const PiezaDentalSVG: React.FC<PiezaDentalSVGProps> = ({
  numero,
  nombre,
  cuadrante,
  diagnosticos,
  odontogramDescriptions,
  createdOdontogramDescriptions,
  isCreating,
  onClickFace,
  handleSelectTooth,
}) => {
  const [hoveredFace, setHoveredFace] = useState<string | null>(null);

  const lista = isCreating ? createdOdontogramDescriptions : odontogramDescriptions;

  const facesConfig = [
    { id: 1, name: 'Vestibular', start: -45, end: 45 },
    { id: 2, name: 'Mesial', start: 45, end: 135 },
    { id: 3, name: 'Distal', start: 225, end: 315 },
    { id: 4, name: 'Lingual', start: 135, end: 225 },
    { id: 5, name: 'Oclusal/Incisal', isCircle: true },
  ];

  // 1. Filtrar descripciones del diente
  const descripcionesParaDiente = useMemo(() => {
    const listaActual = isCreating ? createdOdontogramDescriptions : odontogramDescriptions;
    if (!listaActual) return [];
    return listaActual.filter(desc => desc.codigofdi === numero);
  }, [isCreating, createdOdontogramDescriptions, odontogramDescriptions, numero]);

  // 2. Función para buscar descripción de una cara
  const getDescripcionCara = (caraName: string): OdontogramDescription | undefined => {
    return descripcionesParaDiente.find(
      desc => desc.cara.toLowerCase() === caraName.toLowerCase()
    );
  };

  // 3. Mapear OdontogramDescription + Diagnosis[] a Cara
  const mapToCara = (desc: OdontogramDescription): Cara => {
    const diag = diagnosticos?.find(d => d.iddiagnostico === desc.iddiagnostico);
    return {
      idcara: desc.idcara,
      nombrecara: desc.cara,
      iddiagnostico: desc.iddiagnostico,
      descripciondiagnostico: diag ? diag.descripcion : 'Desconocido',
      colorDiagnostico: desc.enlaceicono
    };
  };

  // 4. Construir arreglo completo de Cara[] para pasar al padre
  const carasParaSelect: Cara[] = useMemo(() => {
    return facesConfig.map(f => {
      const desc = getDescripcionCara(f.name);
      if (desc) {
        return mapToCara(desc);
      } else {
        return {
          idcara: f.id,
          nombrecara: f.name,
          iddiagnostico: 0,
          descripciondiagnostico: 'Sano',
          colorDiagnostico: '#FFFFFF'
        };
      }
    });
  }, [descripcionesParaDiente, diagnosticos]);

  const getFaceColor = (caraName: string): string => {
    const desc = getDescripcionCara(caraName);
    if (desc) return desc.enlaceicono;
    return '#FFFFFF';
  };

  const center = 50;
  const outerRadius = 35;
  const innerRadius = 15;
  const createSectorPath = (startAngle: number, endAngle: number, outerR: number, innerR: number) => {
    const startRad = (Math.PI / 180) * startAngle;
    const endRad = (Math.PI / 180) * endAngle;
    const x1 = center + outerR * Math.cos(startRad);
    const y1 = center + outerR * Math.sin(startRad);
    const x2 = center + outerR * Math.cos(endRad);
    const y2 = center + outerR * Math.sin(endRad);
    const x3 = center + innerR * Math.cos(endRad);
    const y3 = center + innerR * Math.sin(endRad);
    const x4 = center + innerR * Math.cos(startRad);
    const y4 = center + innerR * Math.sin(startRad);
    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 140,
        '&:hover': {
          elevation: 6,
        }
      }}
      onClick={() => handleSelectTooth(numero, nombre || '', cuadrante || 0, carasParaSelect)}
    >
      <Box textAlign="center" mb={1}>
        <Typography variant="body2" fontWeight="bold" color="primary">
          {numero}
        </Typography>
      </Box>

      <Box
        sx={{
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '&:hover': {
            transform: 'scale(1.05)',
          },
          transition: 'transform 0.2s ease'
        }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100">
          {facesConfig.map((face) =>
            face.isCircle ? (
              <Tooltip key={face.name || 'Oclusal/Incisal'} title={face.name || 'Oclusal/Incisal'}>
                <circle
                  cx={center}
                  cy={center}
                  r={innerRadius}
                  onClick={() => {
                    const desc = getDescripcionCara('Oclusal/Incisal');
                    onClickFace(numero, 'Oclusal/Incisal', face.id, desc ? desc.iddiagnostico : 1, piezaMap[numero].idpieza);
                  }}
                  fill={getFaceColor('Oclusal/Incisal')}
                  stroke={hoveredFace === 'Oclusal/Incisal' ? '#000' : '#666'}
                  strokeWidth={hoveredFace === 'Oclusal/Incisal' ? 2 : 1}
                  onMouseEnter={() => setHoveredFace('Oclusal/Incisal')}
                  onMouseLeave={() => setHoveredFace(null)}
                  style={{
                    opacity: hoveredFace === 'Oclusal/Incisal' ? 0.8 : 1,
                    transition: 'all 0.2s ease'
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip key={face.name} title={face.name}>
                <path
                  d={createSectorPath(face.start!, face.end!, outerRadius, innerRadius)}
                  fill={getFaceColor(face.name)}
                  onClick={() => {
                    const desc = getDescripcionCara(face.name);
                    onClickFace(numero, face.name, face.id, (desc) ? desc.iddiagnostico : 1, piezaMap[numero].idpieza);
                  }}
                  stroke={hoveredFace === face.name ? '#000' : '#666'}
                  strokeWidth={hoveredFace === face.name ? 2 : 1}
                  onMouseEnter={() => setHoveredFace(face.name)}
                  onMouseLeave={() => setHoveredFace(null)}
                  style={{
                    opacity: hoveredFace === face.name ? 0.8 : 1,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                />
              </Tooltip>
            )
          )}

          {hoveredFace && (
            <text
              x={center}
              y={center + 60}
              textAnchor="middle"
              fontSize="10"
              fill="#333"
              fontWeight="bold"
            >
              {hoveredFace}
            </text>
          )}
        </svg>
      </Box>
    </Paper>
  );
};

export default PiezaDentalSVG;
