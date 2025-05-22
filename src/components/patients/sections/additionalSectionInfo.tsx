// @/presentation/components/patients/sections/AdditionalInfoSection.tsx
import React from 'react';
import { TextField, Grid, Typography, Divider } from '@mui/material';
import { Patient } from '@/domain/entities/Patient';

interface AdditionalInfoSectionProps {
    formData: Patient;
    errors: { [key in keyof Patient]?: string };
    loading: boolean;
    isFieldRequired: (fieldName: keyof Patient) => boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
    formData,
    errors,
    loading,
    isFieldRequired,
    handleInputChange
}) => {
    return (
        <>
            <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
                Información Adicional
            </Typography>
            
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required={isFieldRequired('ocupacion')}
                        fullWidth
                        label="Ocupación"
                        name="ocupacion"
                        value={formData.ocupacion}
                        onChange={handleInputChange}
                        error={!!errors.ocupacion}
                        helperText={
                            errors.ocupacion || 
                            'Opcional - Profesión o actividad laboral'
                        }
                        disabled={loading}
                        margin="normal"
                        inputProps={{
                            maxLength: 100,
                            pattern: '[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s.-]+',
                            title: 'Solo letras, espacios, puntos y guiones'
                        }}
                        placeholder="Ej: Médico, Ingeniero, Estudiante"
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField
                        required={isFieldRequired('aseguradora')}
                        fullWidth
                        label="Aseguradora"
                        name="aseguradora"
                        value={formData.aseguradora}
                        onChange={handleInputChange}
                        error={!!errors.aseguradora}
                        helperText={
                            errors.aseguradora || 
                            'Opcional - Compañía de seguros médicos'
                        }
                        disabled={loading}
                        margin="normal"
                        inputProps={{
                            maxLength: 100
                        }}
                        placeholder="Ej: IESS, ISSFA, Seguros Equinoccial"
                    />
                </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
        </>
    );
};