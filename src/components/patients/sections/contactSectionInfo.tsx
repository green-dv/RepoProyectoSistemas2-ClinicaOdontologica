import React from 'react';
import {
    TextField,
    Grid,
    Typography,
    Divider
} from '@mui/material';
import { Patient } from '@/domain/entities/Patient';

interface ContactInfoSectionProps {
    formData: Patient;
    errors: { [key in keyof Patient]?: string };
    loading: boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
    formData,
    errors,
    loading,
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
                        fullWidth
                        label="Teléfono Personal"
                        name="telefonopersonal"
                        value={formData.telefonopersonal}
                        onChange={handleInputChange}
                        error={!!errors.telefonopersonal}
                        helperText={errors.telefonopersonal}
                        disabled={loading}
                        margin="normal"
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Teléfono Domicilio"
                        name="telefonodomicilio"
                        value={formData.telefonodomicilio}
                        onChange={handleInputChange}
                        disabled={loading}
                        margin="normal"
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Dirección"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        disabled={loading}
                        margin="normal"
                        multiline
                        rows={2}
                    />
                </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
        </>
    );
};