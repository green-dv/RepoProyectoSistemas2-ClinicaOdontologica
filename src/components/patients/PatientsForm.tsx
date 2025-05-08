import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  MenuItem,
  CircularProgress,
  Alert,
  Typography,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { Patient } from '@/domain/entities/Patient';
import { PatientDialog } from './PatientDialog';
import { PatientConfirmationDialog } from './PatientConfirmation';
import { SaveOutlined, CancelOutlined } from '@mui/icons-material';
import { format } from 'date-fns';

interface PatientFormProps {
  open: boolean;
  onClose: () => void;
  patient: Patient | null;
  onSubmitSuccess?: () => void;
}

type FormErrors = {
  [key in keyof Patient]?: string;
};

const civilStatusOptions = [
  { value: 'Soltero/a', label: 'Soltero/a' },
  { value: 'Casado/a', label: 'Casado/a' },
  { value: 'Divorciado/a', label: 'Divorciado/a' },
  { value: 'Viudo/a', label: 'Viudo/a' },
  { value: 'Unión libre', label: 'Unión libre' },
];

export const PatientForm: React.FC<PatientFormProps> = ({
  open,
  onClose,
  patient,
  onSubmitSuccess
}) => {
  const isEditMode = !!patient?.idpaciente;
  
  const [formData, setFormData] = useState<Patient>({
    nombres: '',
    apellidos: '',
    direccion: '',
    telefonodomicilio: '',
    telefonopersonal: '',
    lugarnacimiento: '',
    fechanacimiento: '',
    sexo: true, // Default to male
    estadocivil: '',
    ocupacion: '',
    aseguradora: '',
    habilitado: true
  });

  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  
  // New state for confirmation dialog
  const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
  const [addedPatient, setAddedPatient] = useState<Patient | null>(null);

  // Initialize form with patient data when editing
  useEffect(() => {
    if (patient) {
      setFormData({
        ...patient,
      });
      
      // Parse the date if it exists
      if (patient.fechanacimiento) {
        try {
          // Try to parse the date string to a Date object
          const dateObj = new Date(patient.fechanacimiento);
          if (!isNaN(dateObj.getTime())) {
            setBirthDate(dateObj);
          }
        } catch (error) {
          console.error('Error parsing date:', error);
          setBirthDate(null);
        }
      }
    } else {
      // Reset form when adding a new patient
      setFormData({
        nombres: '',
        apellidos: '',
        direccion: '',
        telefonodomicilio: '',
        telefonopersonal: '',
        lugarnacimiento: '',
        fechanacimiento: '',
        sexo: true,
        estadocivil: '',
        ocupacion: '',
        aseguradora: '',
        habilitado: true
      });
      setBirthDate(null);
    }
  }, [patient, open]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son requeridos';
    }
    
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son requeridos';
    }
    
    // Optional: Validate phone number format
    if (formData.telefonopersonal && !/^\d{7,15}$/.test(formData.telefonopersonal.replace(/\D/g, ''))) {
      newErrors.telefonopersonal = 'Formato de teléfono inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof Patient]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === 'true';
    setFormData(prevData => ({
      ...prevData,
      sexo: value
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setBirthDate(date);
    
    if (date) {
      // Format date as ISO string for the backend
      const formattedDate = format(date, 'yyyy-MM-dd');
      setFormData(prevData => ({
        ...prevData,
        fechanacimiento: formattedDate
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        fechanacimiento: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      let response;
      
      if (isEditMode) {
        // Update existing patient
        response = await fetch(`/api/patients/${patient.idpaciente}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new patient
        response = await fetch('/api/patients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error saving patient data');
      }
      
      const savedPatient = await response.json();
      
      setSubmitSuccess(true);
      
      // Set the added/updated patient for confirmation dialog
      setAddedPatient(savedPatient.data || formData);
      
      // Show confirmation dialog
      setConfirmationOpen(true);
      
      // Notify parent component about successful submission
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
    // Close the main form dialog after confirmation is closed
    onClose();
  };

  return (
    <>
      <PatientDialog
        open={open}
        onClose={onClose}
        title={isEditMode ? 'Editar Paciente' : 'Nuevo Paciente'}
        maxWidth="md"
        disableBackdropClick={loading}
        showActions={false}
      >
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {submitSuccess && !confirmationOpen && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {isEditMode ? 'Paciente actualizado con éxito!' : 'Paciente creado con éxito!'}
            </Alert>
          )}
          
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          
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
          
          <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={onClose}
              disabled={loading}
              startIcon={<CancelOutlined />}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveOutlined />}
            >
              {isEditMode ? 'Actualizar' : 'Guardar'}
            </Button>
          </Box>
        </Box>
      </PatientDialog>

      {/* Confirmation Dialog */}
      <PatientConfirmationDialog
        open={confirmationOpen}
        onClose={handleCloseConfirmation}
        patient={addedPatient}
        isEditing={isEditMode}
      />
    </>
  );
};