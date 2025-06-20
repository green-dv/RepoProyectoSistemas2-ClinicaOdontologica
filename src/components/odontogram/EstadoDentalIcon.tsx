'use client';

import React from 'react';
import { 
  CheckCircle, 
  Warning, 
  Build, 
  Close, 
  LocalHospital,
  Star,
  Hardware
} from '@mui/icons-material';
import { EstadoDental } from '@/presentation/config/odontogrmaConfig';

interface EstadoDentalIconProps {
  estado: EstadoDental;
  size?: 'small' | 'medium' | 'large';
}

const EstadoDentalIcon: React.FC<EstadoDentalIconProps> = ({ 
  estado, 
  size = 'small' 
}) => {
  const iconProps = {
    fontSize: size,
    sx: { mb: 0.5 }
  };

  const icons = {
    sano: <CheckCircle {...iconProps} />,
    caries: <Warning {...iconProps} />,
    obturado: <Build {...iconProps} />,
    extraido: <Close {...iconProps} />,
    endodoncia: <LocalHospital {...iconProps} />,
    corona: <Star {...iconProps} />,
    implante: <Hardware {...iconProps} />
  };

  return icons[estado] || icons.sano;
};

export default EstadoDentalIcon;