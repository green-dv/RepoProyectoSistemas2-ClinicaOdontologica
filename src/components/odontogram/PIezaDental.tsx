import React, { useState } from 'react';
import { Box, Paper, Typography, Tooltip } from '@mui/material';
import { Diagnosis } from '@/domain/entities/Diagnosis';
import { CarasEstados } from '@/presentation/config/odontogrmaConfig';

interface PiezaDentalSVGProps {
  numero: number;
  diagnosticos: Diagnosis[];
  caras: CarasEstados;
  onToothClick: () => void;
  onFaceClick: (cara: string, iddiagnostico: number) => void;
  isSelected: boolean;
}

const PiezaDentalSVG: React.FC<PiezaDentalSVGProps> = ({
  numero,
  diagnosticos,
  caras,
  onToothClick,
  onFaceClick,
  isSelected
}) => {
  const [hoveredFace, setHoveredFace] = useState<string | null>(null);

  const center = 50;
  const outerRadius = 35;
  const innerRadius = 15;

  // Configuración de las caras externas
  const facesConfig = [
    { name: 'vestibular', start: -45, end: 45 },
    { name: 'mesial', start: 45, end: 135 },
    { name: 'lingual', start: 135, end: 225 },
    { name: 'distal', start: 225, end: 315 },
  ];

  // Función para obtener color según el estado
  const getEstadoColor = (estado: string): string => {
    const colorMap: Record<string, string> = {
      'sano': '#4CAF50',      // Verde
      'caries': '#F44336',     // Rojo
      'obturado': '#2196F3',   // Azul
      'corona': '#FF9800',     // Naranja
      'extraccion': '#9C27B0', // Púrpura
      'ausente': '#757575',    // Gris
    };
    return colorMap[estado] || '#E0E0E0';
  };

  // Función para obtener el diagnóstico por defecto (sano)
  const getDefaultDiagnosis = (): Diagnosis => {
    return diagnosticos.find(d => d.descripcion.toLowerCase().includes('sano')) || 
           diagnosticos[0] || 
           { iddiagnostico: 1, descripcion: 'Sano', enlaceicono: '' };
  };

  // Función para manejar click en cara
  const handleFaceClick = (caraNombre: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Por ahora, usar el diagnóstico por defecto
    // En una implementación completa, aquí se abriría un selector de diagnósticos
    const defaultDiagnosis = getDefaultDiagnosis();
    onFaceClick(caraNombre, defaultDiagnosis.iddiagnostico);
  };

  // Función para crear path del sector
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
      elevation={isSelected ? 8 : 2}
      sx={{ 
        p: 2, 
        borderRadius: 2,
        border: isSelected ? '3px solid #1976d2' : '1px solid #e0e0e0',
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
    >
      <Box textAlign="center" mb={1}>
        <Typography variant="body2" fontWeight="bold" color="primary">
          {numero}
        </Typography>
      </Box>
      
      <Box 
        onClick={onToothClick}
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
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ display: 'block' }}>
          {/* Caras externas */}
          {facesConfig.map((face) => (
            <Tooltip key={face.name} title={`${face.name}: ${caras[face.name as keyof CarasEstados]}`}>
              <path
                d={createSectorPath(face.start, face.end, outerRadius, innerRadius)}
                fill={getEstadoColor(caras[face.name as keyof CarasEstados])}
                stroke={hoveredFace === face.name ? '#000' : '#666'}
                strokeWidth={hoveredFace === face.name ? 2 : 1}
                onClick={(e) => handleFaceClick(face.name, e)}
                onMouseEnter={() => setHoveredFace(face.name)}
                onMouseLeave={() => setHoveredFace(null)}
                style={{ 
                  cursor: 'pointer',
                  opacity: hoveredFace === face.name ? 0.8 : 1,
                  transition: 'all 0.2s ease'
                }}
              />
            </Tooltip>
          ))}
          
          {/* Cara oclusal (centro) */}
          <Tooltip title={`oclusal: ${caras.oclusal}`}>
            <circle
              cx={center}
              cy={center}
              r={innerRadius}
              fill={getEstadoColor(caras.oclusal)}
              stroke={hoveredFace === 'oclusal' ? '#000' : '#666'}
              strokeWidth={hoveredFace === 'oclusal' ? 2 : 1}
              onClick={(e) => handleFaceClick('oclusal', e)}
              onMouseEnter={() => setHoveredFace('oclusal')}
              onMouseLeave={() => setHoveredFace(null)}
              style={{ 
                cursor: 'pointer',
                opacity: hoveredFace === 'oclusal' ? 0.8 : 1,
                transition: 'all 0.2s ease'
              }}
            />
          </Tooltip>
          
          {/* Etiquetas de caras (solo cuando hover) */}
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