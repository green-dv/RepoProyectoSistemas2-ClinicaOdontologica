import React from 'react';
import {
    TextField,
    Grid,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    FormLabel,
    MenuItem,
    Typography,
    Divider
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale';
import { Patient } from '@/domain/entities/Patient';
import { civilStatusOptions } from '@/presentation/config/patientFormConfig';

interface PersonalInfoSectionProps {
    formData: Patient;
    birthDate: Date | null;
    errors: { [key in keyof Patient]?: string };
    loading: boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleRadioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDateChange: (date: Date | null) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
    formData,
    birthDate,
    errors,
    loading,
    handleInputChange,
    handleRadioChange,
    handleDateChange
}) => {
    return (
        <>
            <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
                Información Personal
            </Typography>
            
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        label="Nombres"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleInputChange}
                        error={!!errors.nombres}
                        helperText={errors.nombres}
                        disabled={loading}
                        margin="normal"
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        label="Apellidos"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleInputChange}
                        error={!!errors.apellidos}
                        helperText={errors.apellidos}
                        disabled={loading}
                        margin="normal"
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormControl component="fieldset" margin="normal">
                        <FormLabel component="legend">Sexo</FormLabel>
                        <RadioGroup 
                            row 
                            name="sexo" 
                            value={formData.sexo.toString()} 
                            onChange={handleRadioChange}
                        >
                            <FormControlLabel 
                                value="true" 
                                control={<Radio disabled={loading} />} 
                                label="Masculino" 
                            />
                            <FormControlLabel 
                                value="false" 
                                control={<Radio disabled={loading} />} 
                                label="Femenino" 
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker
                            label="Fecha de Nacimiento"
                            value={birthDate}
                            onChange={handleDateChange}
                            disabled={loading}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    margin: 'normal'
                                }
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        select
                        label="Estado Civil"
                        name="estadocivil"
                        value={formData.estadocivil}
                        onChange={handleInputChange}
                        disabled={loading}
                        margin="normal"
                    >
                        <MenuItem value="">
                            <em>Seleccionar...</em>
                        </MenuItem>
                        {civilStatusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Lugar de Nacimiento"
                        name="lugarnacimiento"
                        value={formData.lugarnacimiento}
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