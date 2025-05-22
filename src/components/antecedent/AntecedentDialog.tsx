import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
  FormControlLabel,
  Switch,
  Alert,
  Snackbar,
  Box,
  Tabs,
  Tab,
  Divider,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Grid,
  Paper,
  Autocomplete
} from '@mui/material';
import { 
  MedicalServices as MedicalIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  LocalHospital as LocalHospitalIcon,
  FitnessCenter as FitnessCenterIcon,
  Medication as MedicationIcon,
  Healing as HealingIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from 'date-fns/locale';
// import { format } from 'date-fns';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Componente para los paneles de pestañas
function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`antecedent-tab-${index}`}
      aria-labelledby={`antecedent-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

import { Habit } from '@/domain/entities/Habits';
import { Illness } from '@/domain/entities/Illnesses';
import { Medication } from '@/domain/entities/Medications';
import { MedicalAttention } from '@/domain/entities/MedicalAttentions';


// Interface para las props del componente
interface AddAntecedenteDialogProps {
  open: boolean;
  onClose: () => void;
  patientId: number | null;
  onAntecedenteAdded?: () => void;
}

const AddAntecedenteDialog: React.FC<AddAntecedenteDialogProps> = ({
  open,
  onClose,
  patientId,
  onAntecedenteAdded
}) => {
  // Estado base del antecedente
  const [antecedente, setAntecedente] = useState({
    idpaciente: patientId,
    embarazo: false,
    habilitado: true,
    fecha: new Date(),
  });

  // Estados para las relaciones
  const [enfermedades, setEnfermedades] = useState<Illness[]>([]);
  const [habitos, setHabitos] = useState<Habit[]>([]);
  const [medicaciones, setMedicaciones] = useState<Medication[]>([]);
  const [atencionesMedicas, setAtencionesMedicas] = useState<MedicalAttention[]>([]);

  // Estados para los inputs de nuevos items
  const [nuevaEnfermedad, setNuevaEnfermedad] = useState('');
  const [nuevoHabito, setNuevoHabito] = useState('');
  const [nuevaMedicacion, setNuevaMedicacion] = useState('');
  const [nuevaAtencion, setNuevaAtencion] = useState('');

  // Estado para manejar el tab activo
  const [tabValue, setTabValue] = useState(0);

  // Estados para manejo de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Catálogos de los antecedentes
  const [catalogoEnfermedades, setCatalogoEnfermedades] = useState<Illness[]>([]);
  const [catalogoHabitos, setCatalogoHabitos] = useState<Habit[]>([]);
  const [catalogoMedicaciones, setCatalogoMedicaciones] = useState<Medication[]>([]);
  const [catalogoAtenciones, setCatalogoAtenciones] = useState<[MedicalAttention]>([]);

  // Actualizar el ID del paciente cuando cambia
  useEffect(() => {
    setAntecedente(prev => ({ ...prev, idpaciente: patientId }));
  }, [patientId]);

  // Cargar catálogos cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      loadCatalogos();
    }
  }, [open]);

  // Función para cargar catálogos
  const loadCatalogos = async () => {
    try {
      // Ejemplo: Cargar catálogo de enfermedades
      const resEnfermedades = await fetch('/api/catalogs/disease');
      if (resEnfermedades.ok) {
        const data = await resEnfermedades.json();
        if (data && data.data) {
          setCatalogoEnfermedades(data.data);
        }
      }

      // Similar para otros catálogos...
      // Cargar habitos
      const resHabitos = await fetch('/api/habits');
      if (resHabitos.ok) {
        const data = await resHabitos.json();
        if (data && data.data) {
          setCatalogoHabitos(data.data);
        }
      }

      // Cargar medicaciones
      const resMedicaciones = await fetch('/api/catalogs/medication');
      if (resMedicaciones.ok) {
        const data = await resMedicaciones.json();
        if (data && data.data) {
          setCatalogoMedicaciones(data.data);
        }
      }

      // Cargar atenciones médicas
      const resAtenciones = await fetch('/api/catalogs/medicattention');
      if (resAtenciones.ok) {
        const data = await resAtenciones.json();
        if (data && data.data) {
          setCatalogoAtenciones(data.data);
        }
      }

    } catch (error) {
      console.error('Error cargando catálogos:', error);
      setError('Error al cargar los catálogos. Intente nuevamente.');
    }
  };

  // Manejar cambio de tabs
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setAntecedente(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejar cambio de fecha
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setAntecedente(prev => ({ ...prev, fecha: date }));
    }
  };

  // Agregar una nueva enfermedad
  const addEnfermedad = () => {
    if (nuevaEnfermedad.trim()) {
      setEnfermedades([...enfermedades, { enfermedad: nuevaEnfermedad.trim() }]);
      setNuevaEnfermedad('');
    }
  };

  // Agregar un nuevo hábito
  const addHabito = () => {
    if (nuevoHabito.trim()) {
      setHabitos([...habitos, { habito: nuevoHabito.trim() }]);
      setNuevoHabito('');
    }
  };

  // Agregar una nueva medicación
  const addMedicacion = () => {
    if (nuevaMedicacion.trim()) {
      setMedicaciones([...medicaciones, { medicacion: nuevaMedicacion.trim() }]);
      setNuevaMedicacion('');
    }
  };

  // Agregar una nueva atención médica
  const addAtencion = () => {
    if (nuevaAtencion.trim()) {
      setAtencionesMedicas([...atencionesMedicas, { atencion: nuevaAtencion.trim() }]);
      setNuevaAtencion('');
    }
  };

  // Eliminar una enfermedad
  const removeEnfermedad = (index: number) => {
    const newEnfermedades = [...enfermedades];
    newEnfermedades.splice(index, 1);
    setEnfermedades(newEnfermedades);
  };

  // Eliminar un hábito
  const removeHabito = (index: number) => {
    const newHabitos = [...habitos];
    newHabitos.splice(index, 1);
    setHabitos(newHabitos);
  };

  // Eliminar una medicación
  const removeMedicacion = (index: number) => {
    const newMedicaciones = [...medicaciones];
    newMedicaciones.splice(index, 1);
    setMedicaciones(newMedicaciones);
  };

  // Eliminar una atención médica
  const removeAtencion = (index: number) => {
    const newAtenciones = [...atencionesMedicas];
    newAtenciones.splice(index, 1);
    setAtencionesMedicas(newAtenciones);
  };

  // Manejar el guardado del antecedente
  const handleSave = async () => {
    if (!antecedente.idpaciente) {
      setError('No se ha seleccionado un paciente.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Preparar los datos para enviar
      const antecedenteData = {
        ...antecedente,
        enfermedades: enfermedades,
        habitos: habitos,
        medicaciones: medicaciones,
        atencionesMedicas: atencionesMedicas
      };

      // Llamada a la API para crear el antecedente
      const response = await fetch('/api/antecedentes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(antecedenteData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el antecedente');
      }

      // Antecedente creado exitosamente
      setSuccess(true);
      
      // Opcional: notificar al componente padre
      if (onAntecedenteAdded) {
        onAntecedenteAdded();
      }
      
      // Limpiar el formulario (opcional si se cierra el dialog)
      resetForm();
      
      // Cerrar el diálogo después de un breve delay
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Error guardando antecedente:', error);
      setError(`Error al guardar: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  // Restablecer el formulario
  const resetForm = () => {
    setAntecedente({
      idpaciente: patientId,
      embarazo: false,
      habilitado: true,
      fecha: new Date(),
    });
    setEnfermedades([]);
    setHabitos([]);
    setMedicaciones([]);
    setAtencionesMedicas([]);
    setTabValue(0);
  };

  // Cerrar la alerta de éxito
  const handleCloseAlert = () => {
    setSuccess(false);
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <MedicalIcon /> Agregar Nuevo Antecedente Médico
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Datos Principales */}
            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Información General
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DatePicker
                      label="Fecha"
                      value={antecedente.fecha}
                      onChange={handleDateChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          margin: "normal"
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={antecedente.embarazo}
                        onChange={handleChange}
                        name="embarazo"
                        color="primary"
                      />
                    }
                    label="Embarazo"
                  />
                </Grid>
              </Grid>
            </Paper>

            <Divider sx={{ my: 2 }} />

            {/* Tabs para detalles */}
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleChangeTab} aria-label="antecedent details tabs">
                  <Tab 
                    icon={<LocalHospitalIcon />} 
                    iconPosition="start" 
                    label="Enfermedades" 
                    id="antecedent-tab-0" 
                    aria-controls="antecedent-tabpanel-0" 
                  />
                  <Tab 
                    icon={<FitnessCenterIcon />} 
                    iconPosition="start" 
                    label="Hábitos" 
                    id="antecedent-tab-1" 
                    aria-controls="antecedent-tabpanel-1" 
                  />
                  <Tab 
                    icon={<MedicationIcon />} 
                    iconPosition="start" 
                    label="Medicaciones" 
                    id="antecedent-tab-2" 
                    aria-controls="antecedent-tabpanel-2" 
                  />
                  <Tab 
                    icon={<HealingIcon />} 
                    iconPosition="start" 
                    label="Atenciones" 
                    id="antecedent-tab-3" 
                    aria-controls="antecedent-tabpanel-3" 
                  />
                </Tabs>
              </Box>

              {/* Panel de Enfermedades */}
              <TabPanel value={tabValue} index={0}>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                      <Autocomplete
                        freeSolo
                        options={catalogoEnfermedades}
                        getOptionLabel={(option) => 
                          typeof option === 'string' ? option : option.enfermedad
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Enfermedad"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => setNuevaEnfermedad(e.target.value)}
                          />
                        )}
                        inputValue={nuevaEnfermedad}
                        onInputChange={(event, newValue) => {
                          setNuevaEnfermedad(newValue);
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={addEnfermedad}
                      >
                        Agregar
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                <List>
                  {enfermedades.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
                      <LocalHospitalIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography>No hay enfermedades agregadas</Typography>
                    </Box>
                  ) : (
                    enfermedades.map((enfermedad, index) => (
                      <ListItem key={index} divider>
                        <ListItemText primary={enfermedad.enfermedad} />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            aria-label="delete" 
                            onClick={() => removeEnfermedad(index)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))
                  )}
                </List>
              </TabPanel>

              {/* Panel de Hábitos */}
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                      <Autocomplete
                        freeSolo
                        options={catalogoHabitos}
                        getOptionLabel={(option) => 
                          typeof option === 'string' ? option : option.habito
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Hábito"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => setNuevoHabito(e.target.value)}
                          />
                        )}
                        inputValue={nuevoHabito}
                        onInputChange={(event, newValue) => {
                          setNuevoHabito(newValue);
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={addHabito}
                      >
                        Agregar
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                <List>
                  {habitos.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
                      <FitnessCenterIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography>No hay hábitos agregados</Typography>
                    </Box>
                  ) : (
                    habitos.map((habito, index) => (
                      <ListItem key={index} divider>
                        <ListItemText primary={habito.habito} />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            aria-label="delete" 
                            onClick={() => removeHabito(index)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))
                  )}
                </List>
              </TabPanel>

              {/* Panel de Medicaciones */}
              <TabPanel value={tabValue} index={2}>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                      <Autocomplete
                        freeSolo
                        options={catalogoMedicaciones}
                        getOptionLabel={(option) => 
                          typeof option === 'string' ? option : option.medicacion
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Medicación"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => setNuevaMedicacion(e.target.value)}
                          />
                        )}
                        inputValue={nuevaMedicacion}
                        onInputChange={(event, newValue) => {
                          setNuevaMedicacion(newValue);
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={addMedicacion}
                      >
                        Agregar
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                <List>
                  {medicaciones.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
                      <MedicationIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography>No hay medicaciones agregadas</Typography>
                    </Box>
                  ) : (
                    medicaciones.map((medicacion, index) => (
                      <ListItem key={index} divider>
                        <ListItemText primary={medicacion.medicacion} />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            aria-label="delete" 
                            onClick={() => removeMedicacion(index)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))
                  )}
                </List>
              </TabPanel>

              {/* Panel de Atenciones Médicas */}
              <TabPanel value={tabValue} index={3}>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                      <Autocomplete
                        freeSolo
                        options={catalogoAtenciones}
                        getOptionLabel={(option) => 
                          typeof option === 'string' ? option : option.atencion
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Atención Médica"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => setNuevaAtencion(e.target.value)}
                          />
                        )}
                        inputValue={nuevaAtencion}
                        onInputChange={(event, newValue) => {
                          setNuevaAtencion(newValue);
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={addAtencion}
                      >
                        Agregar
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                <List>
                  {atencionesMedicas.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
                      <HealingIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography>No hay atenciones médicas agregadas</Typography>
                    </Box>
                  ) : (
                    atencionesMedicas.map((atencion, index) => (
                      <ListItem key={index} divider>
                        <ListItemText primary={atencion.atencion} />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            aria-label="delete" 
                            onClick={() => removeAtencion(index)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))
                  )}
                </List>
              </TabPanel>
            </Box>

            {/* Mensaje de error si existe */}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={onClose} 
            color="inherit"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={loading || !antecedente.idpaciente}
            color="primary"
          >
            {loading ? 'Guardando...' : 'Guardar Antecedente'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notificación de éxito */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          ¡Antecedente médico guardado exitosamente!
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddAntecedenteDialog;