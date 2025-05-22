// @/presentation/components/patients/sections/ContactInfoSection.tsx
import React from 'react';
import { TextField, Grid, Typography, Divider } from '@mui/material';
import { Patient } from '@/domain/entities/Patient';

interface ContactInfoSectionProps {
    formData: Patient;
    errors: { [key in keyof Patient]?: string };
    loading: boolean;
    isFieldRequired: (fieldName: keyof Patient) => boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
    formData,
    errors,
    loading,
    isFieldRequired,
    handleInputChange
}) => {
    return (
        <>
            <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
                Información de Contacto
            </Typography>
            
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required={isFieldRequired('telefonopersonal')}
                        fullWidth
                        label="Teléfono Personal"
                        name="telefonopersonal"
                        value={formData.telefonopersonal}
                        onChange={handleInputChange}
                        error={!!errors.telefonopersonal}
                        helperText={
                            errors.telefonopersonal || 
                            (isFieldRequired('telefonopersonal') ? 'Campo requerido (7-15 dígitos)' : 'Formato: +123456789 o 123-456-7890')
                        }
                        disabled={loading}
                        margin="normal"
                        type="tel"
                        inputProps={{
                            maxLength: 20,
                            pattern: '[\\d\\s\\-\\+\\(\\)]+',
                            title: 'Solo números, espacios, guiones, paréntesis y signo más'
                        }}
                        placeholder="Ej: +593 99 123 4567"
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField
                        required={isFieldRequired('telefonodomicilio')}
                        fullWidth
                        label="Teléfono Domicilio"
                        name="telefonodomicilio"
                        value={formData.telefonodomicilio}
                        onChange={handleInputChange}
                        error={!!errors.telefonodomicilio}
                        helperText={
                            errors.telefonodomicilio || 
                            'Opcional - Formato: +123456789 o 123-456-7890'
                        }
                        disabled={loading}
                        margin="normal"
                        type="tel"
                        inputProps={{
                            maxLength: 20,
                            pattern: '[\\d\\s\\-\\+\\(\\)]+',
                            title: 'Solo números, espacios, guiones, paréntesis y signo más'
                        }}
                        placeholder="Ej: +593 2 234 5678"
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <TextField
                        required={isFieldRequired('direccion')}
                        fullWidth
                        label="Dirección"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        error={!!errors.direccion}
                        helperText={
                            errors.direccion || 
                            (isFieldRequired('direccion') ? 'Campo requerido (mínimo 5 caracteres)' : '')
                        }
                        disabled={loading}
                        margin="normal"
                        multiline
                        rows={2}
                        inputProps={{
                            maxLength: 255
                        }}
                        placeholder="Ej: Av. Principal 123, Sector Norte, Ciudad"
                    />
                </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
        </>
    );
};