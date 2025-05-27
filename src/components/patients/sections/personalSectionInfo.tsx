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
    Divider,
    FormHelperText
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
    isFieldRequired: (fieldName: keyof Patient) => boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleRadioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDateChange: (date: Date | null) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
    formData,
    birthDate,
    errors,
    loading,
    isFieldRequired,
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
                        required={isFieldRequired('nombres')}
                        fullWidth
                        label="Nombres"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleInputChange}
                        error={!!errors.nombres}
                        helperText={errors.nombres || (isFieldRequired('nombres') ? 'Campo requerido' : '')}
                        disabled={loading}
                        margin="normal"
                        inputProps={{
                            maxLength: 100,
                            pattern: '[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+',
                            title: 'Solo se permiten letras y espacios'
                        }}
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField
                        required={isFieldRequired('apellidos')}
                        fullWidth
                        label="Apellidos"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleInputChange}
                        error={!!errors.apellidos}
                        helperText={errors.apellidos || (isFieldRequired('apellidos') ? 'Campo requerido' : '')}
                        disabled={loading}
                        margin="normal"
                        inputProps={{
                            maxLength: 100,
                            pattern: '[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+',
                            title: 'Solo se permiten letras y espacios'
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormControl 
                        component="fieldset" 
                        margin="normal"
                        error={!!errors.sexo}
                        required={isFieldRequired('sexo')}
                    >
                        <FormLabel component="legend">Sexo *</FormLabel>
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
                        {errors.sexo && (
                            <FormHelperText>{errors.sexo}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker
                            label={`Fecha de Nacimiento ${isFieldRequired('fechanacimiento') ? '*' : ''}`}
                            value={birthDate}
                            onChange={handleDateChange}
                            disabled={loading}
                            maxDate={new Date()}
                            minDate={new Date(1900, 0, 1)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    margin: 'normal',
                                    error: !!errors.fechanacimiento,
                                    helperText: errors.fechanacimiento || (isFieldRequired('fechanacimiento') ? 'Campo requerido' : ''),
                                    required: isFieldRequired('fechanacimiento')
                                }
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField
                        required={isFieldRequired('estadocivil')}
                        fullWidth
                        select
                        label="Estado Civil"
                        name="estadocivil"
                        value={formData.estadocivil}
                        onChange={handleInputChange}
                        error={!!errors.estadocivil}
                        helperText={errors.estadocivil || (isFieldRequired('estadocivil') ? 'Campo requerido' : '')}
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
                        required={isFieldRequired('lugarnacimiento')}
                        fullWidth
                        label="Lugar de Nacimiento"
                        name="lugarnacimiento"
                        value={formData.lugarnacimiento}
                        onChange={handleInputChange}
                        error={!!errors.lugarnacimiento}
                        helperText={errors.lugarnacimiento}
                        disabled={loading}
                        margin="normal"
                        inputProps={{
                            maxLength: 100,
                            pattern: '[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s,.-]+',
                            title: 'Solo se permiten letras, espacios, comas, puntos y guiones'
                        }}
                    />
                </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
        </>
    );
};