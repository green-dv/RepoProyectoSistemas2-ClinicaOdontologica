import React from 'react';
import {
    TextField,
    Grid,
    Typography,
    Divider
} from '@mui/material';
import { Patient } from '@/domain/entities/Patient';

interface AdditionalInfoSectionProps {
    formData: Patient;
    loading: boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
    formData,
    loading,
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
                        fullWidth
                        label="Ocupación"
                        name="ocupacion"
                        value={formData.ocupacion}
                        onChange={handleInputChange}
                        disabled={loading}
                        margin="normal"
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Aseguradora"
                        name="aseguradora"
                        value={formData.aseguradora}
                        onChange={handleInputChange}
                        disabled={loading}
                        margin="normal"
                    />
                </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
        </>
    );
};