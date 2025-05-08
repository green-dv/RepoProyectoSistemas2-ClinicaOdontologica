import React from 'react';
import { useState } from 'react';
import { PatientDialog } from './PatientDialog';
import {
  Typography,
  Box,
  Grid,
  Divider,
  Chip,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs
} from '@mui/material';
import {
  PersonOutline as PersonIcon,
  CalendarToday as CalendarIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  MedicalServices as MedicalIcon,
  EditOutlined as EditIcon,
  LocalHospital as LocalHospitalIcon,
  FitnessCenter as FitnessCenterIcon,
  Medication as MedicationIcon,
  Healing as HealingIcon,
  PregnantWoman as PregnantIcon,
  ChildCare as ChildCareIcon
} from '@mui/icons-material';
import { Patient } from '@/domain/entities/Patient';
import { Antecedent, AntecedenteCompleto } from '@/domain/entities/Antecedent';
import { Illness } from '@/domain/entities/Illnesses';
import { Habit } from '@/domain/entities/Habits';
import { Medication } from '@/domain/entities/Medications';
import { MedicalAttention } from '@/domain/entities/MedicalAttentions';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PatientViewDialogProps {
  open: boolean;
  onClose: () => void;
  patient: Patient | null;
  onEdit: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`antecedent-tabpanel-${index}`}
      aria-labelledby={`antecedent-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export const PatientViewDialog: React.FC<PatientViewDialogProps> = ({
  open,
  onClose,
  patient,
  onEdit
}) => {
  const [antecedentes, setAntecedentes] = useState<AntecedenteCompleto[]>([]);
  const [showAntecedentes, setShowAntecedentes] = useState(false);
  const [loadingAntecedentes, setLoadingAntecedentes] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [currentAntecedente, setCurrentAntecedente] = useState<AntecedenteCompleto | null>(null);
  
  // Estados para los datos relacionados
  const [enfermedades, setEnfermedades] = useState<Illness[]>([]);
  const [habitos, setHabitos] = useState<Habit[]>([]);
  const [medicaciones, setMedicaciones] = useState<Medication[]>([]);
  const [atencionesMedicas, setAtencionesMedicas] = useState<MedicalAttention[]>([]);
  
  const [loadingRelatedData, setLoadingRelatedData] = useState(false);

  if (!patient) {
    return null;
  }



  // Format date if available
  const formattedBirthDate = patient.fechanacimiento 
    ? format(new Date(patient.fechanacimiento), 'dd MMMM yyyy', { locale: es })
    : 'No registrada';

  // Calculate age if birth date is available
  const calculateAge = (birthDate: string): number | null => {
    if (!birthDate) return null;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const age = calculateAge(patient.fechanacimiento);

  const fetchAntecedentes = async () => {
    if (!patient) return;
    
    setLoadingAntecedentes(true);
    setLoadingError(null);
    
    try {
      const res = await fetch(`/api/patients/${patient.idpaciente}/antecedent`);
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      if (data && data.data) {
        // Convertir cada antecedente simple a antecedente completo
        const antecedentesCompletos: AntecedenteCompleto[] = data.data.map((ant: Antecedent) => ({
          ...ant,
          enfermedades: [],
          habitos: [],
          medicaciones: [],
          atencionesMedicas: []
        }));
        
        setAntecedentes(antecedentesCompletos);
        
        // Si hay al menos un antecedente, establecerlo como el actual
        if (antecedentesCompletos.length > 0) {
          setCurrentAntecedente(antecedentesCompletos[0]);
          // Fetch related data for the first antecedent
          fetchRelatedData(antecedentesCompletos[0].idantecedente!);
        }
      } else {
        setAntecedentes([]);
      }
      
      setShowAntecedentes(true);
    } catch (error) {
      console.error('Error fetching antecedentes:', error);
      setLoadingError(`Error al cargar los antecedentes: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoadingAntecedentes(false);
    }
  };

  const fetchRelatedData = async (antecedenteId: number) => {
    setLoadingRelatedData(true);
    
    try {
      // Realizar todas las peticiones en paralelo para mejorar rendimiento
      const [enfermedadesResponse, habitosResponse, medicacionesResponse, atencionesResponse] = await Promise.all([
        fetch(`/api/antecedents/${antecedenteId}/disease`),
        fetch(`/api/antecedents/${antecedenteId}/habits`),
        fetch(`/api/antecedents/${antecedenteId}/medication`),
        fetch(`/api/antecedents/${antecedenteId}/medicattention`)
      ]);
      
      // Procesar las respuestas
      if (enfermedadesResponse.ok) {
        const data = await enfermedadesResponse.json();
        setEnfermedades(data.data || []);
      } else {
        console.error('Error al obtener enfermedades:', enfermedadesResponse.statusText);
        setEnfermedades([]);
      }
      
      if (habitosResponse.ok) {
        const data = await habitosResponse.json();
        setHabitos(data.data || []);
      } else {
        console.error('Error al obtener hábitos:', habitosResponse.statusText);
        setHabitos([]);
      }
      
      if (medicacionesResponse.ok) {
        const data = await medicacionesResponse.json();
        setMedicaciones(data.data || []);
      } else {
        console.error('Error al obtener medicaciones:', medicacionesResponse.statusText);
        setMedicaciones([]);
      }
      
      if (atencionesResponse.ok) {
        const data = await atencionesResponse.json();
        setAtencionesMedicas(data.data || []);
      } else {
        console.error('Error al obtener atenciones médicas:', atencionesResponse.statusText);
        setAtencionesMedicas([]);
      }
      
    } catch (error) {
      console.error('Error general al obtener datos relacionados:', error);
      // Reiniciar todos los estados en caso de error
      setEnfermedades([]);
      setHabitos([]);
      setMedicaciones([]);
      setAtencionesMedicas([]);
    } finally {
      setLoadingRelatedData(false);
    }
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSelectAntecedente = (antecedente: AntecedenteCompleto) => {
    setCurrentAntecedente(antecedente);
    if (antecedente.idantecedente) {
      fetchRelatedData(antecedente.idantecedente);
    }
    setTabValue(0); // Reset to first tab when changing antecedent
  };

  // Format date for antecedentes
  const formatDate = (date: Date | string) => {
    if (!date) return 'No registrada';
    return format(new Date(date), 'dd MMMM yyyy', { locale: es });
  };

  const getEmbarazoLabel = (embarazo: boolean) => {
    return embarazo ? 'Sí' : 'No';
  };

  const getEmbarazoIcon = (embarazo: boolean) => {
    return embarazo ? <PregnantIcon color="primary" /> : <ChildCareIcon color="secondary" />;
  };


  return (
    <PatientDialog
      open={open}
      onClose={onClose}
      title="Información del Paciente"
      maxWidth="md"
      showActions={false}
    >
      <Box sx={{ pb: 2 }}>
        {/* Header with patient name and status */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
            {patient.nombres} {patient.apellidos}
          </Typography>
          <Chip 
            label={patient.habilitado ? 'Activo' : 'Inactivo'} 
            color={patient.habilitado ? 'success' : 'error'} 
            size="medium"
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Patient details */}
        <Grid container spacing={3}>
          {/* Personal Info */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="primary" sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 1,
                fontWeight: 'bold'
              }}>
                <PersonIcon sx={{ mr: 1 }} /> Información Personal
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Sexo
                  </Typography>
                  <Typography variant="body1">
                    {patient.sexo ? 'Masculino' : 'Femenino'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Estado Civil
                  </Typography>
                  <Typography variant="body1">
                    {patient.estadocivil || 'No registrado'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de Nacimiento
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon sx={{ mr: 0.5, fontSize: 'small', color: 'text.secondary' }} />
                    {formattedBirthDate}
                    {age !== null && (
                      <Chip 
                        label={`${age} años`} 
                        size="small" 
                        variant="outlined" 
                        sx={{ ml: 1 }} 
                      />
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Lugar de Nacimiento
                  </Typography>
                  <Typography variant="body1">
                    {patient.lugarnacimiento || 'No registrado'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="primary" sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 1,
                fontWeight: 'bold'
              }}>
                <PhoneIcon sx={{ mr: 1 }} /> Información de Contacto
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Teléfono Personal
                  </Typography>
                  <Typography variant="body1">
                    {patient.telefonopersonal || 'No registrado'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Teléfono Domicilio
                  </Typography>
                  <Typography variant="body1">
                    {patient.telefonodomicilio || 'No registrado'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Dirección
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <LocationIcon sx={{ mr: 0.5, fontSize: 'small', color: 'text.secondary', mt: 0.3 }} />
                    {patient.direccion || 'No registrada'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Additional Info */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    display: 'flex', 
                    alignItems: 'center'
                  }}>
                    <WorkIcon sx={{ mr: 0.5, fontSize: 'small' }} />
                    Ocupación
                  </Typography>
                  <Typography variant="body1" sx={{ ml: 3 }}>
                    {patient.ocupacion || 'No registrada'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    display: 'flex', 
                    alignItems: 'center'
                  }}>
                    <MedicalIcon sx={{ mr: 0.5, fontSize: 'small' }} />
                    Aseguradora
                  </Typography>
                  <Typography variant="body1" sx={{ ml: 3 }}>
                    {patient.aseguradora || 'No registrada'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onClose}
          >
            Cerrar
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<MedicalIcon />}
            onClick={fetchAntecedentes}
            disabled={loadingAntecedentes}
          >
            {loadingAntecedentes ? 'Cargando...' : 'Ver Antecedentes'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={onEdit}
          >
            Editar Paciente
          </Button>
        </Box>

        {/* Antecedentes Section */}
        {showAntecedentes && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center',
              borderBottom: '2px solid #3f51b5',
              pb: 1
            }}>
              <MedicalIcon sx={{ mr: 1, color: 'primary.main' }} />
              Antecedentes Médicos
            </Typography>

            {loadingAntecedentes ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : loadingError ? (
              <Box sx={{ my: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                <Typography color="error">{loadingError}</Typography>
              </Box>
            ) : antecedentes.length === 0 ? (
              <Paper elevation={1} sx={{ p: 3, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                <MedicalIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body1">No hay antecedentes registrados para este paciente.</Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {/* Lista de antecedentes (sidebar) */}
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ 
                    borderRadius: 2, 
                    overflow: 'hidden',
                    height: '100%'
                  }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        color: 'white', 
                        p: 1.5, 
                        fontWeight: 'bold' 
                      }}
                    >
                      Historial de Antecedentes
                    </Typography>
                    <List sx={{ p: 0 }}>
                      {antecedentes.map((antecedente, index) => (
                        <ListItem 
                          key={antecedente.idantecedente || index}
                          button
                          divider
                          selected={currentAntecedente?.idantecedente === antecedente.idantecedente}
                          onClick={() => handleSelectAntecedente(antecedente)}
                          sx={{ 
                            '&.Mui-selected': { 
                              bgcolor: 'primary.light',
                              '&:hover': {
                                bgcolor: 'primary.light',
                              }
                            }
                          }}
                        >
                          <ListItemIcon>
                            {getEmbarazoIcon(antecedente.embarazo)}
                          </ListItemIcon>
                          <ListItemText 
                            primary={`Antecedente #${antecedente.idantecedente}`}
                            secondary={formatDate(antecedente.fecha)}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>

                {/* Detalles del antecedente seleccionado */}
                <Grid item xs={12} md={8}>
                  {currentAntecedente ? (
                    <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                      <Box sx={{ 
                        bgcolor: 'primary.main', 
                        p: 2,
                        color: 'white'
                      }}>
                        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                          Detalle de Antecedente ({formatDate(currentAntecedente.fecha)})
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          {getEmbarazoIcon(currentAntecedente.embarazo)}
                          <Typography variant="body1" sx={{ ml: 1 }}>
                            Embarazo: {getEmbarazoLabel(currentAntecedente.embarazo)}
                          </Typography>
                        </Box>
                      </Box>

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

                      {loadingRelatedData ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                          <CircularProgress />
                        </Box>
                      ) : (
                        <>
                          <TabPanel value={tabValue} index={0}>
                            {enfermedades.length === 0 ? (
                              <Box sx={{ textAlign: 'center', py: 3 }}>
                                <LocalHospitalIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                <Typography>No hay enfermedades registradas</Typography>
                              </Box>
                            ) : (
                              <List>
                                {enfermedades.map((enfermedad) => (
                                  <ListItem key={enfermedad.idenfermedad}>
                                    <ListItemIcon>
                                      <LocalHospitalIcon color="error" />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={enfermedad.enfermedad}
                                      secondary={enfermedad.enfermedad || 'Sin descripción'}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            )}
                          </TabPanel>

                          <TabPanel value={tabValue} index={1}>
                            {habitos.length === 0 ? (
                              <Box sx={{ textAlign: 'center', py: 3 }}>
                                <FitnessCenterIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                <Typography>No hay hábitos registrados</Typography>
                              </Box>
                            ) : (
                              <List>
                                {habitos.map((habito) => (
                                  <ListItem key={habito.idhabito}>
                                    <ListItemIcon>
                                      <FitnessCenterIcon color="info" />
                                    </ListItemIcon>
                                    <ListItemText primary={habito.habito} />
                                  </ListItem>
                                ))}
                              </List>
                            )}
                          </TabPanel>

                          <TabPanel value={tabValue} index={2}>
                            {medicaciones.length === 0 ? (
                              <Box sx={{ textAlign: 'center', py: 3 }}>
                                <MedicationIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                <Typography>No hay medicaciones registradas</Typography>
                              </Box>
                            ) : (
                              <List>
                                {medicaciones.map((medicacion) => (
                                  <ListItem key={medicacion.idmedicacion}>
                                    <ListItemIcon>
                                      <MedicationIcon color="success" />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={medicacion.medicacion}
                                      secondary={medicacion.medicacion || 'Sin dosis especificada'}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            )}
                          </TabPanel>

                          <TabPanel value={tabValue} index={3}>
                            {atencionesMedicas.length === 0 ? (
                              <Box sx={{ textAlign: 'center', py: 3 }}>
                                <HealingIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                <Typography>No hay atenciones médicas registradas</Typography>
                              </Box>
                            ) : (
                              <List>
                                {atencionesMedicas.map((atencion) => (
                                  <ListItem key={atencion.idatencionmedica}>
                                    <ListItemIcon>
                                      <HealingIcon color="warning" />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={atencion.atencion}
                                      secondary={atencion.atencion || 'Sin descripción'}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            )}
                          </TabPanel>
                        </>
                      )}
                    </Paper>
                  ) : (
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                      <Typography variant="body1" color="text.secondary">
                        Seleccione un antecedente para ver detalles
                      </Typography>
                    </Paper>
                  )}
                </Grid>
              </Grid>
            )}
          </Box>
        )}
      </Box>
    </PatientDialog>
  );
};