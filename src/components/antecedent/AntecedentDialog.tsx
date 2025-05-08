import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Autocomplete,
  Chip,
  CircularProgress,
  Grid,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Illness } from '@/domain/entities/Illnesses';
import { Habit } from '@/domain/entities/Habits';
import { Medication } from '@/domain/entities/Medications';
import { MedicalAttention } from '@/domain/entities/MedicalAttentions';
import { AntecedenteCompleto } from '@/domain/entities/Antecedent';

interface CreateAntecedentDialogProps {
  open: boolean;
  onClose: () => void;
  patientId: number;
  onSuccess: () => void;
}

const CreateAntecedentDialog: React.FC<CreateAntecedentDialogProps> = ({
  open,
  onClose,
  patientId,
  onSuccess
}) => {
  // State for form data
  const [antecedentData, setAntecedentData] = useState<Partial<AntecedenteCompleto>>({
    idpaciente: patientId,
    embarazo: false,
    habilitado: true,
    fecha: new Date(),
    enfermedades: [],
    habitos: [],
    medicaciones: [],
    atencionesMedicas: []
  });

  // States for available options
  const [availableIllnesses, setAvailableIllnesses] = useState<Illness[]>([]);
  const [availableHabits, setAvailableHabits] = useState<Habit[]>([]);
  const [availableMedications, setAvailableMedications] = useState<Medication[]>([]);
  const [availableMedicalAttentions, setAvailableMedicalAttentions] = useState<MedicalAttention[]>([]);

  // State for loading indicators
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingOptions, setLoadingOptions] = useState<boolean>(true);
  
  // State for notifications
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Load available options when the dialog opens
  useEffect(() => {
    if (open) {
      fetchAllOptions();
    }
  }, [open]);

  const fetchAllOptions = async () => {
    setLoadingOptions(true);
    try {
      // Fetch all required data in parallel
      const [illnessesRes, habitsRes, medicationsRes, medicalAttentionsRes] = await Promise.all([
        fetch('/api/illnesses'),
        fetch('/api/habits'),
        fetch('/api/medications'),
        fetch('/api/medical-attentions')
      ]);

      const illnesses = await illnessesRes.json();
      const habits = await habitsRes.json();
      const medications = await medicationsRes.json();
      const medicalAttentions = await medicalAttentionsRes.json();

      setAvailableIllnesses(illnesses);
      setAvailableHabits(habits);
      setAvailableMedications(medications);
      setAvailableMedicalAttentions(medicalAttentions);
    } catch (error) {
      console.error('Error fetching options:', error);
      setNotification({
        open: true,
        message: 'Error cargando datos. Por favor, inténtelo de nuevo.',
        severity: 'error'
      });
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    
    if (type === 'checkbox') {
      const checked = (event.target as HTMLInputElement).checked;
      setAntecedentData(prev => ({ ...prev, [name]: checked }));
    } else {
      setAntecedentData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setAntecedentData(prev => ({ ...prev, fecha: date || new Date() }));
  };

  const handleEmbarazoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAntecedentData(prev => ({ ...prev, embarazo: event.target.checked }));
  };

  const handleMultiSelectChange = (
    name: 'enfermedades' | 'habitos' | 'medicaciones' | 'atencionesMedicas',
    value: number[]
  ) => {
    setAntecedentData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setAntecedentData({
      idpaciente: patientId,
      embarazo: false,
      habilitado: true,
      fecha: new Date(),
      enfermedades: [],
      habitos: [],
      medicaciones: [],
      atencionesMedicas: []
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/antecedentes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(antecedentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating antecedent');
      }

      setNotification({
        open: true,
        message: 'Antecedente creado con éxito',
        severity: 'success'
      });

      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting antecedent:', error);
      setNotification({
        open: true,
        message: error instanceof Error ? error.message : 'Error al crear antecedente',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div">
            Crear Nuevo Antecedente Médico
          </Typography>
        </DialogTitle>
        
        <DialogContent dividers>
          {loadingOptions ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
              <CircularProgress />
            </Box>
          ) : (
            <Box component="form" noValidate sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Fecha"
                      value={antecedentData.fecha}
                      onChange={handleDateChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'outlined'
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={antecedentData.embarazo || false}
                        onChange={handleEmbarazoChange}
                        name="embarazo"
                        color="primary"
                      />
                    }
                    label="Embarazo"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider>
                    <Typography variant="subtitle1">Enfermedades</Typography>
                  </Divider>
                </Grid>
                
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="enfermedades-selector"
                    options={availableIllnesses}
                    getOptionLabel={(option: Illness) => option.enfermedad}
                    isOptionEqualToValue={(option, value) => option.idenfermedad === value.idenfermedad}
                    onChange={(_, newValue) => {
                      handleMultiSelectChange(
                        'enfermedades',
                        newValue.map(item => item.idenfermedad)
                      );
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          key={option.idenfermedad}
                          label={option.enfermedad}
                          {...getTagProps({ index })}
                          color="primary"
                          size="small"
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Enfermedades"
                        placeholder="Seleccione enfermedades"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider>
                    <Typography variant="subtitle1">Hábitos</Typography>
                  </Divider>
                </Grid>
                
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="habitos-selector"
                    options={availableHabits}
                    getOptionLabel={(option: Habit) => option.habito}
                    isOptionEqualToValue={(option, value) => option.idhabito === value.idhabito}
                    onChange={(_, newValue) => {
                      handleMultiSelectChange(
                        'habitos',
                        newValue.map(item => item.idhabito)
                      );
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                            key={option.idhabito}
                          label={option.habito}
                          {...getTagProps({ index })}
                          color="secondary"
                          size="small"
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Hábitos"
                        placeholder="Seleccione hábitos"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider>
                    <Typography variant="subtitle1">Medicaciones</Typography>
                  </Divider>
                </Grid>
                
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="medicaciones-selector"
                    options={availableMedications}
                    getOptionLabel={(option: Medication) => option.medicacion}
                    isOptionEqualToValue={(option, value) => option.idmedicacion === value.idmedicacion}
                    onChange={(_, newValue) => {
                      handleMultiSelectChange(
                        'medicaciones',
                        newValue.map(item => item.idmedicacion)
                      );
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                            key={option.idmedicacion}
                          label={option.medicacion}
                          {...getTagProps({ index })}
                          color="info"
                          size="small"
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Medicaciones"
                        placeholder="Seleccione medicaciones"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider>
                    <Typography variant="subtitle1">Atenciones Médicas</Typography>
                  </Divider>
                </Grid>
                
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="atenciones-medicas-selector"
                    options={availableMedicalAttentions}
                    getOptionLabel={(option: MedicalAttention) => option.atencion}
                    isOptionEqualToValue={(option, value) => option.idatencionmedica === value.idatencionmedica}
                    onChange={(_, newValue) => {
                      handleMultiSelectChange(
                        'atencionesMedicas',
                        newValue.map(item => item.idatencionmedica)
                      );
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                        key={option.idatencionmedica}
                          label={option.atencion}
                          {...getTagProps({ index })}
                          color="warning"
                          size="small"
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Atenciones Médicas"
                        placeholder="Seleccione atenciones médicas"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading || loadingOptions}
          >
            {loading ? <CircularProgress size={24} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateAntecedentDialog;